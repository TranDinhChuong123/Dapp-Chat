import { ExternalProvider } from 'ethers';

export {};

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}
