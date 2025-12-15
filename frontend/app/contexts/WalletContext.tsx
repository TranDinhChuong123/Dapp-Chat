import { ethers } from 'ethers';
import React, { createContext, useEffect, useState, type ReactNode } from 'react';

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;

  wsProvider: ethers.WebSocketProvider | null;
  wsContract: ethers.Contract | null;

  connectWallet: () => Promise<void>;
  initFromMetamask?: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  account: null,
  provider: null,
  contract: null,
  wsProvider: null,
  wsContract: null,
  connectWallet: async () => {
    /* empty */
  }
});

const CONTRACT_ADDRESS = '0xa7Dfaf8Dc8D535fdd19DC46c2948d6FC71Dca32c'; // lưu env sau này
export const CONTRACT_ABI = [
  'function sendMessage(address _to, string calldata _content) external',
  'function getConversation(address other) external view returns (tuple(address sender, string content, uint256 timestamp)[] memory)',
  'event NewMessage(bytes32 indexed convKey, address indexed from, address indexed to, string content, uint256 timestamp)'
]; // lưu env sau
const WS_RPC = 'wss://eth-sepolia.g.alchemy.com/v2/RAU09Z5EtDKhv0qG1F9_f'; // lưu env sau này

// 1. App load / F5
//    → initFromMetamask()

// 2. User đổi network
//    → chainChanged event
//    → reload page

// 3. Sau reload
//    → initFromMetamask() chạy lại

// contract; // BrowserProvider + signer (TX)
// wsContract; // WebSocketProvider (EVENT)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [wsProvider, setWsProvider] = useState<ethers.WebSocketProvider | null>(null);
  const [wsContract, setWsContract] = useState<ethers.Contract | null>(null);

  const initWallet = async (account: string) => {
    const newProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await newProvider.getSigner();
    const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    setAccount(account);
    setProvider(newProvider);
    setContract(newContract);
  };
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Vui lòng cài đặt Metamask!');
      return;
    }
    try {
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      if (accounts.length === 0) return;

      await initWallet(accounts[0]);
    } catch (err) {
      console.error('Connect wallet failed:', err);
    }
  };
  //App load / F5
  const initFromMetamask = async () => {
    if (!window.ethereum) return;

    try {
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length === 0) return;

      await initWallet(accounts[0]);
    } catch (err) {
      console.error('Auto connect failed:', err);
    }
  };

  useEffect(() => {
    initFromMetamask();
  }, []);

  useEffect(() => {
    if (!WS_RPC) {
      console.warn('Missing WS RPC');
      return;
    }

    const provider = new ethers.WebSocketProvider(WS_RPC);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    setWsProvider(provider);
    setWsContract(contract);

    return () => {
      provider.destroy(); // 🔥 QUAN TRỌNG
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{ account, provider, contract, wsProvider, wsContract, connectWallet, initFromMetamask }}
    >
      {children}
    </WalletContext.Provider>
  );
};
