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
- Mở![alt text](image.png)
_logic: Dán địa chỉ Implementation (Chat.sol)
_data: 0x (hoặc để trống nếu Remix cho phép)
- Nhấn transact


# ⚡️Run Frontend Web3 Chat DApp (React + Ethers.js)
- Cài  Node.js **>= 18** -> 
- Truy cập vào dự án chạy npm install
- npm run dev
- Mở trình duyệt tại:http://localhost:5173


# 🔗
A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
