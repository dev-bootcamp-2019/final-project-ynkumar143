# Demo of Application

Video : https://youtu.be/zX6B4jjccL8

Screenshots: https://drive.google.com/drive/folders/1VhUl2R9NjlI_cAhlgbYZOyqRfKuvMcBf

# Auction Platform on Blockchain

Consensys Academy Developers Course

Link: https://courses.consensys.net/courses/course-v1:ConsenSysAcademy+2018DP+2/course/

## Introduction

All the online auction platforms that currently exist are based on one centralized operation. They rely on
proprietary and closed software. As a result of this centralization, these platforms share the same
limitations. i.e. Lack of transparency, Closed and Limited.
With blockchain, you will overcome these limitations and build a new auction platform that is open to
all, transparent in nature and is peer to peer.

Current Dapp that is developed will operate on [Ethereum](https://ethereum.org/) blockchain using native cryptocurrency as medium of money. 

ERC20 Contract is used for the usage of Asset Valuation and Buying the product. 

ERC721 is utlized to create an uniquely identified token for each Asset. 

The auction is built to allow anyone to register an asset that is available by providing (name, unique id and value) paramters. Once it is registered in asset smart contract it is sent to ERC721 Contract for creation of an NFT token. 

Once Unique NFT token is created, now the owner of asset is ready to place the product in auction by specifying minimum reserve price. On Successful Start of the Auction on smart contract an auction pool is started and ready to accept bids. 

Buyers will access the marketplace and place bids on particular asset by providing bid price. 

Owner now closes the auction by viewing bids required and on close contract transfers asset ownership to highest bidder by deducting ERC20 token money from the highest bidder. 

To represent above functionality, a sample UI is build and screenshots are captured detailing complete Demo. 

The contract itself are developed using the [Truffle](https://truffleframework.com/truffle) development framework v5.0.2, and [Solidity](https://solidity.readthedocs.io/en/v0.5.1/) compiler v0.5.0.


This dapp has been submitted as a final project for the Consensys Academy Developers Course, October 2018 - January 2019.

Rules followed while implementing Dapp

1. Owner of an item announces that an item is up for sale, sets the base price.
2. Each bidder has a fixed amount disposable for auction in his/her wallet. Bidder can’t bid more
than the wallet contents.
3. The bidders place their bids in real time and continue participating in the bidding process.
4. Each bid is visible to other bidders real time along with the name/ID of the bidder
5. Once the auction is closed, the ownership of the item changes to the highest bidder and the item
holds the info of the bid and ownership details.
6. After successful bid, the money from the highest bidder is transferred to the owner of the item.
7. If there is no bidder, mark the item as unsold.
8. Each participant in the ecosystem can be an owner or a bidder (not both at once).
Stakeholders:
1. Owner
2. Bidders

## App functionality

There are 3 sets of users

Contract owner - Contract owner deploys all the contracts and is readily available to distribute tokens to users on the platform. 

Owner - Owner of the asset registeres and start the auction and closes auction

Buyer/Bidder - Bids on the assets available on the marketplace and tracks the bids


**Contract Owner functionality**

- Deploy Contracts

- Freeze contract functionality (emergency stop)

- Upgrade Contracts

**Owner functionality**

- Register Asset

- Start Auction

- Stop Auction


**Buyer functionality**

- Places Bid

- View the list of Bids


**Initial deployment walkthrough**

###Instructions

1) Token ID: Uniquely Created NFT ID for asset registered in Home Page
2) Action: Specifies action to be performed by each User (Refer to User Stories in Readme Page)
3) Owner: Displays the ownership of current asset
4) Bids : Displays list of bids placed for that auction
5) Track the Asset Status(REGISTERED, MARKET, SOLD, UNSOLD) in View Information of each asset 

###User Actions

A) Asset owner user will have option to Start the Auction (If Owner is "YES", Auction Button will pop up)

B) User placing Bid the action will be "BID" 

C) Placed Bids can be seen in Bids Page 

D) Owner of the Asset can Stop Auction in Bids View Pop window 

###Backend Operations 

I) Asset Registeration will start an Auction Pool by mapping unique id(NFT ID) of Asset 

II) After placing Bid by bidder, asset owner request approval of tokens for the bid cost 

III) On Successful Close of Auction, asset(NFT) is transferred to selected bid owner and ERC20 tokens are deducted from selected bidder to Owner 

## Application setup

The source code for the marketplace dapp can be found on [Github](https://github.com/ynkumar143/final-project-ynkumar143). 

### Development Environment 

[VirtualBox v6.0](https://www.virtualbox.org/wiki/Downloads)

[VM OS - Ubuntu 18.4.0](https://www.ubuntu.com/download/desktop)


### Installations

[Ganache-cli](https://truffleframework.com/ganache)

[Truffle](https://truffleframework.com/truffle)

[Metamask](https://metamask.io/)


In command line, run the following commands as root/administrator.
```
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

To confirm installation
```
$ nodejs -v
```

To install Ganache-cli and Truffle, run
```
$ sudo npm install -g ganache-cli
$ sudo npm install -g truffle
```

To run the app, clone the Github repo to your local machine, and navigate to the contract folder.

In one terminal, run
```
$ ganache-cli
```

In another terminal (or tab), run
```
$ truffle migrate --reset
```
Note that the first instance of project setup may require administrator access - $sudo truffle migrate --reset


In another terminal (or tab), run
```
$ node app.js
```
This creates a local server in which the GUI can be accessed. The typical address is localhost:3001

Metamask setup in Localhost

Once the ganache-cli is running with localhost server (127.0.0.1:8545). Open your browser after successful installation of metamask, change the network to localhost 8545 in metamask. 

Now import an admin account from ganache-cli console (First account) and checkc the ERC20 token balance by adding ERC20 address in custom token setup. 

Rinkeby testnet Deployment

Once you have funds in your account, visit infura.io, create a free account and a new project. Change the project endpoint to "Rinkeby", and copy the project ID. Assign this ID to the infuraKey constant in truffle-config.js. Uncomment all code.

For Truffle to derive the Ethereum address from your mnemonic, Truffle HD wallet provider needs to be installed. Run the command
```
$ npm install truffle-hdwallet-provider
```
Once completed, type the following into your command line

```
$ truffle migrate --network rinkeby
```

Which should deploy the contract to the Rinkeby testnet.


## Project Requirements
### User Interface Requirements
- [x] Run the app on a dev server locally for testing/grading
- [x] You should be able to visit a URL and interact with the application
- [x] App recognizes current account
- [x] Sign transactions using MetaMask or uPort
- [x] Contract state is updated
- [x] Update reflected in UI
### Test Requirements
- [x] Write 5 tests for each contract you wrote
- [x] Solidity or JavaScript
- [x] Explain why you wrote those tests
- [x] Tests run with truffle test
### Design Pattern Requirements
- [x] Implement a circuit breaker (emergency stop) pattern
- [x] What other design patterns have you used / not used?
- [x] Why did you choose the patterns that you did?
- [x] Why not others?
### Security Tools / Common Attacks
- [x] Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
- [x] Use a library or extend a contract
- [x] Via EthPM or write your own
### Stretch Requirements
- [x] Deploy contract on testnet
- [x] Add functionality that allows store owners to create an auction
- [x] Implement functionality of ERC20 
- [x] Implement an upgradable design pattern (Asset Registration is Upgradable and following Eternal Storage standard)
- [ ] Use Ethereum Name Service
- [ ] Write a smart contract in LLL or Vyper
- [ ] Use uPort
- [ ] Use IPFS
- [ ] Use Oracle
