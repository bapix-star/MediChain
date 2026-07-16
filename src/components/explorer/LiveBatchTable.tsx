"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLatestBatches } from "@/actions/batch";

type Batch = {
  id: string;
  batchNumber: string;
  medicineName: string;
  createdAt: Date;
  blockchainHash: string | null;
  ownerAddress: string;
  quantity: number;
};

export function LiveBatchTable({ initialBatches }: { initialBatches: Batch[] }) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(async () => {
      try {
        const result = await getLatestBatches(20);
        if (result.success && result.batches) {
          setBatches(result.batches);
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPolling]);

  return (
    <div className="lg:col-span-12 glass-card rounded-xl overflow-hidden mt-2">
      <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
        <div className="flex items-center gap-3">
          <h3 className="font-headline-md text-headline-md text-on-surface text-xl">Latest Minted Batches</h3>
          <div className="flex items-center gap-1.5 bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-label-caps text-[10px] tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            LIVE
          </div>
        </div>
        
        <button 
          onClick={() => setIsPolling(!isPolling)}
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
          title={isPolling ? "Pause live updates" : "Resume live updates"}
        >
          <span className="material-symbols-outlined text-[16px]">{isPolling ? 'pause' : 'play_arrow'}</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest/50 border-b border-outline-variant/20">
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Txn Hash</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Method</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Time</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Batch No</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Minter (From)</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Medicine</th>
              <th className="p-4 font-label-caps text-label-caps text-on-surface-variant whitespace-nowrap">Qty</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-data-mono">
            {batches.map((batch) => (
              <tr key={batch.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/80 transition-colors group shimmer-row">
                <td className="p-4 text-primary truncate max-w-[120px]">
                  <a href={`https://stellar.expert/explorer/testnet/tx/${batch.blockchainHash || ''}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {batch.blockchainHash ? batch.blockchainHash.substring(0, 16) + "..." : "Pending"}
                  </a>
                </td>
                <td className="p-4"><span className="bg-surface-container-high px-2 py-1 rounded text-on-surface text-xs border border-outline-variant/30">MintBatch</span></td>
                <td className="p-4 text-on-surface text-sm">{new Date(batch.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-primary font-semibold hover:underline">
                  <Link href={`/batch/${encodeURIComponent(batch.batchNumber)}`}>
                    {batch.batchNumber}
                  </Link>
                </td>
                <td className="p-4 flex items-center gap-2 text-on-surface-variant truncate max-w-[150px]" title={batch.ownerAddress}>
                  <span className="material-symbols-outlined text-[16px] text-outline">account_balance_wallet</span>
                  <span>{batch.ownerAddress.substring(0, 8)}...</span>
                </td>
                <td className="p-4 text-on-surface">{batch.medicineName}</td>
                <td className="p-4 text-on-surface">{batch.quantity}</td>
              </tr>
            ))}
            
            {batches.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-on-surface-variant font-body-md">
                  No batches minted yet. Be the first to mint a batch on the Manufacturer portal!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
