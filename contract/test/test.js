var assetRegistration = artifacts.require("./Asset.sol");
var marketplace = artifacts.require("./Marketplace.sol");
var erc721 = artifacts.require("./ERC721.sol")
var erc20 = artifacts.require("./ERC20.sol")

contract('Auction', function (accounts) {
    const admin = accounts[0];
    const owner = accounts[1];
    const bidder_1 = accounts[2];
    const bidder_2 = accounts[3];


    it("Case 1: Creates an Asset and store asset result in AssetIndex", async () => {
        const assetContract = await assetRegistration.deployed();

        let create_res = await assetContract.createAsset("Monalisa", "AST01", "01252019", "1234", 0, { from: owner });
        const eventLog = create_res.logs.find(({ event }) => event == 'CreateAssetEvent');

        console.log("Information Logged in CreateAssetEvent: ", "\n Name:", eventLog.args._name,
            "\n Unique ID: ", eventLog.args._id, "\n Value:", eventLog.args._value, "\n Token Id: ", eventLog.args.tokenID.toString(), "\n Created By: ", eventLog.args.owner)

        assert.equal(eventLog.args._name, "Monalisa", "Asset Name is not matching with asset name registered");
        assert.equal(eventLog.args._id, "AST01", "Asset Id is not matching with asset id registered");
        assert.equal(eventLog.args._value, "1234", "Asset value is not matching with asset value registered");
        assert.equal(eventLog.args.tokenID, 1, "Asset index is not matching with 1st Asset");
        assert.equal(eventLog.args.owner, owner, "Asset created holder is not matching with asset created holder Asset");
    });

    it("Case 2: Starts Auction on Asset that is created and check Token Count to 1", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc721Contract = await erc721.deployed();

        let create_res = await marketplaceContract.createAuction(1, 1200, 70, Date.now(), { from: owner });
        const eventLog = create_res.logs.find(({ event }) => event == 'CreateAuctionEvent');

        console.log("Information Logged in CreateAuctionEvent: ", "\n Token ID:", eventLog.args.tokenId.toString(),
            "\n Reserve Price: ", eventLog.args.reservePrice.toString(), "\n Creator:", eventLog.args.seller, "\n Auction Id: ", eventLog.args.auctionID.toString())

        assert.equal(eventLog.args.tokenId.toString(), "1", "Token id is not matching with created id");
        assert.equal(eventLog.args.reservePrice.toString(), "1200", "Reserve price is not matching registered price");
        assert.equal(eventLog.args.seller, owner, "Auction is not started by original owner");
        assert.equal(eventLog.args.auctionID.toString(), 1, "Auction is mapped with token id");

        let token_count = await erc721Contract.balanceOf(owner, { from: owner });
        console.log("Registered Token count is ", token_count)
        assert.equal(token_count.toString(), 1, "token count is not equal to 1");
    });

    it("Case 3: Transfer 10000 ERC tokens from admin to bidder_1 (Useful for placing Bid)", async () => {
        const erc20Contract = await erc20.deployed();

        let create_res = await erc20Contract.transfer(bidder_1, 10000, { from: admin });
        const eventLog = create_res.logs.find(({ event }) => event == 'Transfer');

        console.log("Information Logged in Transfer: ", "\n From:", eventLog.args._from.toString(),
            "\n To : ", eventLog.args._to.toString(), "\n Value:", eventLog.args._value.toString());

        assert.equal(eventLog.args._from, admin, "Admin address is not matching with contract address");
        assert.equal(eventLog.args._to, bidder_1, "Bidder address is not matching");
        assert.equal(eventLog.args._value.toString(), 10000, "Value is deposited correctly");
    });

    it("Case 4: Transfer 10000 ERC tokens from admin to bidder_2(Useful for placing Bid)", async () => {
        const erc20Contract = await erc20.deployed();

        let create_res = await erc20Contract.transfer(bidder_2, 10000, { from: admin });
        const eventLog = create_res.logs.find(({ event }) => event == 'Transfer');

        console.log("Information Logged in Transfer: ", "\n From:", eventLog.args._from.toString(),
            "\n To : ", eventLog.args._to.toString(), "\n Value:", eventLog.args._value.toString());

        assert.equal(eventLog.args._from, admin, "Admin address is not matching with contract address");
        assert.equal(eventLog.args._to, bidder_2, "Bidder address is not matching");
        assert.equal(eventLog.args._value.toString(), 10000, "Value is deposited correctly");
    });

    it("Case 5: Place bid by a bidder 1 On auction that is started (Check Balance before placing bid)", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc20Contract = await erc20.deployed();

        //Checks the balance of bidder
        let balance_amount = await erc20Contract.balanceOf(bidder_1);
        console.log("ERC20 Balance for bidder 1 is", balance_amount.toString())

        //Places bid on first auction
        let create_res = await marketplaceContract.createBid(1, 1350, Date.now(), { from: bidder_1 });
        const eventLog = create_res.logs.find(({ event }) => event == 'BidPlaced');

        console.log("Information Logged in BidPlaced: ", "\n Token ID:", eventLog.args.tokenId.toString(),
            "\n Bid Price: ", eventLog.args.amount.toString(), "\n Creator:", eventLog.args.bidder);

        assert.equal(eventLog.args.tokenId.toString(), "1", "Token id is not matching with created id");
        assert.equal(eventLog.args.amount.toString(), "1350", "Bid price is not matching with bid placed");
        assert.equal(eventLog.args.bidder, bidder_1, "Bid placed address is not matching with the address");


        let create_res_approval = await erc20Contract.approve(owner, 1350, { from: bidder_1 });
        const eventLog_approval = create_res_approval.logs.find(({ event }) => event == 'Approval');

        console.log("Information Logged in Approval: ", "\n Owner:", eventLog_approval.args._owner.toString(),
            "\n Spender: ", eventLog_approval.args._spender.toString(), "\n Value:", eventLog_approval.args._value.toString());

        assert.equal(eventLog_approval.args._owner.toString(), bidder_1, "Bidder should provide approval for tokens");
        assert.equal(eventLog_approval.args._spender.toString(), owner, "Owner of the asset is not owner of the contract");
        assert.equal(eventLog_approval.args._value, 1350, "Approval provided value");
    });

    it("Case 6: Place bid by a bidder 2 On auction that is started", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc20Contract = await erc20.deployed();

        let balance_amount = await erc20Contract.balanceOf(bidder_2);
        console.log("ERC20 Balance for bidder 1 is", balance_amount)


        let create_res = await marketplaceContract.createBid(1, 1431, Date.now(), { from: bidder_2 });
        const eventLog = create_res.logs.find(({ event }) => event == 'BidPlaced');

        console.log("Information Logged in BidPlaced: ", "\n Token ID:", eventLog.args.tokenId.toString(),
            "\n Bid Price: ", eventLog.args.amount.toString(), "\n Creator:", eventLog.args.bidder);

        assert.equal(eventLog.args.tokenId.toString(), "1", "Token id is not matching with created id");
        assert.equal(eventLog.args.amount.toString(), "1431", "Bid price is not matching with bid placed");
        assert.equal(eventLog.args.bidder, bidder_2, "Bid placed address is not matching with the address");


        let create_res_approval = await erc20Contract.approve(owner, 1431, { from: bidder_2 });
        const eventLog_approval = create_res_approval.logs.find(({ event }) => event == 'Approval');

        console.log("Information Logged in Approval: ", "\n Owner:", eventLog_approval.args._owner.toString(),
            "\n Spender: ", eventLog_approval.args._spender.toString(), "\n Value:", eventLog_approval.args._value);

        assert.equal(eventLog_approval.args._owner.toString(), bidder_2, "Bidder should provide approval for tokens");
        assert.equal(eventLog_approval.args._spender.toString(), owner, "Owner of the asset is not owner of the contract");
        assert.equal(eventLog_approval.args._value, 1431, "Approval provided value");

    });

    it("Case 7: Process Auction (Fetches Winning Bid, Transfer tokens from ERC20 Contract, Transfer token ID to bidder)", async () => {
        const marketplaceContract = await marketplace.deployed();
        const erc20Contract = await erc20.deployed();
        const erc721Contract = await erc721.deployed();

        let res = await marketplaceContract.processAuction.call(1, { from: owner });
        console.log("Winning Bid Details: ", "\n Bid Owner:", res[0].toString(),
            "\n Token ID: ", res[1].toString(), "\n bidId:", res[2].toString());

        let create_res = await erc20Contract.transferFrom(bidder_2, owner, res[3], { from: owner });
        const eventLog = create_res.logs.find(({ event }) => event == 'Transfer');

        assert.equal(eventLog.args._from, bidder_2, "Bidder address is not matching with contract address");
        assert.equal(eventLog.args._to, owner, "owner address is not matching");
        assert.equal(eventLog.args._value.toString(), res[3], "Value transferred is not matching correctly");

        let create_res_2 = await erc721Contract.transfer(bidder_2, 1, { from: owner });
        const eventLog_2 = create_res_2.logs.find(({ event }) => event == 'Transfer');

        console.log("Information Logged in Transfer: ", "\n From:", eventLog_2.args.from.toString(),
            "\n To : ", eventLog_2.args.to.toString(), "\n Value:", eventLog_2.args.tokenId);

        assert.equal(eventLog_2.args.from, owner, "owner address is not matching with contract address");
        assert.equal(eventLog_2.args.to, bidder_2, "Bidder address is not matching");
        assert.equal(eventLog_2.args.tokenId.toString(), 1, "token id is not transferred correctly");
    });

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


        // let resToken = await erc721Address.tokensOfOwner(web3.eth.accounts[1]);
        // console.log("Tokens of Owner are", resToken.valueOf());    

        // await erc20Address.increaseSupply(3000, web3.eth.accounts[1], {from:web3.eth.accounts[0]});
        // //console.log("Deposit to Account1", resAccount1.valueOf());

        // await erc20Address.increaseSupply(3000, web3.eth.accounts[2], {from:web3.eth.accounts[0]});
        // //console.log("Deposit to Account2", resAccount2.valueOf());

        // await erc20Address.increaseSupply(3000, web3.eth.accounts[3], {from:web3.eth.accounts[0]});
        // //console.log("Deposit to Account3", resAccount3.valueOf());

        // let balance_1 = await erc20Address.balanceOf(web3.eth.accounts[1]);
        // console.log("Balance of 1st User", balance_1.valueOf());

        // let balance_2 = await erc20Address.balanceOf(web3.eth.accounts[2]);
        // console.log("Balance of 2nd User", balance_2.valueOf());

        // let balance_3 = await erc20Address.balanceOf(web3.eth.accounts[3]);
        // console.log("Balance of 3rd User", balance_3.valueOf());

        // console.log("Starting Auction on Token ID", log.args.tokenID);
        // let res2 = await auctionRepository.createAuction(log.args.tokenID, 500, 70, web3.eth.accounts[1], { from: web3.eth.accounts[1] });
        // const log2 = res2.logs.find(({ event }) => event == 'CreateAuctionEvent');
        // let AuctionID = log2.args.auctionID;
        // assert.notEqual(log2, undefined); // Check that an event was logged
        // assert.equal(AuctionID, log2.args.auctionID);


        // console.log("Placing first bid");
        // let res3 = await auctionRepository.createBid(web3.eth.accounts[2], log.args.tokenID, 501, "Time", { from: web3.eth.accounts[2] });
        // const log3 = res3.logs.find(({ event }) => event == 'BidPlaced');
        // console.log("Bid placed for ", log3.args.amount, log3.args.bidder);


        // console.log("Placing second bid");
        // let res4 = await auctionRepository.createBid(web3.eth.accounts[3], log.args.tokenID, 505, "Time 2", { from: web3.eth.accounts[3] });
        // const log4 = res4.logs.find(({ event }) => event == 'BidPlaced');
        // console.log("Bid placed for ", log4.args.amount, log4.args.bidder);

        // console.log("Size of Auction is");
        // let resAuc = await auctionRepository.getAuctionSize(log.args.tokenID);
        // console.log(resAuc.valueOf());

        // console.log("List of bids for this Auction");
        // let resAucDet = await auctionRepository.getAuction(log.args.tokenID);
        // console.log(resAucDet.valueOf());

        // console.log("Processing Auction");
        // let res5 = await auctionRepository.processAuction(log.args.tokenID, { from: web3.eth.accounts[1] });
        // const logprocess = res5.logs.find(({ event }) => event == 'FinalizedBid');
        // console.log("Bid placed for ", logprocess.args.bidID, logprocess.args.tokenID, logprocess.args.bidAmount);


        // await erc20Address.approve(logprocess.args.bidOwner, logprocess.args.bidAmount, { from: web3.eth.accounts[1] });
        // //const logprocess = res5.logs.find(({ event }) => event == 'FinalizedBid');
        // // console.log("Finalized after Approval",resMoneyApproval);

        //  let resMoneyTransfer = await erc20Address.transferFrom(web3.eth.accounts[1], logprocess.args.bidOwner, logprocess.args.bidAmount, { from: logprocess.args.bidOwner});
        // const logprocessTransferMoney = resMoneyTransfer.logs.find(({ event }) => event == 'Transfer');
        //  console.log("Finalized after Transfer ",logprocessTransferMoney.args._from, logprocessTransferMoney.args._to, logprocessTransferMoney.args._value);


        // await erc721Address.approve(logprocess.args.bidOwner, logprocess.args.tokenID, { from: web3.eth.accounts[1] });
        // //const logprocess = res5.logs.find(({ event }) => event == 'FinalizedBid');
        // // console.log("Finalized after Approval",resMoneyApproval);

        //  let resAssetTransfer = await erc721Address.transferFrom(web3.eth.accounts[1], logprocess.args.bidOwner, logprocess.args.tokenID, { from: logprocess.args.bidOwner});
        // const logprocessTransfer = resAssetTransfer.logs.find(({ event }) => event == 'Transfer');
        //  console.log("Finalized after Transfer ",logprocessTransfer.args.from, logprocessTransfer.args.to, logprocessTransfer.args.tokenId);

        // let AuctionOwner = await erc721Address.tokensOfOwner(web3.eth.accounts[1]);
        // console.log("Tokens of Auction Owner are", AuctionOwner.valueOf());

        // let BidOwner_1 = await erc721Address.tokensOfOwner(web3.eth.accounts[2]);
        // console.log("Tokens of Bid 1 Owner are", BidOwner_1.valueOf());

        // let BidOwner_2 = await erc721Address.tokensOfOwner(web3.eth.accounts[3]);
        // console.log("Tokens of Bid 2 Owner are", BidOwner_2.valueOf());

        // let balance_4 = await erc20Address.balanceOf(web3.eth.accounts[1]);
        // console.log("Balance of 1st User", balance_4.valueOf());

        // let balance_5 = await erc20Address.balanceOf(web3.eth.accounts[2]);
        // console.log("Balance of 2nd User", balance_5.valueOf());

        // let balance_6 = await erc20Address.balanceOf(web3.eth.accounts[3]);
        // console.log("Balance of 3rd User", balance_6.valueOf());
   // });

  //});
