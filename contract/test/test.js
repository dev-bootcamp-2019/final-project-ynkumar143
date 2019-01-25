var assetRegistration = artifacts.require("./Asset.sol");
var auctionRepository = artifacts.require("./Marketplace.sol");
var ERC721Address = artifacts.require("./ERC721.sol")
var ERC20Address = artifacts.require("./ERC20.sol")

contract('Auction', function(accounts) {

    const owner = accounts[0]
    const alice = accounts[1];
    const bob = accounts[2];
    const deposit = web3.utils.toBN(2);
  
    it("Create Asset", async () => {

        let res1 = await assetRegistration.createAsset("assetunqieu", assetDetails, web3.eth.accounts[1], "Monalisa", "ANF001", "123" , "DATE" , 1 ,  { from: web3.eth.accounts[1] });
    
        let resToken = await erc721Address.tokensOfOwner(web3.eth.accounts[1]);
        console.log("Tokens of Owner are", resToken.valueOf());    
    
        await erc20Address.increaseSupply(3000, web3.eth.accounts[1], {from:web3.eth.accounts[0]});
        //console.log("Deposit to Account1", resAccount1.valueOf());
    
        await erc20Address.increaseSupply(3000, web3.eth.accounts[2], {from:web3.eth.accounts[0]});
        //console.log("Deposit to Account2", resAccount2.valueOf());
    
        await erc20Address.increaseSupply(3000, web3.eth.accounts[3], {from:web3.eth.accounts[0]});
        //console.log("Deposit to Account3", resAccount3.valueOf());
    
        let balance_1 = await erc20Address.balanceOf(web3.eth.accounts[1]);
        console.log("Balance of 1st User", balance_1.valueOf());
    
        let balance_2 = await erc20Address.balanceOf(web3.eth.accounts[2]);
        console.log("Balance of 2nd User", balance_2.valueOf());
    
        let balance_3 = await erc20Address.balanceOf(web3.eth.accounts[3]);
        console.log("Balance of 3rd User", balance_3.valueOf());
    
        console.log("Starting Auction on Token ID", log.args.tokenID);
        let res2 = await auctionRepository.createAuction(log.args.tokenID, 500, 70, web3.eth.accounts[1], { from: web3.eth.accounts[1] });
        const log2 = res2.logs.find(({ event }) => event == 'CreateAuctionEvent');
        let AuctionID = log2.args.auctionID;
        assert.notEqual(log2, undefined); // Check that an event was logged
        assert.equal(AuctionID, log2.args.auctionID);
    
    
        console.log("Placing first bid");
        let res3 = await auctionRepository.createBid(web3.eth.accounts[2], log.args.tokenID, 501, "Time", { from: web3.eth.accounts[2] });
        const log3 = res3.logs.find(({ event }) => event == 'BidPlaced');
        console.log("Bid placed for ", log3.args.amount, log3.args.bidder);
    
    
        console.log("Placing second bid");
        let res4 = await auctionRepository.createBid(web3.eth.accounts[3], log.args.tokenID, 505, "Time 2", { from: web3.eth.accounts[3] });
        const log4 = res4.logs.find(({ event }) => event == 'BidPlaced');
        console.log("Bid placed for ", log4.args.amount, log4.args.bidder);
    
        console.log("Size of Auction is");
        let resAuc = await auctionRepository.getAuctionSize(log.args.tokenID);
        console.log(resAuc.valueOf());
    
        console.log("List of bids for this Auction");
        let resAucDet = await auctionRepository.getAuction(log.args.tokenID);
        console.log(resAucDet.valueOf());
    
        console.log("Processing Auction");
        let res5 = await auctionRepository.processAuction(log.args.tokenID, { from: web3.eth.accounts[1] });
        const logprocess = res5.logs.find(({ event }) => event == 'FinalizedBid');
        console.log("Bid placed for ", logprocess.args.bidID, logprocess.args.tokenID, logprocess.args.bidAmount);
    
    
        await erc20Address.approve(logprocess.args.bidOwner, logprocess.args.bidAmount, { from: web3.eth.accounts[1] });
        //const logprocess = res5.logs.find(({ event }) => event == 'FinalizedBid');
        // console.log("Finalized after Approval",resMoneyApproval);
    
         let resMoneyTransfer = await erc20Address.transferFrom(web3.eth.accounts[1], logprocess.args.bidOwner, logprocess.args.bidAmount, { from: logprocess.args.bidOwner});
        const logprocessTransferMoney = resMoneyTransfer.logs.find(({ event }) => event == 'Transfer');
         console.log("Finalized after Transfer ",logprocessTransferMoney.args._from, logprocessTransferMoney.args._to, logprocessTransferMoney.args._value);
     
    
        await erc721Address.approve(logprocess.args.bidOwner, logprocess.args.tokenID, { from: web3.eth.accounts[1] });
        //const logprocess = res5.logs.find(({ event }) => event == 'FinalizedBid');
        // console.log("Finalized after Approval",resMoneyApproval);
    
         let resAssetTransfer = await erc721Address.transferFrom(web3.eth.accounts[1], logprocess.args.bidOwner, logprocess.args.tokenID, { from: logprocess.args.bidOwner});
        const logprocessTransfer = resAssetTransfer.logs.find(({ event }) => event == 'Transfer');
         console.log("Finalized after Transfer ",logprocessTransfer.args.from, logprocessTransfer.args.to, logprocessTransfer.args.tokenId);
     
        let AuctionOwner = await erc721Address.tokensOfOwner(web3.eth.accounts[1]);
        console.log("Tokens of Auction Owner are", AuctionOwner.valueOf());
    
        let BidOwner_1 = await erc721Address.tokensOfOwner(web3.eth.accounts[2]);
        console.log("Tokens of Bid 1 Owner are", BidOwner_1.valueOf());
    
        let BidOwner_2 = await erc721Address.tokensOfOwner(web3.eth.accounts[3]);
        console.log("Tokens of Bid 2 Owner are", BidOwner_2.valueOf());
    
        let balance_4 = await erc20Address.balanceOf(web3.eth.accounts[1]);
        console.log("Balance of 1st User", balance_4.valueOf());
    
        let balance_5 = await erc20Address.balanceOf(web3.eth.accounts[2]);
        console.log("Balance of 2nd User", balance_5.valueOf());
    
        let balance_6 = await erc20Address.balanceOf(web3.eth.accounts[3]);
        console.log("Balance of 3rd User", balance_6.valueOf());
    });

  });
