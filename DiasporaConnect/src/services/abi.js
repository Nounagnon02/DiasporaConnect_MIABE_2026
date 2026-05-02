export const DIASPORA_CONNECT_ABI = [
  "function deposit(string memory _recipientPhone) public payable",
  "function release(uint256 _transferId, address payable _nodeAddress) public",
  "function refund(uint256 _transferId) public",
  "event TransferCreated(uint256 indexed transferId, address indexed sender, string recipientPhone, uint256 amount)",
  "event TransferReleased(uint256 indexed transferId, address recipientNode, uint256 amount)",
  "event TransferRefunded(uint256 indexed transferId, address indexed sender, uint256 amount)"
];
