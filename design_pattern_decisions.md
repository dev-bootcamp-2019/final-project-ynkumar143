Below are the design patterns included in the project

#Access Control Mechanism (Restricting Access)
Appropriate modifiers are used in the contract to restrict actions like update asset and start auction only limited to asset owners that are registered on the platform. The contract also imports the Ownable contract from open Zippelin. 


#Circuit Breaker / Pausable
This pattern was implemented by importing and inheriting the Pausable contract from open zeppelin. This code is seen in  Pausable.sol. This allows us to pause various contract functions (ones that modify state) in case of a bug or DOS attack. 

Especially, the Dapp main functionality includes of ERC20 and ERC721 contract mechanims, all tokens transfers and approvals can be stopped by triggering action to pausable contracts. 

The way of implementation can be seen here. 

```
contract ERC721 is IERC721, BaseService, Pausable {

```

#Fail Early and Loud
Main functionality of this design pattern usage to revert any error that might occur inside the smart contract. Every condition is used in require / revert function to disply errors that are occured and fails when ever required. 

This pattern was implemented by using require statement to enforce various preconditions.


#Speed Bump
Timestamp is used inside the contracts but no where the time is controlling the access and causing timestamp dependency attacks. 

#State Machine 
Every action/status utilized in the marketplace is registering the state but not necessarily it follows the state to update the consequent action. 
