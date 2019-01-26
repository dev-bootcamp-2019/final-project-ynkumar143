// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

import './Service/IERC721.sol';
import "./Service/BaseService.sol";
import "./Library/Pausable.sol";

/// ERC721 non-fungible token
contract ERC721 is IERC721, BaseService, Pausable {

    string _name; 

    string _symbol;

    bytes4 constant InterfaceSignature_ERC165 =
        bytes4(keccak256("supportsInterface(bytes4)"));

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
   
    mapping (uint256 => address) public tokenIndexToOwner;              // NFT ID --> owner address

    mapping (address => uint256) ownershipTokenCount;                   // owner address --> NFT index

    mapping (uint256 => address) public tokenIndexToApproved;           // case ID --> new owner approved address

    mapping (address => mapping (address => uint256)) public allowance; // transfer allowance
    
    mapping (uint256 => uint256) public tokenStatusToID;

    event Transfer(address from, address to, uint256 tokenId);
    
    event Approval(address owner, address approved, uint256 tokenId);
    
    event Birth(string assetID, address owner);
   
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
    

    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return tokenIndexToOwner[_tokenId] == _claimant;
    }
    

    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return tokenIndexToApproved[_tokenId] == _claimant;
    }
    

    function viewStatus(uint256 _tokenId) public view returns (uint256) {
        return tokenStatusToID[_tokenId];
    }
    
    function updateStatus(uint256 _tokenId, uint256 _status) public returns (bool) {
        tokenStatusToID[_tokenId]  = _status;
        return true;
    }

    function _approve(uint256 _tokenId, address _approved) internal {
        tokenIndexToApproved[_tokenId] = _approved;
    }
    

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
    
    function name() public view returns (string memory) {
        return _name;
    }
    
    function symbol() public view returns (string memory) {
        return _symbol;
    }
    
    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {
        return ((_interfaceID == InterfaceSignature_ERC165) || (_interfaceID == InterfaceSignature_ERC721));
    }
   
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipTokenCount[_owner];
    }
    
    
    function transfer(address _to, uint256 _tokenId) external whenNotPaused{
        require(_to != address(0));
        require(_to != address(this));

        require(_owns(msg.sender, _tokenId));
        _transfer(msg.sender, _to, _tokenId);
    }
    
    function approve(address _to, uint256 _tokenId) external whenNotPaused{
        require(_owns(msg.sender, _tokenId));

        _approve(_tokenId, _to);
        emit Approval(msg.sender, _to, _tokenId);
    }
    
    function transferFrom(address _from, address _to, uint256 _tokenId) external whenNotPaused{
        require(_to != address(0));
        require(_to != address(this));
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        _transfer(_from, _to, _tokenId);
    }
    
    function totalSupply() public view returns (uint) {
        uint result = nfts.length;
        if (result > 0) {
            result = result - 1;
        }
        return result;
    }
    
    function ownerOf(uint256 _tokenId) external view returns (address) {
        address _owner = tokenIndexToOwner[_tokenId];

        require(_owner != address(0));
        return _owner;
    }
    
    function tokensOfOwner(address _owner) external view returns(uint256[] memory ownerTokens) {
        return _tokensOfOwner(_owner);
    }
    
    function tokenMetadata(uint256 _tokenId) public view returns (string memory infoUrl) {
        return nfts[_tokenId];
    }
    
    constructor(string memory _n, string memory _s, address _eternalStorageAddress) public  BaseService(_eternalStorageAddress){
        owner = msg.sender; _name = _n; _symbol = _s;
    }
}
