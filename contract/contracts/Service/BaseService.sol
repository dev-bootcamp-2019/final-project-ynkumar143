// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

import "../BaseStorageInterface.sol";

contract BaseService {

    /**** Properties ************/
    uint8 public version;                                                   // Version of this contract
    address public owner;

    /*** Contracts **************/
    BaseStorageInterface public eternalStorage = BaseStorageInterface(0);       // The main storage contract where primary persistant storage is maintained

    modifier onlyOwner() {
        roleCheck("owner", msg.sender);
        _;
    }

    /**
    * @dev Modifier to scope access to admins
    */
    modifier onlyAdmin() {
        roleCheck("admin", msg.sender);
        _;
    }

    /**
    * @dev Modifier to scope access to admins
    */
    modifier onlySuperUser() {
        require(roleHas("owner", msg.sender) || roleHas("admin", msg.sender));
        _;
    }

    /**
    * @dev Reverts if the address doesn't have this role
    */
    modifier onlyRole(string memory _role) {
        roleCheck(_role, msg.sender);
        _;
    }

    constructor(address _baseRepositoryAddress) public {
        owner = msg.sender;
        eternalStorage = BaseStorageInterface(_baseRepositoryAddress);
    }

    function roleHas(string memory _role, address _address) internal view returns (bool) {
        return eternalStorage.getBool(keccak256(abi.encodePacked("access.role", _role, _address)));
    }

    /**
   * @dev Check if an address has this role, reverts if it doesn't
   */
    function roleCheck(string memory _role, address _address)  internal view {
        require(roleHas(_role, _address) == true);
    }
}