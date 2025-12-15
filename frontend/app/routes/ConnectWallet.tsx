import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { Wallet, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';

const ConnectWallet: React.FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const { account, connectWallet } = useContext(WalletContext);
  
  const handleConnect = async () => {
    setIsConnecting(true);
    if(!account){
      await connectWallet();
    }
    setIsConnecting(false);
    if (window.ethereum?.selectedAddress) {
      navigate('/start-chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl border border-white border-opacity-20 shadow-2xl p-8">
        <div className="text-center space-y-6 text-gray-500">
          <Wallet className="w-14 h-14 mx-auto text-purple-400" />

          <h1 className="text-3xl font-bold">Dapp Chat 1-1</h1>
          <p className="text-gray-400">Private, onchain, wallet-to-wallet messaging</p>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full text-white py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:scale-105 transition"
          >
            {isConnecting ? (
              <>
                <Loader2 className="animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet />
                Connect MetaMask
              </>
            )}
          </button>

          <div className="flex justify-center gap-2 text-sm text-gray-400">
            <Sparkles className="w-4 h-4" />
            Ethereum • Fully onchain
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
