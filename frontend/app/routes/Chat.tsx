import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, SendHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
interface Message {
  sender: string;
  content: string;
  timestamp: number;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { contract, account, provider, wsContract, wsProvider } = useContext(WalletContext);
  const { address: otherAddress } = useParams<{ address: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMessages = async () => {
    if (contract) {
      try {
        const msgs: Message[] = await contract.getConversation(otherAddress);
        setMessages(msgs);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const estimateGasWithBuffer = async (to: string, content: string, bufferPercent = 20n): Promise<bigint> => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    const estimatedGas: bigint = await contract.sendMessage.estimateGas(to, content);
    return (estimatedGas * (100n + bufferPercent)) / 100n;
  };

  /*
   * Send transaction with error handling and user feedback
   */
  const sendTx = async (fn: () => Promise<any>) => {
    setTxStatus('pending');
    const toastId = toast.loading('Đang gửi giao dịch...');

    try {
      const tx = await fn();
      await tx.wait();

      toast.success('Gửi tin nhắn thành công', { id: toastId });
      setTxStatus('success');
    } catch (err: any) {
      const msg = parseTxError(err);
      toast.error(msg, { id: toastId });
      setTxStatus('error');
      throw err;
    }
  };

  const sendMessage = async () => {
    if (!contract || !newMessage || !otherAddress) return;
    await sendTx(async () => {
      const gasLimit = await estimateGasWithBuffer(otherAddress, newMessage);
      return contract.sendMessage(otherAddress, newMessage, { gasLimit });
    });
    setNewMessage('');
  };
  /*
   * Parse transaction errors to user-friendly messages
   */
  const parseTxError = (error: any): string => {
    if (!error) {
      return 'Giao dịch thất bại, vui lòng thử lại';
    }

    switch (error.code) {
      case 'INSUFFICIENT_FUNDS':
        return 'Ví không đủ ETH để trả phí gas';

      case 'UNPREDICTABLE_GAS_LIMIT':
        return 'Không ước lượng được phí gas, giao dịch có thể bị từ chối';

      case 'ACTION_REJECTED':
        return 'Bạn đã huỷ giao dịch trên MetaMask';

      case 'CALL_EXCEPTION':
        return 'Hợp đồng từ chối giao dịch (có thể do điều kiện không hợp lệ)';

      case 'NETWORK_ERROR':
        return 'Lỗi mạng blockchain, vui lòng thử lại';

      default:
        return error.shortMessage || error.reason || error.message || 'Giao dịch thất bại';
    }
  };

  function getConversationKey(a: string, b: string): string {
    const [x, y] = a < b ? [a, b] : [b, a];
    return ethers.solidityPackedKeccak256(['address', 'address'], [x, y]);
  }

  /*
   * Listen for new messages via contract events
   */
  useEffect(() => {
    if (!wsContract || !account || !otherAddress) return;
    const handleNewMessage = (convKey: string, from: string, to: string, message: string, timestamp: any) => {
      setMessages((prev) => [...prev, { sender: from, content: message, timestamp: Number(timestamp) }]);
    };
    const convKey = getConversationKey(account, otherAddress);
    const filter = wsContract.filters.NewMessage(convKey, null, null);
    wsContract.on(filter, handleNewMessage);

    return () => {
      wsContract.off(filter, handleNewMessage);
    };
  }, [wsContract, account, otherAddress]);

  /*
   * Fetch messages when contract or otherAddress changes
   */
  useEffect(() => {
    fetchMessages();
  }, [contract, otherAddress, account]);

  useEffect(() => {
    if (wsContract) {
      console.log('wsContract provider:', wsContract.runner);
    }
  }, [wsContract, otherAddress, account]);

  const safeTimeAgo = (timestamp: any) => {
    const ts = Number(timestamp);
    if (!ts || Number.isNaN(ts)) return 'just now';
    return formatDistanceToNow(ts * 1000, { addSuffix: true });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">Chat</span>
          <span className="text-xs text-gray-500 truncate max-w-[200px]">{otherAddress}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && <p className="text-center text-gray-400 text-sm">No messages yet</p>}

        {messages.map((msg) => {
          const isOther = msg.sender === otherAddress;

          return (
            <div key={msg.timestamp} className={clsx('flex', isOther ? 'justify-start' : 'justify-end')}>
              <div
                className={clsx(
                  'max-w-[70%] px-4 py-2 rounded-2xl shadow-sm',
                  isOther ? 'bg-white text-gray-800 rounded-bl-md' : 'bg-pink-500 text-white rounded-br-md'
                )}
              >
                <p className="text-sm leading-relaxed break-words">{msg.content}</p>

                <p className={clsx('text-[10px] mt-1 text-right', isOther ? 'text-gray-400' : 'text-blue-200')}>
                  {safeTimeAgo(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-white border-pink-200">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2 border border-pink-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />

          <button
            onClick={sendMessage}
            disabled={txStatus === 'pending'}
            className={clsx(
              'p-3 rounded-full transition',
              txStatus === 'pending' ? 'bg-gray-300 cursor-not-allowed' : 'bg-pink-600 hover:bg-blue-700 text-white'
            )}
          >
            {txStatus === 'pending' ? (
              <span className="animate-pulse text-sm">Đang gửi...</span>
            ) : (
              <SendHorizontal className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
