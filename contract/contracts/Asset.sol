// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

import "./Service/BaseService.sol";
import "./ERC721.sol";
import "./Service/IERC721.sol";

/// @dev AssetRegisteration contract that will register asset which is an unique ERC721 Contract
/// this smart contract is upgradable using eternal storage concept
contract Asset is BaseService {

    //Get the ERC721 instance with the interface
    IERC721 public erc721Contract = IERC721(0);

    /// @dev AssetRegistration will send eternal storage contract  address
    constructor(address _eternalStorageAddress) public BaseService(_eternalStorageAddress) {
        version = 1;
    }

    /*** Events ****************/
    event CreateAssetEvent (
        string _name,
        string _id,
        string _value,
        uint256 tokenID,
        address owner
    );


    /// @dev onlyAssetOwner only asset owner can update the status of the asset
    modifier onlyAssetOwner(uint256 assetIndex) {
        if (msg.sender != eternalStorage.getAddress(keccak256(abi.encodePacked("asset.address", assetIndex)))) {
            revert();
        }
        _;
    }
    
    /// @dev Store asset information and create a token for each asset
    /// @param _name name of the asset
    /// @param _id unique id of the asset
    /// @param _value of the asset
    /// @param _status of the asset
    function createAsset(string memory _name, string memory _id, string memory _date, string memory _value, uint256 _status) public returns(uint256) {
        //Get ERC721 Contract instance to create an account
        erc721Contract = IERC721(eternalStorage.getAddress(keccak256(abi.encodePacked("contract.name", "erc721Contract"))));

        //index that calculates total number of assets
        uint256  assetIndex = eternalStorage.getUint(keccak256("assets.total"));

        //increment asset index by 1
        assetIndex = assetIndex + 1;

        //set the date of asset added
        eternalStorage.setUint(keccak256(abi.encodePacked("asset.dateAdded", assetIndex)), now);
        
        //set the key value of asset.total
        eternalStorage.setUint(keccak256("asset.total"), assetIndex);

        //pass unique id of the asset for creating in NFT id
        uint256  tokenID  = erc721Contract.createNFT(_id, msg.sender);
       
        eternalStorage.setAddress(keccak256(abi.encodePacked("asset.address", assetIndex)), msg.sender);

        //name of the asset is mapped with index of the asset
        eternalStorage.setString(keccak256(abi.encodePacked("asset.name", assetIndex)), _name);

        //_id of the asset is mapped with index of asset
        eternalStorage.setString(keccak256(abi.encodePacked("asset.id", assetIndex)), _id);

        //_date of asset registered is mapped with index of asset
        eternalStorage.setString(keccak256(abi.encodePacked("asset.date", assetIndex)), _date);

        //NFT Token ID is mapped with asset index
        eternalStorage.setUint(keccak256(abi.encodePacked("asset.index", tokenID)), assetIndex);
        
        //_value is mapped with asset index
        eternalStorage.setString(keccak256(abi.encodePacked("asset.value", assetIndex)), _value);

        //status of asset is mapped with index
        eternalStorage.setUint(keccak256(abi.encodePacked("asset.Status", assetIndex)), _status);

        //detailed registered mapping is done here
        eternalStorage.setUint(keccak256(abi.encodePacked("asset.lastUpdated", assetIndex)), now);

        emit CreateAssetEvent(_name, _id, _value, tokenID,  msg.sender);
        return (assetIndex);
    }

    function updateAsset(uint256 _tokenId, uint256 status) public onlyAssetOwner(_tokenId){
         eternalStorage.setUint(keccak256(abi.encodePacked("asset.Status", _tokenId)), status);
    }

    function getAssetDetails(uint256 _tokenId) public view returns(
        string memory name, 
        string memory id, 
        string memory date, 
        string memory value, 
        uint256  status
    ) {

        uint256 assetIndex = eternalStorage.getUint(keccak256(abi.encodePacked("asset.index", _tokenId)));
       
        status = eternalStorage.getUint(keccak256(abi.encodePacked("asset.Status", assetIndex)));

        name = eternalStorage.getString(keccak256(abi.encodePacked("asset.name", assetIndex)));
        
        id = eternalStorage.getString(keccak256(abi.encodePacked("asset.id", assetIndex)));

        date = eternalStorage.getString(keccak256(abi.encodePacked("asset.date", assetIndex)));

        value = eternalStorage.getString(keccak256(abi.encodePacked("asset.value", assetIndex)));
    }
}

