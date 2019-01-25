// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
contract IERC721 {
    // Required methods
    function totalSupply() public view returns (uint256 total);
    function balanceOf(address _owner) public view returns (uint256 balance);
    function ownerOf(uint256 _tokenId) external view returns (address);
    function approve(address _to, uint256 _tokenId) external;
    function transfer(address _to, uint256 _tokenId) external;
    function transferFrom(address _from, address _to, uint256 _tokenId) external;

    // Events
    event Transfer(address from, address to, uint256 tokenId, uint256 time);
    event Approval(address owner, address approved, uint256 tokenId);

    // Optional
    function name() public view returns (string memory);
    function symbol() public view returns (string memory);
    function tokensOfOwner(address _owner) external view returns (uint256[] memory tokenIds);
    function tokenMetadata(uint256 _tokenId) public view returns (string memory infoUrl);
    function createNFT(string memory _assetID, address _owner) public returns (uint) ; 

    function viewStatus(uint256 _tokenId) public view returns (uint256) ;
    function updateStatus(uint256 _tokenId, uint256 _status) public returns (bool);

    // ERC-165 Compatibility (https://github.com/ethereum/EIPs/issues/165)
    function supportsInterface(bytes4 _interfaceID) external view returns (bool);
}