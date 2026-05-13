export const DIASPORA_CONNECT_ABI = [
  // deposit — verrouille cUSD, retourne bytes32 transferId
  "function deposit(string memory _recipientPhone, string memory _operator, uint256 _amount) external returns (bytes32)",
  // release — nœud autorisé libère les fonds après confirmation Momo
  "function release(bytes32 _transferId, address _nodeAddress) external",
  // refund — remboursement expéditeur après 72h
  "function refund(bytes32 _transferId) external",
  // getTransfer — lecture des détails d'un transfert
  "function getTransfer(bytes32 _transferId) external view returns (address sender, string memory recipientPhone, string memory operator, uint256 amount, uint256 createdAt, uint8 status)",
  // gestion des nœuds autorisés
  "function authorizeNode(address _node) external",
  "function revokeNode(address _node) external",
  "function authorizedNodes(address) external view returns (bool)",
  // events
  "event TransferCreated(bytes32 indexed transferId, address indexed sender, string recipientPhone, string operator, uint256 amount)",
  "event TransferReleased(bytes32 indexed transferId, address recipientNode, uint256 amount)",
  "event TransferRefunded(bytes32 indexed transferId, address indexed sender, uint256 amount)",
  "event NodeAuthorized(address indexed node)",
  "event NodeRevoked(address indexed node)"
];
