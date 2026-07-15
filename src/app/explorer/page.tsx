import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function ExplorerDashboard() {
  const batches = await prisma.batch.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const totalItems = await prisma.item.count();
  const totalBatches = await prisma.batch.count();

  return (
    <AppShell>
      <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop space-y-6 fade-in-up">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Blockchain Explorer</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Real-time immutable ledger for MediChain pharmaceutical logistics.</p>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/30 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="font-data-mono text-data-mono text-on-surface-variant">Network Status: <span className="text-secondary font-semibold">Healthy (Testnet)</span></span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Network Stats Overview */}
          <div className="lg:col-span-8 glass-card rounded-xl p-6">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant/20 pb-4">Network Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant">MediChain Price</span>
                <span className="font-data-mono text-data-mono text-on-surface text-lg">$4.21 <span className="text-secondary text-sm ml-1">+2.4%</span></span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Total Batches</span>
                <span className="font-data-mono text-data-mono text-on-surface text-lg">{totalBatches}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Total Items Minted</span>
                <span className="font-data-mono text-data-mono text-on-surface text-lg">{totalItems.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Avg Block Time</span>
                <span className="font-data-mono text-data-mono text-on-surface text-lg">2.1s</span>
              </div>
            </div>
            
            {/* Simple visual chart representation */}
            <div 
              className="mt-8 h-32 w-full flex items-end gap-1 opacity-80 rounded-lg border border-outline-variant/30" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAirweCVyGK3kfwiFAoWDM5nR8c-4a2l8aATtGOWo2gZOc7qAQiwGe2YbOGXWO5bDhaUeKoHvwdz_rnf107WUEhqpZjS2DPpiG0kC87CHDm1OfmeRnB6Svgbgn8OuJMRqZrLiW0oyVY-EwvzZ1VnOP43MU5kmO3uVUKNo5jnBX12FU6qGlJl6JXxgJUM3-Hv0ETlrI88oa4tmSi3LjBOCM15t-9fmagZ2Crt_Y6d0eOK7fH762LaN_i')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
            </div>
          </div>

          {/* Smart Contract Info */}
          <div className="lg:col-span-4 bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface text-lg">Stellar Network</h3>
                <span className="font-label-caps text-label-caps text-primary bg-primary/10 px-2 py-0.5 rounded">Connected</span>
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Horizon Node</span>
                <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 rounded-lg">
                  <span className="font-data-mono text-data-mono text-on-surface text-xs truncate mr-2">horizon-testnet.stellar.org</span>
                  <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[16px]">content_copy</span></button>
                </div>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Asset Protocol</span>
                <span className="font-data-mono text-data-mono text-on-surface">ManageData (MediChain_Batch)</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Ledger Status</span>
                <span className="font-data-mono text-data-mono text-on-surface text-primary">Synced & Healthy</span>
              </div>
            </div>
            <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noopener noreferrer" className="w-full mt-6 flex justify-center items-center gap-2 bg-surface-container-low text-primary border border-outline-variant/30 py-2 rounded-lg font-label-caps text-label-caps hover:bg-surface-container-high transition-colors">
              View on Stellar Expert <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-12 glass-card rounded-xl overflow-hidden mt-2">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
              <h3 className="font-headline-md text-headline-md text-on-surface text-xl">Latest Minted Batches (Live Data)</h3>
              <button className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
                      <td className="p-4 text-on-surface text-sm">{batch.createdAt.toLocaleDateString()}</td>
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
        </div>
      </div>
    </AppShell>
  );
}
