import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";

// Initialize the kit globally
if (typeof window !== "undefined") {
  StellarWalletsKit.init({
    modules: defaultModules(),
    network: Networks.TESTNET,
  });
}

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

interface WalletState {
  address: string | null;
  balance: string | null;
  network: string;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setNetwork: (network: string) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  signTransaction: (xdr: string) => Promise<string>;
  submitTransaction: (xdr: string) => Promise<any>;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      balance: null,
      network: "TESTNET",
      isConnected: false,
      
      setAddress: (address) => {
        set({ address, isConnected: !!address });
        get().refreshBalance();
      },
      setNetwork: (network) => {
        set({ network });
        if (typeof window !== "undefined") {
          StellarWalletsKit.setNetwork(network === "PUBLIC" ? Networks.PUBLIC : Networks.TESTNET);
        }
        get().refreshBalance();
      },

      refreshBalance: async () => {
        const address = get().address;
        if (!address) {
          set({ balance: null });
          return;
        }
        try {
          const account = await server.loadAccount(address);
          const nativeBalance = account.balances.find((b) => b.asset_type === "native");
          if (nativeBalance) {
            set({ balance: parseFloat(nativeBalance.balance).toFixed(2) });
          }
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          set({ balance: "0.00" });
        }
      },

      connect: async () => {
        try {
          const { address } = await StellarWalletsKit.authModal();
          if (address) {
            set({ address, isConnected: true });
            get().refreshBalance();
          }
        } catch (error) {
          console.error("Wallet connection failed:", error);
        }
      },

      disconnect: async () => {
        try {
          await StellarWalletsKit.disconnect();
        } catch (error) {
          console.error("Wallet disconnect failed:", error);
        }
        set({ address: null, balance: null, isConnected: false });
      },

      signTransaction: async (xdr: string) => {
        const address = get().address;
        if (!address) throw new Error("Wallet not connected");
        
        const response = await StellarWalletsKit.signTransaction(xdr, {
          networkPassphrase: Networks.TESTNET,
          address,
        });
        
        if (!response) throw new Error("Failed to sign transaction");
        return response.signedTxXdr || (typeof response === 'string' ? response : (response as any).signedXDR);
      },

      submitTransaction: async (signedXdr: string) => {
        const tx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
        const result = await server.submitTransaction(tx as any);
        return result;
      },
    }),
    {
      name: "medichain-wallet-storage",
      partialize: (state) => ({ address: state.address, isConnected: state.isConnected, balance: state.balance }),
    }
  )
);
