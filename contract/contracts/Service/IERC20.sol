// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

/*
    ERC20 Standard Token interface
*/
contract IERC20 {
    // these functions aren't abstract since the compiler emits automatically generated getter functions as external
    //function balanceOf(address _owner) public pure returns (uint256) { _owner; }

    function transfer(address _to, uint256 _value) public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);
}