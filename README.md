# Demo of Application

Video : https://youtu.be/zX6B4jjccL8

Screenshots: https://drive.google.com/drive/folders/1VhUl2R9NjlI_cAhlgbYZOyqRfKuvMcBf

Any Query or ERC20 token balance request for testing the application when interacting with Ropsten testnet contracts. 

Reach me at : ynkumar.nagendra@gmail.com

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

### Upgradability

Smart contract especially Asset Registration (Asset.sol) is completely upgradable using the Eternal storage upgrade mechanism. 
All the contract instance are stored in cryptographic format and modify the contract address at any instance by changing business logic. 

Eternal Storage - This contract can't be updated and it is the contract only for storage based on data types. 

### Inherited Contracts

Contracts are inhertied using the BaseService.sol contract properties. Inheriting BaseService, Utils and Pause for Emergency Stop Mechanism are utilized in project structures. 

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

### Instructions

1) Token ID: Uniquely Created NFT ID for asset registered in Home Page
2) Action: Specifies action to be performed by each User (Refer to User Stories in Readme Page)
3) Owner: Displays the ownership of current asset
4) Bids : Displays list of bids placed for that auction
5) Track the Asset Status(REGISTERED, MARKET, SOLD, UNSOLD) in View Information of each asset 

### User Actions

A) Asset owner user will have option to Start the Auction (If Owner is "YES", Auction Button will pop up)

B) User placing Bid the action will be "BID" 

C) Placed Bids can be seen in Bids Page 

D) Owner of the Asset can Stop Auction in Bids View Pop window 

### Backend Operations 

I) Asset Registeration will start an Auction Pool by mapping unique id(NFT ID) of Asset 

II) After placing Bid by bidder, asset owner request approval of tokens for the bid cost 

III) On Successful Close of Auction, asset(NFT) is transferred to selected bid owner and ERC20 tokens are deducted from selected bidder to Owner 

## Application setup

