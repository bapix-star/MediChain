"use client";

import { useWalletStore } from "@/store/useWalletStore";
import { Wallet, LogOut, Loader2 } from "lucide-react";

export function WalletConnect() {
  const { address, connect, disconnect, balance, network, setNetwork } = useWalletStore();

  if (address) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Network Switcher */}
        <select 
          className="hidden sm:block bg-surface-container border border-outline-variant/50 text-on-surface rounded px-2 py-1 font-data-mono text-[10px] uppercase outline-none"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          <option value="TESTNET">Testnet</option>
          <option value="PUBLIC">Mainnet</option>
          <option value="FUTURENET">Futurenet</option>
          <option value="STANDALONE">Local</option>
        </select>
        
        {/* Wallet Pill */}
        <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 px-3 py-1.5 rounded-full shadow-sm hover:bg-surface-container-low transition-colors">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-secondary to-tertiary"></div>
          
          <div className="flex flex-col leading-tight mr-2">
            <span className="font-data-mono text-data-mono font-medium text-sm text-on-surface">
              {address.substring(0, 4)}...{address.substring(address.length - 4)}
            </span>
            <span className="text-[10px] font-semibold text-secondary hidden sm:block">
              {balance ? `${balance} XLM` : "0.00 XLM"}
            </span>
          </div>

          <div className="h-6 w-px bg-outline-variant/30 mx-1"></div>

          <button 
            onClick={disconnect}
            className="p-1.5 hover:bg-error/10 rounded-full transition-colors group"
            title="Disconnect Wallet"
          >
            <LogOut className="w-4 h-4 text-on-surface-variant group-hover:text-error" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={connect}
      className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container flex items-center gap-2 px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all hover:shadow-md border border-transparent font-data-mono font-medium text-sm"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
