// solhint-disable-next-line compiler-fixed, compiler-gt-0_4.21
pragma solidity >=0.4.21 <0.6.0;

import "./Service/BaseService.sol";


/// @dev Marketplace contract that will auction, bidding and processing function capability
contract Marketplace is BaseService {

    //Map token ID to Auction Structure
    mapping (uint256 => Auction) public  tokenIdToAuction;

    mapping (uint256 => uint256) public tokenIdToAuctionId;

    mapping (uint256 => uint256) public bidIndexToAuctionPool;

    mapping (uint256 => Bid) public bidIdToBid;

    event BidPlaced(uint256 tokenId, uint256 amount, address bidder, uint256 timestamp);
    event CreateAuctionEvent(uint256 tokenId, uint256 reservePrice, address seller, uint256 auctionID);
    
    constructor(address _eternalStorageAddress) public BaseService(_eternalStorageAddress) {
        version = 1;
    }

    ///@dev Auction structure to record details required for starting auction
    ///@param seller seller/owner of the product for which auction has been started
    ///@param reservePrice reservePrice/minimum price that bid should be placed for
    ///@param duration the time log for which auction is running
    ///@param timestamp timestamp of the auction started
    struct Auction {
        address seller;
        uint256 reservePrice;
        uint256 duration;
        uint256 timestamp;
    }

    ///@dev auctions array to record multiple number of auctions
    Auction[] public auctions;

    /// @dev Bid details for which each bidder places a bid
    /// @param amount of the bid is placed for
    /// @param timestamp at which the bid is placed
    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    /// @dev bid array to record multple bids to the auction
    Bid[] public bids;

    /// @dev creates an auction for each NFT token ID
    /// @param _tokenId nft id of each asset that is registered
    /// @param _reservePrice reserve/minimum price of the asset
    /// @param _duration of the auction is running for
    /// @param _seller of the asset who started auction
    /// @param _timestamp of the auction started
    function createAuction(
        uint256 _tokenId,
        uint256 _reservePrice,
        uint256 _duration,
        address _seller,
        uint256 _timestamp
    )
    public returns(uint256)
    {
        // store the auction details in Auction structure
        Auction memory auction = Auction(
            _seller,
            _reservePrice,
            _duration,
            _timestamp
        );

        //Join in array
        uint256 newId = auctions.push(auction) - 1; // push returns new array length, so caseId starts from 0
        if (newId == uint32(0)) {
            // we need to reserve index 0 as null, so let's push another copy and make it 1
            newId = auctions.push(auction) - 1;
        }

        require(newId == uint256(uint32(newId)));

        //Map Auction Details to token ID
        tokenIdToAuction[_tokenId] = auction;

        //Map Auction ID to token ID
        tokenIdToAuctionId[_tokenId] = newId;

        //Emit an Event for each auction
        emit CreateAuctionEvent(_tokenId, _reservePrice, _seller, newId);
        return newId;
    }

    /// @dev create Bid that is placed by multiple bidders
    /// @param _bidder address of the bidder placing a bid for auction
    /// @param _tokenId auction id for which the bid is placed 
    function createBid(
        address _bidder,
        uint256 _tokenId,
        uint256 _amount,     
        uint256 _timeStamp
    )
    public returns(uint256, uint256)
    {
        Bid memory bid = Bid(
            _bidder,
            _amount,
            _timeStamp
        );

        //Join in array
        uint256 newId = bids.push(bid) - 1; // push returns new array length, so caseId starts from 0
        if (newId == uint32(0)) {
            // we need to reserve index 0 as null, so let's push another copy and make it 1
            newId = bids.push(bid) - 1;
        }

        require(newId == uint256(uint32(newId)));

        //Map Bid Details to bid id for retrival of bid details
        bidIdToBid[newId] = bid;
        uint256 auctionId = tokenIdToAuctionId[_tokenId];

        //Add Bid to respective auction based on identifying the token id for which the bid is placed
        addBidToAuction(newId, auctionId);

        //Emit an event on successful bid
        emit BidPlaced(
            _tokenId,
            _amount,
            _bidder,
            _timeStamp);

        return (newId, auctionId);
    }

    /// @dev addBidToAuction after successful storage of bid details add the bid to auction pool . 
    /// @param _bidId bid id that refers to the bid details and tracking purpose
    /// @param _auctionId auction id that refers to the bid is mapping to auction
    function addBidToAuction(uint256 _bidId, uint256 _auctionId) public {
        require(_bidId != uint256(0) && _auctionId < auctions.length);
        bidIndexToAuctionPool[_bidId] = _auctionId;
    }

    /// @dev getAuctionSize displays the size of the auction
    /// @param _tokenId an unique id that refers to the auction id
    function getAuctionSize(uint256 _tokenId) public view returns(uint256 size) {
        uint256 auctionId = tokenIdToAuctionId[_tokenId];
        uint256 total = bids.length;
        size = 0;
        for (uint256 id = 1; id < total; id++) {
            if (bidIndexToAuctionPool[id] == auctionId) {
                size++;
            }
        }
    }

    /// @dev getBid gets the bid information 
    function getBid(uint256 _bidId) public view
    returns
    (
        address bidder,
        uint256 amount,
        uint256 timeStamp
    ) 
    {
        Bid storage bid = bidIdToBid[_bidId];
        return (
        bid.bidder,
        bid.amount,
        bid.timestamp
        );
    }

    /// @dev getAuction fetches list of bids that are placed for that auction
    /// @param _tokenId that identifies the auction to fetch the bids for
    function getAuction(uint256 _tokenId) public view returns(uint256[] memory pool) {
        uint256 auctionId = tokenIdToAuctionId[_tokenId];

        uint256 poolSize = getAuctionSize(_tokenId);
        uint256[] memory result = new uint256[](poolSize);
        uint256 total = bids.length; // totalSupply is cases.lenght -1, 0 index is reserved
        uint256 resultIndex = 0;

        for (uint256 id = 0; id <= total; id++) {
            if (bidIndexToAuctionPool[id] == auctionId) {
                result[resultIndex++] = id;
            }
        }
        return result;
    }

    /// @dev processAuction closes auction deals and gives the bid details of highest bid is placed for
    /// @param _tokenId NFT id that uniquely maps the token id to the auction id
    function processAuction(uint256 _tokenId) public view returns(
        address _bid_owner,
        uint256 tokenId,
        uint256 _bid_id,
        uint256 _bid_high
    ) {
        uint256 auctionId = tokenIdToAuctionId[_tokenId];
        uint256 total = bids.length; // totalSupply is cases.lenght -1, 0 index is reserved
        uint256 bid_high = 0;
        uint256 bid_id = 0;
        address bid_owner = address(0);
        for (uint256 id = 1; id < total; id++) {
            if (bidIndexToAuctionPool[id] == auctionId) {
                Bid storage _bid = bidIdToBid[id];
                if (_bid.amount > bid_high) {
                      bid_high = _bid.amount;
                      bid_id   = id;
                      bid_owner = _bid.bidder;
                }
            }
        }
        //emit FinalizedBid(bid_id, _tokenId, bid_high, bid_owner);
        return (bid_owner, _tokenId, bid_id, bid_high);
    }

    /// @dev getBidsLength fetch length of the bids and displays the count
    function getBidsLength() public view returns(uint256) {
        return bids.length;
    }

}