The source code for the marketplace dapp can be found on [Github](https://github.com/dev-bootcamp-2019/final-project-ynkumar143). 

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
$ sudo npm install
```

```
$ ganache-cli
```

In another terminal (or tab), run
```
$ truffle migrate --reset
```
Note that the first instance of project setup may require administrator access - $sudo truffle migrate --reset


In another terminal (or tab) move to main folder (i.e ../) , run

```
$ sudo npm install
```

```
$ node app.js
```
This creates a local server in which the GUI can be accessed. The typical address is localhost:3001

In UI for using local contract addresses information, modify the contracts.js file with updated contract addresses. The same can be followed if you are connecting to mainnet, testnet(Ropsten, rinkeby, kovan) or private network. 

Below is the js file paramters to be updated. (ABI scripts are updated according to the finilized contracts) 

```
var contracts = {
    "list": {
      "erc20ContractAddress": "0x7bCB73d24bb9871D0CB54aCddab0F9c0286F0bEd",
      "marketPlaceContract" : "0x9d7b47D42CDaa285636f88Dd268b0Ff2b5704F3c",
      "assetContract": "0x21E27475c40D12238dD957b6A078Bc0E3c20Bd1d",
      "erc721Contract": "0x9AD86c64A6Cb8723897057982CEc968d3ff4298A"
    }
  }

```
### Metamask setup in Localhost

Once the ganache-cli is running with localhost server (127.0.0.1:8545). Open your browser after successful installation of metamask, change the network to localhost 8545 in metamask. 

Now import an admin account from ganache-cli console (First account) and checkc the ERC20 token balance by adding ERC20 address in custom token setup. 

### Demo View
Once you setup everything,a demo video will explain complete functionality of the project. https://youtu.be/zX6B4jjccL8

### Ropsten testnet Deployment

Once you have funds in your account, visit infura.io, create a free account and a new project. Change the project endpoint to "Rinkeby", and copy the project ID. Assign this ID to the infuraKey constant in truffle-config.js. Uncomment all code.

For Truffle to derive the Ethereum address from your mnemonic, Truffle HD wallet provider needs to be installed. Run the command
```
$ npm install truffle-hdwallet-provider
```
Once completed, type the following into your command line

```
$ truffle migrate --network ropsten
```

Which should deploy the contract to the Ropsten testnet.

##Testing

To test the scripts that are written in contracts/test folder. Those test cases can be executed by below commands. 

```
$ truffle develop

$ > migrate

$ > test


Below is the Test cases compilation done


nkumar@ynkumar:~/go/src/labs/final-project-ynkumar143/contract$ sudo truffle develop
[sudo] password for ynkumar: 
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0xb8f42455ea340d88490a447f1d6f8463737902dd
(1) 0x0701bfdb1033c0cc7517d6a3439c2527cdd683c3
(2) 0x125d59261df13d6e32d8b33c9a9bfd8fbf93059a
(3) 0x155308943bce6a13f306522a35e6b19289b436e9
(4) 0xb3d0596a135dcd9ca82821a190ee6560f75c36a1
(5) 0xd1e5f46d0aba32e4585606d05b7e167293dfea9f
(6) 0xc55cc83bfa13b01ea539dfe7fce66df5fc3e14a9
(7) 0xcc8d6c72a5478b1d6e4b4bb2c5cdf793eaa7681e
(8) 0x45a41aa192f5602a94fd43c0864ea4fff4a579fc
(9) 0xe88bbf51245a5b4dbd3ad034ae596e6ae72877b6

Private Keys:
(0) 5e18808098c0185ec8cf7b342ced17dbb2d2280467cc190063ec35a56b835837
(1) cb7c9056afaa4e471ecb1c4eb8e9bb53ba75b5e5e5621808f65bdef58e0e2d3e
(2) 5f410a4952a25dfb55d93dfd8dd78fbcff3119035b07e863aaaea54fcab69010
(3) 3f96a34e706b64cc493c33d4273e876a10f7c48895af86420f24e83badc021c3
(4) 540c3abe3b49f5fca06d77aab04498ef0b003a40e2ab11d5d89657745d98404b
(5) 56df350a1fa032a9881dac12ee2f080fcd3c5af0952cec8f621af83fa7b6b013
(6) bb270e7968c798bd1f80fb24b4b02e408696026e52f60091a84663ba32999769
(7) ebdf99e8f16d8fc7aae7ea120578e11a2fbbd70cef607a2a76c999820d32bdc0
(8) b355b89e72bb087d0d7d95f90612dbb6b5d24ac10f692963b6249b3236a81362
(9) 89c3ce5cb661cfb490149b71beeaaf2eb31df1a23451ac092f579ed8b69c754d

Mnemonic: analyst across only blouse match move rail onion fortune sail arrest belt

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
Ensure you do not use it on production blockchains, or else you risk losing funds.

truffle(develop)> migrate
⚠️  Important ⚠️
If you're using an HDWalletProvider, it must be Web3 1.0 enabled or your migration will hang.


Starting migrations...
======================
> Network name:    'develop'
> Network id:      4447
> Block gas limit: 6721975


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x95428b23ea20fb36e3edd3db1ba7867492c8534c93feb85c835be3b5614c756c
   > Blocks: 0            Seconds: 0
   > contract address:    0xbC5b60ef493668d11Edd92e3484B4C32254da68f
   > account:             0xb8f42455EA340d88490A447f1d6f8463737902Dd
   > balance:             99.99430312
   > gas used:            284844
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00569688 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00569688 ETH


2_deploy_contracts.js
=====================

   Deploying 'BaseStorage'
   -----------------------
   > transaction hash:    0xf50022740662da4adf96159be65e82b36a39e891d7398237b30519f4b02c3bed
   > Blocks: 0            Seconds: 0
   > contract address:    0x2040db5529953545888035863fD39c9d0BE12794
   > account:             0xb8f42455EA340d88490A447f1d6f8463737902Dd
   > balance:             99.94593076
   > gas used:            2376584
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.04753168 ETH


   Deploying 'Asset'
   -----------------
   > transaction hash:    0xf94cf63fd5c481a85af4fa9576a0a31c91427c3bfe61e31902b7ca57e67bbe16
   > Blocks: 0            Seconds: 0
   > contract address:    0xC8e38B78C5d60932408Ccc2BF4817B3a9966326a
   > account:             0xb8f42455EA340d88490A447f1d6f8463737902Dd
   > balance:             99.89687052
   > gas used:            2453012
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.04906024 ETH


   Deploying 'ERC721'
   ------------------
   > transaction hash:    0x891f2dbbd0335c2403bd5fedbcb20f0a6c38fb806e26de53e638c93f8ba70de8
   > Blocks: 0            Seconds: 0
   > contract address:    0x1dEe4c2CC0B5015ca87760F6C7f798154Ab55B38
   > account:             0xb8f42455EA340d88490A447f1d6f8463737902Dd
   > balance:             99.84229044
   > gas used:            2729004
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.05458008 ETH


   Deploying 'ERC20'
   -----------------
   > transaction hash:    0xc2b2277216da39d2da696ed4b7afe6cc37a114852532611c56f0932edb216d47
   > Blocks: 0            Seconds: 0
   > contract address:    0x9d949493e34522fD27ec3aB979a1F4FaCdD67D0c
   > account:             0xb8f42455EA340d88490A447f1d6f8463737902Dd
   > balance:             99.8060526
   > gas used:            1811892
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.03623784 ETH


   Deploying 'Marketplace'
   -----------------------
   > transaction hash:    0xf06d6464ec60df3b5a04e5718640e6e3d817c0ef78b3efe3eac5d599bed7de3a
   > Blocks: 0            Seconds: 0
   > contract address:    0x7624354380b825F18B5a4E23Ca307C302BB54266
   > account:             0xb8f42455EA340d88490A447f1d6f8463737902Dd
   > balance:             99.77661756
   > gas used:            1471752
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.02943504 ETH



Set Storage Address:
0x2040db5529953545888035863fD39c9d0BE12794
Set Asset Storage Address:
0xC8e38B78C5d60932408Ccc2BF4817B3a9966326a
Set ERC721 Address:
0x1dEe4c2CC0B5015ca87760F6C7f798154Ab55B38
Set ERC20 Address:
0x9d949493e34522fD27ec3aB979a1F4FaCdD67D0c
Set Marketplace Address:
0x7624354380b825F18B5a4E23Ca307C302BB54266

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.21684488 ETH


Summary
=======
> Total deployments:   6
> Final cost:          0.22254176 ETH

truffle(develop)> test
Using network 'develop'.



Set Storage Address:
0xf59dDCF041d2C1136f79977F7e610Ecf07Aafb8f
Set Asset Storage Address:
0x213d4A2E25E48b5a18C9a293e35dC8c37D9F5dDF
Set ERC721 Address:
0x02670F667dCb5EbFD0EEe232E4561dce1f9B1962
Set ERC20 Address:
0x5350934ee3BDd552d47EDAa3a18f035b68089E56
Set Marketplace Address:
0xB0Ee821DeDfa25462C7F65c274c6a2a6FAB3a89D


  Contract: Auction
Information Logged in CreateAssetEvent:  
 Name: Monalisa 
 Unique ID:  AST01 
 Value: 1234 
 Token Id:  1 
 Created By:  0x0701bfDb1033c0Cc7517d6a3439C2527cdd683c3
    ✓ Case 1: Creates an Asset and store asset result in AssetIndex (134ms)
Information Logged in CreateAuctionEvent:  
 Token ID: 1 
 Reserve Price:  1200 
 Creator: 0x0701bfDb1033c0Cc7517d6a3439C2527cdd683c3 
 Auction Id:  1
Registered Token count is  <BN: 1>
    ✓ Case 2: Starts Auction on Asset that is created and check Token Count to 1 (84ms)
Information Logged in Transfer:  
 From: 0xb8f42455EA340d88490A447f1d6f8463737902Dd 
 To :  0x125d59261df13d6e32d8B33c9a9bfD8fbf93059A 
 Value: 10000
    ✓ Case 3: Transfer 10000 ERC tokens from admin to bidder_1 (Useful for placing Bid) (80ms)
Information Logged in Transfer:  
 From: 0xb8f42455EA340d88490A447f1d6f8463737902Dd 
 To :  0x155308943BCe6a13F306522A35e6b19289b436e9 
 Value: 10000
    ✓ Case 4: Transfer 10000 ERC tokens from admin to bidder_2(Useful for placing Bid)
ERC20 Balance for bidder 1 is 10000
Information Logged in BidPlaced:  
 Token ID: 1 
 Bid Price:  1350 
 Creator: 0x125d59261df13d6e32d8B33c9a9bfD8fbf93059A
Information Logged in Approval:  
 Owner: 0x125d59261df13d6e32d8B33c9a9bfD8fbf93059A 
 Spender:  0x0701bfDb1033c0Cc7517d6a3439C2527cdd683c3 
 Value: 1350
    ✓ Case 5: Place bid by a bidder 1 On auction that is started (Check Balance before placing bid) (125ms)
ERC20 Balance for bidder 1 is <BN: 2710>
Information Logged in BidPlaced:  
 Token ID: 1 
 Bid Price:  1431 
 Creator: 0x155308943BCe6a13F306522A35e6b19289b436e9
Information Logged in Approval:  
 Owner: 0x155308943BCe6a13F306522A35e6b19289b436e9 
 Spender:  0x0701bfDb1033c0Cc7517d6a3439C2527cdd683c3 
 Value: <BN: 597>
    ✓ Case 6: Place bid by a bidder 2 On auction that is started (100ms)
Winning Bid Details:  
 Bid Owner: 0x155308943BCe6a13F306522A35e6b19289b436e9 
 Token ID:  1 
 bidId: 2
Information Logged in Transfer:  
 From: 0x0701bfDb1033c0Cc7517d6a3439C2527cdd683c3 
 To :  0x155308943BCe6a13F306522A35e6b19289b436e9 
 Value: <BN: 1>
    ✓ Case 7: Process Auction (Fetches Winning Bid, Transfer tokens from ERC20 Contract, Transfer token ID to bidder) (98ms)
Registered Token count is  <BN: 0>
Registered Token count is  <BN: 1>
ERC20 Balance for owner is 1431
ERC20 Balance for Bidder 1 is 10000
ERC20 Balance for Bidder 2 is 8569
    ✓ Case 8: Display Balances (ERC721 balance of Bidder, ERC20 balances of the bidders) (76ms)


  8 passing (787ms)
```




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
- [x] Inherited Contracts
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
