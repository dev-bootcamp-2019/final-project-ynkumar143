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

    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event TransferDirect(address indexed _from, address indexed _to, uint256 _value, uint256 _time);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, address _eternalStorageAddress) public BaseService(_eternalStorageAddress){
        require(bytes(_name).length > 0 && bytes(_symbol).length > 0); // validate input

        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[msg.sender] = 1000000000000000000000;
        totalSupply = 1000000000000000000000;
    }

    // Get the token balance for account `tokenOwner`
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }

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

    function getAllowance(address _spender)
        public
        view
        returns (uint256)
    {
        return allowance[msg.sender][_spender];
    }
}

