"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";
import { processScan, getRandomItem } from "@/actions/scan";
import { AppShell } from "@/components/layout/AppShell";

export default function LogisticsDashboard() {
  const { address, isConnected, connect: connectWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const [itemId, setItemId] = useState("");
  const [location, setLocation] = useState("");

  const handleDemoFill = async () => {
    toast.info("Fetching a test item from the database...");
    const res = await getRandomItem();
    if (res.success && res.itemId) {
      setItemId(res.itemId);
      setLocation("Port of Los Angeles, Checkpoint 4");
      toast.success("Test data loaded! Click Scan & Verify.");
    } else {
      toast.error("No items found. Please mint a batch first.");
    }
  };

  const handleScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setScanResult(null);
    
    // Extract ID if user pasted the full QR verification URL
    let parsedId = itemId;
    if (parsedId.includes("/item/")) {
      const parts = parsedId.split("/item/");
      parsedId = parts[parts.length - 1];
    }
    
    const result = await processScan({
      itemId: parsedId,
      location: location,
    });
    
    setLoading(false);
    
    if (!result.success) {
      toast.error(result.error || "Failed to process scan");
    } else {
      if (result.isCounterfeit) {
        toast.error("COUNTERFEIT ANOMALY DETECTED!", { duration: 5000 });
      } else {
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Scan verified successfully. Custody updated.</span>
            {result.txHash && (
              <a href={`https://stellar.expert/explorer/testnet/tx/${result.txHash}`} target="_blank" rel="noreferrer" className="text-primary underline text-sm flex items-center gap-1 hover:text-primary-container transition-colors">
                View on Stellar Expert <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            )}
          </div>,
          { duration: 6000 }
        );
      }
      setScanResult(result);
    }
  };

  return (
    <AppShell>
      <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary font-label-caps text-label-caps px-3 py-1 rounded-full w-fit mb-3">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              LOGISTICS & SCANNING
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Transit Verification</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Update custody and log environmental data at critical checkpoints.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <div className="glass-card rounded-xl p-8 border border-outline-variant/30 delay-100 fade-in-up relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
                  Scan Item QR
                </h3>
                <button onClick={handleDemoFill} type="button" className="text-xs font-label-caps text-label-caps bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">auto_fix</span>
                  Test Mode
                </button>
              </div>
              
              <form onSubmit={handleScan} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">ITEM ID (FROM QR)</label>
                  <input 
                    name="itemId" 
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    required 
                    placeholder="e.g. Paste QR URL or ID" 
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-body-sm font-body-sm shadow-sm hover:shadow-md font-data-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">my_location</span>
                    SCANNER LOCATION
                  </label>
                  <input 
                    name="location" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required 
                    placeholder="e.g. Warehouse A, New York" 
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-body-sm font-body-sm shadow-sm hover:shadow-md" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-8 bg-on-surface text-surface font-label-caps text-label-caps py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-on-surface-variant transition-colors shadow-md active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin material-symbols-outlined">refresh</span>
                      Verifying with Blockchain...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">satellite_alt</span>
                      Scan & Verify
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-6">
            {scanResult ? (
              <div className={`glass-card rounded-xl p-8 border ${scanResult.isCounterfeit ? 'border-error bg-error/5' : 'border-secondary bg-secondary/5'} delay-200 fade-in-up h-full flex flex-col`}>
                <h3 className={`font-headline-md text-headline-md mb-6 border-b pb-4 flex items-center gap-2 ${scanResult.isCounterfeit ? 'text-error border-error/20' : 'text-secondary border-secondary/20'}`}>
                  {scanResult.isCounterfeit ? (
                    <><span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_bad</span> Potential Counterfeit Detected</>
                  ) : (
                    <><span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_good</span> Genuine Product Verified</>
                  )}
                </h3>
                
                <div className="flex-1">
                  {scanResult.itemDetails && (
                    <div className="space-y-4">
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">MEDICINE</span>
                        <span className="font-body-md text-body-md font-medium text-on-surface">{scanResult.itemDetails.medicineName}</span>
                      </div>
                      <hr className="border-outline-variant/20" />
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">MANUFACTURER</span>
                        <span className="font-body-md text-body-md font-medium text-on-surface">{scanResult.itemDetails.manufacturer}</span>
                      </div>
                      <hr className="border-outline-variant/20" />
                      <div>
                        <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">BATCH</span>
                        <span className="font-data-mono text-data-mono text-on-surface bg-surface px-2 py-1 rounded inline-block">{scanResult.itemDetails.batchNumber}</span>
                      </div>
                    </div>
                  )}
                  {scanResult.isCounterfeit && (
                    <div className="mt-6 p-4 bg-error/10 text-error font-medium rounded-lg border border-error/20 flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5">warning</span>
                      <div>
                        <div className="font-label-caps mb-1">ANOMALY REASON</div>
                        <div className="font-body-sm">{scanResult.scanEvent?.flagReason || "Flagged by anomaly detection algorithm."}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-outline-variant/30 rounded-xl flex flex-col items-center justify-center p-8 text-on-surface-variant bg-surface-container-lowest/50 min-h-[400px]">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">document_scanner</span>
                <p className="font-body-md text-center">Scan an item QR code to display real-time verification and custody data here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
