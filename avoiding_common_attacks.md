# Sybil attacks/Malacious attacks
As the Dapp is developed on Blockchain platform and using ethereum network, each ethereum address is assigned to each actor where any other participants are not able to use the resources or features of platforms. Contracts are maintained or controlled with identifying each address. 

# Circuit breaker/ Emergency Stop Mechanism
Pausible contract is being built for both ERC20 and ERC721 Tokens, when there is a bug detected the contract owner can activiate the pause and stop of the contract where any token transfers either ERC20 or ERC721 movement is freezed completely. All actions are controlled 

# Poison data
Most of the public access functions are controlled by verifying the original owner of the asset especially in starting the auction and closing auction

# Logic bugs
Inside the code, where ever the mathematic operations raised, properly held smart contract SafeMath is used to control the overflow/underflow errors. 

# Known vulnerabilities
Several known vulnerabilities like timestamp dependency attacks, re-entrancy attacks are properly controlled. 

# Overflow/Underflow Error
All arithmatic operations in ERC20 and ERC721 are controlled by using SafeMath operations from openzippelen contracts. 

# Re-entrancy attacks
Re-entrancy failure of the token transfers and distribution of tokens to bidder, finilizing the bids are properly rectified

# Time-Stamp Dependency attacks
Event the main contract is Auction mechanism which it should follow timer, the paramters are used to record the starting and ending of auction instead of using now or date.timestamp values. 

# Neglecting tx.origin usage
Even though contracts are inheriting from one another, all the tx.origin usage is neglected and using only msg.sender for transfer mechanism. 
