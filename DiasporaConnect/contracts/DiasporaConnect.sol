// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title DiasporaConnect
 * @dev Smart Contract for Cross-Border Remittances via Celo cUSD to Mobile Money
 */
contract DiasporaConnect {
    
    enum TransferStatus { Locked, Released, Refunded }
    
    struct Transfer {
        address sender;
        string recipientPhone;
        string operator;
        uint256 amount;
        uint256 createdAt;
        TransferStatus status;
    }

    // cUSD address on Celo Sepolia testnet
    address public constant CUSD_ADDRESS = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    
    mapping(bytes32 => Transfer) public transfers;
    mapping(address => bool) public authorizedNodes;
    
    address public owner;

    event TransferCreated(
        bytes32 indexed transferId,
        address indexed sender,
        string recipientPhone,
        string operator,
        uint256 amount
    );
    event TransferReleased(
        bytes32 indexed transferId,
        address recipientNode,
        uint256 amount
    );
    event TransferRefunded(
        bytes32 indexed transferId,
        address indexed sender,
        uint256 amount
    );
    event NodeAuthorized(address indexed node);
    event NodeRevoked(address indexed node);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAuthorizedNode() {
        require(authorizedNodes[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedNodes[msg.sender] = true;
    }

    /**
     * @dev Authorize a node to call release()
     */
    function authorizeNode(address _node) external onlyOwner {
        authorizedNodes[_node] = true;
        emit NodeAuthorized(_node);
    }

    /**
     * @dev Revoke node authorization
     */
    function revokeNode(address _node) external onlyOwner {
        authorizedNodes[_node] = false;
        emit NodeRevoked(_node);
    }

    /**
     * @dev Step 1: Sender locks cUSD into the contract
     * transferId is generated on-chain to ensure uniqueness
     */
    function deposit(
        string memory _recipientPhone,
        string memory _operator,
        uint256 _amount
    ) external returns (bytes32) {
        require(bytes(_recipientPhone).length > 0, "Phone required");
        require(bytes(_operator).length > 0, "Operator required");
        require(_amount > 0, "Amount must be > 0");

        // Generate unique transferId
        bytes32 transferId = keccak256(
            abi.encodePacked(msg.sender, _recipientPhone, _operator, _amount, block.timestamp)
        );
        require(transfers[transferId].createdAt == 0, "Transfer already exists");

        // Transfer cUSD from sender to contract
        require(
            IERC20(CUSD_ADDRESS).transferFrom(msg.sender, address(this), _amount),
            "cUSD transfer failed"
        );

        transfers[transferId] = Transfer({
            sender: msg.sender,
            recipientPhone: _recipientPhone,
            operator: _operator,
            amount: _amount,
            createdAt: block.timestamp,
            status: TransferStatus.Locked
        });

        emit TransferCreated(transferId, msg.sender, _recipientPhone, _operator, _amount);
        return transferId;
    }

    /**
     * @dev Step 2: Authorized node releases funds after Mobile Money confirmation
     */
    function release(bytes32 _transferId, address _nodeAddress) external onlyAuthorizedNode {
        Transfer storage t = transfers[_transferId];
        require(t.status == TransferStatus.Locked, "Not locked");
        require(t.amount > 0, "Transfer does not exist");

        t.status = TransferStatus.Released;
        require(
            IERC20(CUSD_ADDRESS).transfer(_nodeAddress, t.amount),
            "cUSD transfer failed"
        );

        emit TransferReleased(_transferId, _nodeAddress, t.amount);
    }

    /**
     * @dev Failsafe: Refund to sender after 72h if still locked
     */
    function refund(bytes32 _transferId) external {
        Transfer storage t = transfers[_transferId];
        require(t.status == TransferStatus.Locked, "Not locked");
        require(
            msg.sender == t.sender || msg.sender == owner,
            "Only sender or owner"
        );
        require(
            block.timestamp >= t.createdAt + 3 days || msg.sender == owner,
            "Must wait 72h or be owner"
        );

        t.status = TransferStatus.Refunded;
        require(
            IERC20(CUSD_ADDRESS).transfer(t.sender, t.amount),
            "cUSD transfer failed"
        );

        emit TransferRefunded(_transferId, t.sender, t.amount);
    }

    /**
     * @dev Get transfer details
     */
    function getTransfer(bytes32 _transferId) external view returns (
        address sender,
        string memory recipientPhone,
        string memory operator,
        uint256 amount,
        uint256 createdAt,
        TransferStatus status
    ) {
        Transfer memory t = transfers[_transferId];
        return (t.sender, t.recipientPhone, t.operator, t.amount, t.createdAt, t.status);
    }
}
