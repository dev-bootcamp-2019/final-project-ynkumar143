var assetRegistration = artifacts.require("./Asset.sol");
var marketplace = artifacts.require("./Marketplace.sol");
var erc721 = artifacts.require("./ERC721.sol")
var erc20 = artifacts.require("./ERC20.sol")

//This will interact with different functions inside the smart contract and perform operations
contract('Auction', function (accounts) {

    //Admin account specifying the owner of the contracts deployed
    const admin = accounts[0];

    //Owner of the asset that is registered
    const owner = accounts[1];

    //Bidder address for the auction
    const bidder_1 = accounts[2];

    //2nd Bidder used for placing bid on Auction started for one asset
    const bidder_2 = accounts[3];

    //Below test case will interact with createasset function and creates an NFT ID(ERC721)
    //Verifies with Event emitted values and sent values
    it("Case 1: Creates an Asset and store asset result in AssetIndex", async () => {
        //Get the contract instance that is deployed
        const assetContract = await assetRegistration.deployed();

        //Create asset function passing paramters according to the requirement (Name, Unique ID, Time, Value and Status)
        let create_res = await assetContract.createAsset("Monalisa", "AST01", "01252019", "1234", 0, { from: owner });
        const eventLog = create_res.logs.find(({ event }) => event == 'CreateAssetEvent');

        //Information logged in the event (For better understanding purpose)
        console.log("Information Logged in CreateAssetEvent: ", "\n Name:", eventLog.args._name,
            "\n Unique ID: ", eventLog.args._id, "\n Value:", eventLog.args._value, "\n Token Id: ", eventLog.args.tokenID.toString(), "\n Created By: ", eventLog.args.owner)

        //Comparing values with sent values by fetching from event emitted
        assert.equal(eventLog.args._name, "Monalisa", "Asset Name is not matching with asset name registered");
        assert.equal(eventLog.args._id, "AST01", "Asset Id is not matching with asset id registered");
        assert.equal(eventLog.args._value, "1234", "Asset value is not matching with asset value registered");
        assert.equal(eventLog.args.tokenID, 1, "Asset index is not matching with 1st Asset");
        assert.equal(eventLog.args.owner, owner, "Asset created holder is not matching with asset created holder Asset");
    });

    //Case 2 - Starts auction by owner of the above created asset
    //Checks with ERC721 Contract for finding that owner is assigned with asset
    it("Case 2: Starts Auction on Asset that is created and check Token Count to 1", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc721Contract = await erc721.deployed();

        //Interact with CreateAuction function by passing required paramters (Token ID, Reserve Price, Duration(Currently its default), Curren Timestamp)
        let create_res = await marketplaceContract.createAuction(1, 1200, 70, Date.now(), { from: owner });
        const eventLog = create_res.logs.find(({ event }) => event == 'CreateAuctionEvent');

        //Display the log information displayed in CreateAuctionEvent
        console.log("Information Logged in CreateAuctionEvent: ", "\n Token ID:", eventLog.args.tokenId.toString(),
            "\n Reserve Price: ", eventLog.args.reservePrice.toString(), "\n Creator:", eventLog.args.seller, "\n Auction Id: ", eventLog.args.auctionID.toString())

        //Map with the values that are logged in the contract
        assert.equal(eventLog.args.tokenId.toString(), "1", "Token id is not matching with created id");
        assert.equal(eventLog.args.reservePrice.toString(), "1200", "Reserve price is not matching registered price");
        assert.equal(eventLog.args.seller, owner, "Auction is not started by original owner");
        assert.equal(eventLog.args.auctionID.toString(), 1, "Auction is mapped with token id");

        //Fetch the balance of ERC721 contract and see the count of owner is inreased to 1
        let token_count = await erc721Contract.balanceOf(owner, { from: owner });
        console.log("Registered Token count is ", token_count)
        assert.equal(token_count.toString(), 1, "token count is not equal to 1");
    });

    // For placing Bid by bidder, bidder needs to have amount of tokens placing for
    // Bidder 1 is distributed with 10000 ERC20 Tokens
    it("Case 3: Transfer 10000 ERC tokens from admin to bidder_1 (Useful for placing Bid)", async () => {
        //Get ERC20 contract instance
        const erc20Contract = await erc20.deployed();

        //Initiate the transfer function sending tokens from contract creator to bidder
        let create_res = await erc20Contract.transfer(bidder_1, 10000, { from: admin });
        const eventLog = create_res.logs.find(({ event }) => event == 'Transfer');

        //see the log information of Transfer Event
        console.log("Information Logged in Transfer: ", "\n From:", eventLog.args._from.toString(),
            "\n To : ", eventLog.args._to.toString(), "\n Value:", eventLog.args._value.toString());

        //Compare values emitted in event with the values that are sent for transfer
        assert.equal(eventLog.args._from, admin, "Admin address is not matching with contract address");
        assert.equal(eventLog.args._to, bidder_1, "Bidder address is not matching");
        assert.equal(eventLog.args._value.toString(), 10000, "Value is deposited correctly");
    });

    // For placing bid by bidder, bidder needs to have amout of tokens for placing bid
    // Bidder 2 is distributed with 10000 ERC20 tokens
    it("Case 4: Transfer 10000 ERC tokens from admin to bidder_2(Useful for placing Bid)", async () => {
        //Get the contract instance
        const erc20Contract = await erc20.deployed();

        //Interact with ERC20 Contract Transfer function
        let create_res = await erc20Contract.transfer(bidder_2, 10000, { from: admin });

        //Find the log information captured in event
        const eventLog = create_res.logs.find(({ event }) => event == 'Transfer');

        console.log("Information Logged in Transfer: ", "\n From:", eventLog.args._from.toString(),
            "\n To : ", eventLog.args._to.toString(), "\n Value:", eventLog.args._value.toString());

        //Compare values emitted in event with the values that are sent for transfer
        assert.equal(eventLog.args._from, admin, "Admin address is not matching with contract address");
        assert.equal(eventLog.args._to, bidder_2, "Bidder address is not matching");
        assert.equal(eventLog.args._value.toString(), 10000, "Value is deposited correctly");
    });

    // Check the balance of bidder before placing bid
    // On successful check now create a bid on the auction started by particular asset
    // Provide approval for owner of the asset to transfer respective tokens from selected bid
    it("Case 5: Place bid by a bidder 1 On auction that is started (Check Balance before placing bid)", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc20Contract = await erc20.deployed();

        //Checks the balance of bidder
        let balance_amount = await erc20Contract.balanceOf(bidder_1);
        console.log("ERC20 Balance for bidder 1 is", balance_amount.toString())

        //Places bid on first auction
        let create_res = await marketplaceContract.createBid(1, 1350, Date.now(), { from: bidder_1 });
        const eventLog = create_res.logs.find(({ event }) => event == 'BidPlaced');

        //Check bid placed event for verifying information
        console.log("Information Logged in BidPlaced: ", "\n Token ID:", eventLog.args.tokenId.toString(),
            "\n Bid Price: ", eventLog.args.amount.toString(), "\n Creator:", eventLog.args.bidder);

        //Compare values with event logs 
        assert.equal(eventLog.args.tokenId.toString(), "1", "Token id is not matching with created id");
        assert.equal(eventLog.args.amount.toString(), "1350", "Bid price is not matching with bid placed");
        assert.equal(eventLog.args.bidder, bidder_1, "Bid placed address is not matching with the address");

        //Provide approval for tokens that are provided
        let create_res_approval = await erc20Contract.approve(owner, 1350, { from: bidder_1 });
        const eventLog_approval = create_res_approval.logs.find(({ event }) => event == 'Approval');

        console.log("Information Logged in Approval: ", "\n Owner:", eventLog_approval.args._owner.toString(),
            "\n Spender: ", eventLog_approval.args._spender.toString(), "\n Value:", eventLog_approval.args._value.toString());

        //Map values with event emitted in Approval function
        assert.equal(eventLog_approval.args._owner.toString(), bidder_1, "Bidder should provide approval for tokens");
        assert.equal(eventLog_approval.args._spender.toString(), owner, "Owner of the asset is not owner of the contract");
        assert.equal(eventLog_approval.args._value, 1350, "Approval provided value");
    });

    //Place bid by bidder on the auction of asset
    //Check balance before placing bid
    //Provide approval for number of tokens the bid is placed for
    it("Case 6: Place bid by a bidder 2 On auction that is started", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc20Contract = await erc20.deployed();

        //Check the balance of bidder 2 by interacting with balance of function in ERC20 Contract
        let balance_amount = await erc20Contract.balanceOf(bidder_2);
        console.log("ERC20 Balance for bidder 1 is", balance_amount)

        //Create a bid with higher value than above along with bid placed from bidder 2 address
        let create_res = await marketplaceContract.createBid(1, 1431, Date.now(), { from: bidder_2 });
        const eventLog = create_res.logs.find(({ event }) => event == 'BidPlaced');

        //Check the event log information for Bid placed event
        console.log("Information Logged in BidPlaced: ", "\n Token ID:", eventLog.args.tokenId.toString(),
            "\n Bid Price: ", eventLog.args.amount.toString(), "\n Creator:", eventLog.args.bidder);

        assert.equal(eventLog.args.tokenId.toString(), "1", "Token id is not matching with created id");
        assert.equal(eventLog.args.amount.toString(), "1431", "Bid price is not matching with bid placed");
        assert.equal(eventLog.args.bidder, bidder_2, "Bid placed address is not matching with the address");

        //Trigger to the approve function of erc20 contract and provide approval for the bid amount placed
        let create_res_approval = await erc20Contract.approve(owner, 1431, { from: bidder_2 });
        const eventLog_approval = create_res_approval.logs.find(({ event }) => event == 'Approval');

        console.log("Information Logged in Approval: ", "\n Owner:", eventLog_approval.args._owner.toString(),
            "\n Spender: ", eventLog_approval.args._spender.toString(), "\n Value:", eventLog_approval.args._value);

        assert.equal(eventLog_approval.args._owner.toString(), bidder_2, "Bidder should provide approval for tokens");
        assert.equal(eventLog_approval.args._spender.toString(), owner, "Owner of the asset is not owner of the contract");
        assert.equal(eventLog_approval.args._value, 1431, "Approval provided value");

    });

    //Stop acution and fetch the winning bid(The bid that have the highest value)
    //Transfer the tokens from winning bid owner using transferFrom function in ERC20 contract
    //By function transfer in ERC721 contract, transfer ownership of ERC721 to the winning bid participant
    it("Case 7: Process Auction (Fetches Winning Bid, Transfer tokens from ERC20 Contract, Transfer token ID to bidder)", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc20Contract = await erc20.deployed();
        const erc721Contract = await erc721.deployed();

        //Interact with processAuction function for fetching winning bid details
        let res = await marketplaceContract.processAuction.call(1, { from: owner });
        console.log("Winning Bid Details: ", "\n Bid Owner:", res[0].toString(),
            "\n Token ID: ", res[1].toString(), "\n bidId:", res[2].toString());

        //Interact with transfer from function and deduct tokens according to the winning bid
        let create_res = await erc20Contract.transferFrom(res[0], owner, res[3], { from: owner });
        const eventLog = create_res.logs.find(({ event }) => event == 'Transfer');

        //Map the values of the information emitted in Transfer event
        assert.equal(eventLog.args._from, res[0], "Bidder address is not matching with contract address");
        assert.equal(eventLog.args._to, owner, "owner address is not matching");
        assert.equal(eventLog.args._value.toString(), res[3], "Value transferred is not matching correctly");

        //Transfer token ownership from the winning bid particiapant
        let create_res_2 = await erc721Contract.transfer(res[0], 1, { from: owner });
        const eventLog_2 = create_res_2.logs.find(({ event }) => event == 'Transfer');

        console.log("Information Logged in Transfer: ", "\n From:", eventLog_2.args.from.toString(),
            "\n To : ", eventLog_2.args.to.toString(), "\n Value:", eventLog_2.args.tokenId);

        //Compare with values of winning bid details
        assert.equal(eventLog_2.args.from, owner, "owner address is not matching with contract address");
        assert.equal(eventLog_2.args.to, bidder_2, "Bidder address is not matching");
        assert.equal(eventLog_2.args.tokenId.toString(), 1, "token id is not transferred correctly");
    });

    //For validation purpose check the nft balance of the bidder 2 should increase by 1 and 
    // NFT balance of owner should decrease by 1 
    // ERC20 token balance of owner should increase by the same amount deducted from bidder 2
    it("Case 8: Display Balances (ERC721 balance of Bidder, ERC20 balances of the bidders)", async () => {
        const erc20Contract = await erc20.deployed();
        const erc721Contract = await erc721.deployed();

        let token_count = await erc721Contract.balanceOf(owner, { from: owner });
        console.log("Registered Token count is ", token_count)
        assert.equal(token_count.toString(), 0, "token count is not equal to 0");


        let token_count_bidder = await erc721Contract.balanceOf(bidder_2);
        console.log("Registered Token count is ", token_count_bidder)
        assert.equal(token_count_bidder.toString(), 1, "token count is not equal to 1");

        let balance_amount_owner = await erc20Contract.balanceOf(owner);
        console.log("ERC20 Balance for owner is", balance_amount_owner.toString())

        let balance_amount_bidder_1 = await erc20Contract.balanceOf(bidder_1);
        console.log("ERC20 Balance for Bidder 1 is", balance_amount_bidder_1.toString())

        let balance_amount_bidder_2 = await erc20Contract.balanceOf(bidder_2);
        console.log("ERC20 Balance for Bidder 2 is", balance_amount_bidder_2.toString())

    });
});