import React, { useContext, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { ethers } from 'ethers';
import { Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

const StartChat: React.FC = () => {
  const { account } = useContext(WalletContext);
  const [chatAddress, setChatAddress] = useState('');
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (!ethers.isAddress(chatAddress)) {
      toast('Địa chỉ ví không hợp lệ');
      return;
    }
    navigate(`/chat/${chatAddress}`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl border border-white border-opacity-20 shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
            <Wallet className="text-green-400 w-8 h-8" />
          </div>

          <p className="text-sm text-gray-400">Connected wallet</p>
          <p className="font-mono bg-gray-800 rounded-xl px-4 py-2 mt-2">
            {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Not connected'}
          </p>
        </div>

        <div className="space-y-5">
          <label className="text-sm text-gray-300">Friend's wallet address</label>
          <input
            value={chatAddress}
            onChange={(e) => setChatAddress(e.target.value)}
            placeholder="0x1234...abcd"
            className="w-full px-5 py-4 text-gray-600 bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 focus:ring-4 focus:ring-purple-400 focus:ring-opacity-30 outline-none"
          />
        </div>

        <button
          onClick={handleStartChat}
          className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition"
        >
          Start Private Chat
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default StartChat;
