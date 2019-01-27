// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

import './Service/IERC20.sol';
import "./Service/BaseService.sol";
import "./Library/Utils.sol";
import "./Library/Pausable.sol";

/**
    ERC20 Standard Token implementation
*/
contract ERC20 is IERC20, Utils, BaseService, Pausable {

    string name; 

    string symbol; 

    uint256 decimals; 
   
    uint256 public totalSupply = 0;

    //mapping variable to record all balances information mapping with each user and count
    mapping (address => uint256) public balances;

    //mapping that calculates the allowance of token information
    mapping (address => mapping (address => uint256)) public allowance;

    //Triggers transfer event on successful transfer of ERC20 tokens
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //event emitted on successful approval of tokens
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /// @dev constructor function that uses symbols fetched in contract deployment
    /// @param _name name of the contract to display in other wallet services
    /// @param _symbol symbol of the token created
    /// @param _decimals number of decimals places the token is created for
    /// @param _eternalStorageAddress storage contract address that records the information 
    constructor(string memory _name, string memory _symbol, uint8 _decimals, address _eternalStorageAddress) public BaseService(_eternalStorageAddress){
        require(bytes(_name).length > 0 && bytes(_symbol).length > 0); // validate input

        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[msg.sender] = 1000000000000000000000;
        totalSupply = 1000000000000000000000;
    }

    /// @dev balanceOf gets the token balance 
    /// @param tokenOwner address of the user trying to see token balance
    /// @return balance displys the balance of tokens of each address
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }

    /// @dev transfer function that transfer the tokens to _to address
    /// @param _to address to which transfer should take place
    /// @param _value amount of tokens to transfer for
    function transfer(address _to, uint256 _value)
        public
        validAddress(_to)
        whenNotPaused
        returns (bool success)
    {
        balances[msg.sender] = safeSub(balances[msg.sender], _value);
        balances[_to] = safeAdd(balances[_to], _value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /// @dev transferFrom function that uses to transfer tokens that are approved
    /// @param _from address of which the current ownership of tokens verified
    /// @param _to address to which the token transfer should happen
    /// @param _value amount of tokens to transfer for
    function transferFrom(address _from, address _to, uint256 _value)
        public
        validAddress(_from)
        validAddress(_to)
        whenNotPaused
        returns (bool success)
    {
        allowance[_from][msg.sender] = safeSub(allowance[_from][msg.sender], _value);
        balances[_from] = safeSub(balances[_from], _value);
        balances[_to] = safeAdd(balances[_to], _value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    /// @dev approve provides approval for number of tokens
    /// @param _spender address of the user that initiates transferFrom function
    /// @param _value amount of tokens tokens should be provided approval for
    function approve(address _spender, uint256 _value)
        public
        validAddress(_spender)
        whenNotPaused
        returns (bool success)
    {
        // if the allowance isn't 0, it can only be updated to 0 to prevent an allowance change immediately after withdrawal
        //require(_value == 0, "Value coming for approve is 0");

        allowance[msg.sender][_spender] = safeAdd(allowance[msg.sender][_spender], _value);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // @dev fetches allowance token for the spender
    function getAllowance(address _spender)
        public
        view
        returns (uint256)
    {
        return allowance[msg.sender][_spender];
    }
}

