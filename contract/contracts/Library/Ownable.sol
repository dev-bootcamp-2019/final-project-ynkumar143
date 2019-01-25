// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;


/*
 * Ownable
 *
 * Base contract with an owner.
 * Provides onlyOwner modifier, which prevents function from running if it is called by anyone other than the owner.
 */
contract Ownable {
    address public owner;
    address public newOwner;

    /*** Events ****************/
    event OwnerUpdate(address indexed _prevOwner, address indexed _newOwner);

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert();
        }
        _;
    }

    function transferOwnership(address _newOwner) onlyOwner  public {
        if (_newOwner != address(0)) {
            owner = _newOwner;
        }
    }

     /**
        @dev used by a new owner to accept an ownership transfer
    */
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnerUpdate(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }

    constructor()  public {
        owner = msg.sender;
    }

    

}
