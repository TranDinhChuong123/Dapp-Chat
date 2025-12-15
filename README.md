# 🔗 Web3 Chat DApp (React + Ethers.js)

Dự án **Chat phi tập trung (dApp)** cho phép 2 ví Ethereum gửi – nhận tin nhắn **on-chain**  
và lắng nghe tin nhắn **realtime qua WebSocket**

## 🧱 Kiến trúc tổng quan

Frontend (React)
↓
ethers.js
BrowserProvider (ký & gửi transaction)
WebSocketProvider (realtime event) --> Alchemy
↓
ChatProxy (ERC1967Proxy) ← STORAGE Ở ĐÂY
↓
ChatV1 (UUPSUpgradeable) ← LOGIC

## 📦 Setup MetaMask + Sepolia Testnet

- Cài MetaMask -> tạo ví Create/Conect wallet -> Chuyển sang mạng Sepolia Testnet
- Copy địa chỉ ví của bạn trong MetaMask ->vào link lấy ETH (https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

## 🚀Deploy Test Smart Contract

- Truy cập Remix IDE: https://remix.ethereum.org
- Tạo file Chat.sol và dán nội dung:
- Compile contract Chat.sol
- Mở tab Deploy & Run Transactions
- Environment: Injected Provider – MetaMask(Kết nối với MetaMask)
- Nhấn Deploy → xem trên https://sepolia.etherscan.io/
- Tạo file ChatProxy.sol
- Compile contract ChatProxy.sol
- Mở tab Deploy & Run Transactions
- Mở Dropdow ngay nút Deploy điền 
- logic: Dán địa chỉ Implementation (Chat.sol)
- data: 0x (hoặc để trống nếu Remix cho phép)
- Nhấn transact


# ⚡️Run Frontend Web3 Chat DApp (React + Ethers.js)
- Cài  Node.js **>= 18** -> 
- Truy cập vào dự án chạy npm install
- npm run dev
- Mở trình duyệt tại:http://localhost:5173

