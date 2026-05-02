// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DiasporaConnect
 * @dev The Private Ledger Smart Contract for Cross-Border Remittances via Celo
 */
contract DiasporaConnect {
    
    struct Transfer {
        address sender;
        string recipientPhone;
        uint256 amount;
        bool isReleased;
        bool isRefunded;
        uint256 timestamp;
    }

    mapping(uint256 => Transfer) public transfers;
    uint256 public transferCount;

    address public owner;

    event TransferCreated(uint256 indexed transferId, address indexed sender, string recipientPhone, uint256 amount);
    event TransferReleased(uint256 indexed transferId, address recipientNode, uint256 amount);
    event TransferRefunded(uint256 indexed transferId, address indexed sender, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Step 1: Sender locks funds into the smart contract
     */
    function deposit(string memory _recipientPhone) public payable {
        require(msg.value > 0, "Amount must be > 0");

        transferCount++;
        transfers[transferCount] = Transfer({
            sender: msg.sender,
            recipientPhone: _recipientPhone,
            amount: msg.value,
            isReleased: false,
            isRefunded: false,
            timestamp: block.timestamp
        });

        emit TransferCreated(transferCount, msg.sender, _recipientPhone, msg.value);
    }

    /**
     * @dev Step 2: The mobile money gateway node confirms receipt and releases funds
     */
    function release(uint256 _transferId, address payable _nodeAddress) public onlyOwner {
        Transfer storage t = transfers[_transferId];
        require(!t.isReleased, "Already released");
        require(!t.isRefunded, "Already refunded");
        require(t.amount > 0, "Transfer does not exist");

        t.isReleased = true;
        _nodeAddress.transfer(t.amount);

        emit TransferReleased(_transferId, _nodeAddress, t.amount);
    }

    /**
     * @dev Failsafe: Refund to sender if the transaction didn't go through after 72h
     */
    function refund(uint256 _transferId) public {
        Transfer storage t = transfers[_transferId];
        require(!t.isReleased, "Already released");
        require(!t.isRefunded, "Already refunded");
        require(
            msg.sender == t.sender || msg.sender == owner,
            "Only sender or owner can refund"
        );
        require(
            block.timestamp >= t.timestamp + 3 days || msg.sender == owner,
            "Must wait 72h or be owner"
        );

        t.isRefunded = true;
        payable(t.sender).transfer(t.amount);

        emit TransferRefunded(_transferId, t.sender, t.amount);
    }
}
