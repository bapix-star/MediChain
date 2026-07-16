import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { NetworkChart } from "@/components/explorer/NetworkChart";
import { LiveBatchTable } from "@/components/explorer/LiveBatchTable";

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
            <NetworkChart />
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

          {/* Recent Transactions (Client Component) */}
          <LiveBatchTable initialBatches={batches} />
        </div>
      </div>
    </AppShell>
  );
}
