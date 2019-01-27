// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

import './Service/IERC721.sol';
import "./Service/BaseService.sol";
import "./Library/Pausable.sol";

/// ERC721 non-fungible token
contract ERC721 is IERC721, BaseService, Pausable {

    /// @dev _name of the NFT tokend
    string _name; 

    string _symbol;

    // Follows the interface signature ERC165 format
    bytes4 constant InterfaceSignature_ERC165 =
        bytes4(keccak256("supportsInterface(bytes4)"));

    //Interface signature for controlling all function of ERC721
    bytes4 constant InterfaceSignature_ERC721 =
        bytes4(keccak256("name()")) ^
        bytes4(keccak256("symbol()")) ^
        bytes4(keccak256("totalSupply()")) ^
        bytes4(keccak256("balanceOf(address)")) ^
        bytes4(keccak256("ownerOf(uint256)")) ^
        bytes4(keccak256("approve(address,uint256)")) ^
        bytes4(keccak256("transfer(address,uint256)")) ^
        bytes4(keccak256("transferFrom(address,address,uint256)")) ^
        bytes4(keccak256("tokensOfOwner(address)")) ^
        bytes4(keccak256("tokenMetadata(uint256,string)"));
    

    address public owner;       // Smart contract owner

    string[] nfts;                 // tokens
    
    // Map created token index to the owner of the token
    mapping (uint256 => address) public tokenIndexToOwner;              // NFT ID --> owner address

    // Count variable that calculates the token count of each address
    mapping (address => uint256) ownershipTokenCount;                   // owner address --> NFT index

    //Verifies  the approved address
    mapping (uint256 => address) public tokenIndexToApproved;           // case ID --> new owner approved address

    mapping (address => mapping (address => uint256)) public allowance; // transfer allowance
    
    mapping (uint256 => uint256) public tokenStatusToID;

    //Emits Transfer event on successful transfer of token id
    event Transfer(address from, address to, uint256 tokenId);
    
    //Provide approval for the transfer of token id
    event Approval(address owner, address approved, uint256 tokenId);
    
    //Trigger event on successful creation of token
    event Birth(string assetID, address owner);

    /// @dev _transfer internal function that triggers from main transfer function
    /// @param _from From address from which token transfer have to take place
    /// @param _to To address to which token transfer have to take place
    /// @param _tokenId id of the token to transfer ownerhship
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        
        ownershipTokenCount[_to]++;
        tokenIndexToOwner[_tokenId] = _to;

        // _from == 0 for new NFT there is not any current owner
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            
            delete tokenIndexToApproved[_tokenId];
        }
        // Fire event
        emit Transfer(_from, _to, _tokenId);
    }
    
    /// @dev createNFT creats an NFT id by using asset ID and owner as the parametrs
    /// @param _assetID asset unique id to make the NFT ID unqiue
    /// @param _owner sends the owner of the token to assign ownership of the token
    /// @return unique token id value of the contract
    function createNFT(string memory _assetID, address _owner) public whenNotPaused returns (uint) {   
    
        // save new NFT in array and get token Id
        uint256 newId = nfts.push(_assetID) - 1; // push returns new array length, so caseId starts from 0
        if (newId == uint32(0)) {
            // we need to reserve index 0 as null, so let's push another copy and make it 1
            newId = nfts.push(_assetID) - 1;
        }
        require(newId == uint256(uint32(newId)));

        tokenStatusToID[newId] == 1;

        // emit the birth event
        emit Birth(_assetID , _owner);
        // transfer to the Owner
        _transfer(address(0), _owner, newId);
        // return new token Id > 0
        return newId;
    }
    
    /// @dev _owns internal function that checks the ownership of the token id
    /// @param _claimant the address for which the ownable is verified
    /// @param _tokenId token id to be verified authenticity
    /// @return returns the bool (true / false) based on the ownership result
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return tokenIndexToOwner[_tokenId] == _claimant;
    }
    
    /// @dev _approvedFor interanal function verifies whether token ID is provided approval to initiate transfer From function
    /// @param _claimant address verifying the approval of token
    /// @param _tokenId token id for which the approval check is done
    /// @return output the boolean response (true/false) based on the output
    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return tokenIndexToApproved[_tokenId] == _claimant;
    }
    
    /// @dev viewStatus displays the current status of token
    /// @param _tokenId token id for which the token status is verified
    /// @return displays the status of the token
    function viewStatus(uint256 _tokenId) public view returns (uint256) {
        return tokenStatusToID[_tokenId];
    }
    
    /// @dev updateStatus updates the status information on frequent State Machine maintainace
    /// @return output the update of state function result
    function updateStatus(uint256 _tokenId, uint256 _status) public returns (bool) {
        tokenStatusToID[_tokenId]  = _status;
        return true;
    }

    /// @dev _approve internal function provides approval for token id to spender
    /// @param _tokenId token id for which approval needs to be provided
    /// @param _approved addres to provide approval for the token id
    function _approve(uint256 _tokenId, address _approved) internal {
        tokenIndexToApproved[_tokenId] = _approved;
    }
    
    /// @dev _tokensOfOwner fetch the list of tokens that address is holding
    /// @param _owner address of the checking for list of tokens
    function _tokensOfOwner(address _owner) view internal returns(uint256[] memory ownerTokens) {
        require(_owner != address(0));
        uint256 tokenCount = balanceOf(_owner);
        
        if (tokenCount == 0) {
            return new uint256[](0);    // Return an empty array
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalCases = totalSupply(); // totalSupply is cases.lenght -1, 0 index is reserved
            uint256 resultIndex = 0;

            for (uint256 id = 1; id <= totalCases; id++) {
                if (tokenIndexToOwner[id] == _owner) {
                    result[resultIndex++] = id;
                }
            }
            return result;
        }
    }
    
    /// @dev name fetches the name of the token
    function name() public view returns (string memory) {
        return _name;
    }
    
    /// @dev symbol fetches symbol of the contract
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    /// @dev supportsInterface verifes the support ERC165 and ERC721 contract interface signatures
    /// @param _interfaceID pass the interface id for verifying signatures
    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }
   
    /// @dev balanceOf function that fetches the count of address is owner for
    /// @param _owner address of the user checking for ownership token count
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipTokenCount[_owner];
    }
    
    /// @dev transfer function for transferring token id to the sender address
    /// @param _to address of the spender for which token to be transferred
    /// @param _tokenId token id that token needs to be transferred
    function transfer(address _to, uint256 _tokenId) external whenNotPaused{
        require(_to != address(0));
        require(_to != address(this));

        require(_owns(msg.sender, _tokenId));
        _transfer(msg.sender, _to, _tokenId);
    }
    
    /// @dev approve provides approval for the token to initate transferFrom function
    /// @param _to the address for which token id transfer approval is to be done
    /// @param _tokenId token id for which approval action needs to be given
    function approve(address _to, uint256 _tokenId) external whenNotPaused{
        require(_owns(msg.sender, _tokenId));

        _approve(_tokenId, _to);
        emit Approval(msg.sender, _to, _tokenId);
    }
    
    /// @dev transferFrom function in which spender address is transfering token
    /// @param _from address of the for which token id is belonging to 
    /// @param _to address of the current user triggering function
    /// @param _tokenId id which the transfer should happend
    function transferFrom(address _from, address _to, uint256 _tokenId) external whenNotPaused{
        require(_to != address(0));
        require(_to != address(this));
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        _transfer(_from, _to, _tokenId);
    }
    
    /// @dev totalSupply fetches total supply of tokens created on the platform
    function totalSupply() public view returns (uint) {
        uint result = nfts.length;
        if (result > 0) {
            result = result - 1;
        }
        return result;
    }
    
    /// @dev ownerOf displys the address of the token id owner
    function ownerOf(uint256 _tokenId) external view returns (address) {
        address _owner = tokenIndexToOwner[_tokenId];

        require(_owner != address(0));
        return _owner;
    }
    
    /// @dev tokensOfOwner public function that calls to internal tokens of Owner function
    /// @param _owner address for which tokens are fetched
    function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        return _tokensOfOwner(_owner);
    }
    
    /// @dev tokenMetadata unique data information that is recorded for each asset
    /// @param _tokenId token id for wich metadata is to be fetched
    function tokenMetadata(uint256 _tokenId) public view returns (string memory infoUrl) {
        return nfts[_tokenId];
    }
    
    /// @dev constructor constructos the contract by inheriting eternal storage contract address
    /// @param _n refers the name of the token
    /// @param _s refers the symbol of the token
    /// @param _eternalStorageAddress basic storage address
    constructor(string memory _n, string memory _s, address _eternalStorageAddress) public  BaseService(_eternalStorageAddress){
        owner = msg.sender; _name = _n; _symbol = _s;
    }
}
