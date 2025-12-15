import { useContext, useEffect } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { useNavigate } from 'react-router';

export default function RequireWallet({ children }: { children: React.ReactNode }) {
  const { account } = useContext(WalletContext);
  const navigate = useNavigate();


  if (!account) return null; // tránh render khi đang redirect

  return <>{children}</>;
}
