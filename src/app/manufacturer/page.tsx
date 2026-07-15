"use client";

import { useState, useRef } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";
import { createBatch } from "@/actions/batch";
import { AppShell } from "@/components/layout/AppShell";
import { Horizon, TransactionBuilder, Networks, Operation } from "@stellar/stellar-sdk";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export default function ManufacturerDashboard() {
  const { address, isConnected, signTransaction, submitTransaction } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [mintedBatch, setMintedBatch] = useState<any>(null);
  const [mintedItems, setMintedItems] = useState<any[]>([]);
  const qrCodesRef = useRef<HTMLDivElement>(null);

  const handleCreateBatch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const batchNumber = formData.get("batchNumber") as string;
    
    try {
      toast.info("Awaiting wallet signature...");
      
      const account = await server.loadAccount(address);
      const tx = new TransactionBuilder(account, { fee: "1000", networkPassphrase: Networks.TESTNET })
        .addOperation(Operation.manageData({
          name: "MediChain_Batch",
          value: batchNumber.substring(0, 64)
        }))
        .setTimeout(300)
        .build();

      const signedXdr = await signTransaction(tx.toXDR());
      
      toast.info("Submitting transaction to Stellar network...");

      const txResult = await submitTransaction(signedXdr);
      const txHash = txResult.hash;

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Transaction confirmed! Saving to database...</span>
          <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-primary underline text-sm flex items-center gap-1 hover:text-primary-container transition-colors">
            View on Stellar Expert <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        </div>,
        { duration: 5000 }
      );

      const result = await createBatch({
        batchNumber,
        medicineName: formData.get("medicineName") as string,
        manufacturer: "PharmaCorp Global",
        composition: formData.get("composition") as string,
        quantity: parseInt(formData.get("quantity") as string),
        manufacturingDate: new Date(formData.get("manufacturingDate") as string),
        expiryDate: new Date(formData.get("expiryDate") as string),
        merkleRoot: "0x" + Math.random().toString(16).substring(2, 10),
        blockchainHash: txHash,
        ownerAddress: address,
      });
      
      if (result.success && result.items) {
        setMintedBatch(result.batch);
        setMintedItems(result.items);
        toast.success(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Batch created successfully and written to blockchain!</span>
            <span className="text-on-surface-variant text-xs font-data-mono truncate max-w-[250px]">Hash: {txHash}</span>
          </div>,
          { duration: 8000 }
        );
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Failed to create batch in database");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred during minting");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!qrCodesRef.current) return;
    toast.info("Generating PDF...");
    try {
      const canvas = await html2canvas(qrCodesRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MediChain-Batch-${mintedBatch?.batchNumber}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <AppShell>
      <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop fade-in-up pb-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-caps text-label-caps px-3 py-1 rounded-full w-fit mb-3">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
              MANUFACTURER PORTAL
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Registry & Minting</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Mint and manage pharmaceutical batches directly on-chain.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 glass-card rounded-xl p-8 border border-outline-variant/30 h-fit">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant/20 pb-4">Register New Batch</h3>
            
            <form onSubmit={handleCreateBatch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">BATCH NUMBER</label>
                  <input name="batchNumber" required placeholder="e.g. BATCH-2024-001" className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm font-body-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">MEDICINE NAME</label>
                  <input name="medicineName" required placeholder="e.g. Paracetamol 500mg" className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm font-body-sm shadow-sm" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">COMPOSITION (ACTIVE INGREDIENTS)</label>
                <input name="composition" required placeholder="Active ingredients..." className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm font-body-sm shadow-sm" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">MANUFACTURING DATE</label>
                  <input name="manufacturingDate" type="date" required className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">EXPIRY DATE</label>
                  <input name="expiryDate" type="date" required className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm shadow-sm" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">QUANTITY (UNITS)</label>
                <input name="quantity" type="number" required min="1" max="1000" placeholder="100" className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm font-body-sm shadow-sm font-data-mono" />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded-lg flex items-center justify-center gap-2 shadow-md">
                {loading ? <><span className="animate-spin material-symbols-outlined">refresh</span>Minting to Blockchain...</> : <><span className="material-symbols-outlined">add_circle</span>Create & Mint Batch</>}
              </button>
            </form>
          </div>

          {mintedItems.length > 0 && (
            <div className="lg:col-span-6 animate-fade-in-up">
              <div className="glass-card rounded-xl p-8 border border-outline-variant/30 flex flex-col h-full max-h-[800px]">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface text-secondary flex items-center gap-2">
                      <span className="material-symbols-outlined">check_circle</span>
                      Batch Minted Successfully
                    </h3>
                    <a href={`https://stellar.expert/explorer/testnet/tx/${mintedBatch?.blockchainHash}`} target="_blank" rel="noopener noreferrer" className="font-data-mono text-xs text-primary hover:underline mt-1 block">TxHash: {mintedBatch?.blockchainHash.substring(0, 16)}...</a>
                  </div>
                  <button onClick={handleDownloadPDF} className="bg-secondary/10 text-secondary border border-secondary/20 font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>Print Labels
                  </button>
                </div>
                <p className="text-on-surface-variant font-body-sm mb-4">Below are the unique QR codes for each physical unit. They are ready to be printed and attached to packaging.</p>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div ref={qrCodesRef} style={{ backgroundColor: '#ffffff', color: '#000000', padding: '16px' }} className="grid grid-cols-2 md:grid-cols-3 gap-6 rounded-lg">
                    {mintedItems.map((item, index) => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://medichain-sepia.vercel.app';
                      const verificationUrl = `${origin}/item/${item.id}`;
                      return (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center', gap: '8px', pageBreakInside: 'avoid' }}>
                          <QRCode value={verificationUrl} size={100} level="H" />
                          <div style={{ marginTop: '8px', fontSize: '9px', fontFamily: 'monospace', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', wordBreak: 'break-all', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 'bold', color: '#000000' }}>UNIT #{index + 1}</span><br/>
                            ID: {item.id.slice(-8)}<br/>
                            Verify at MediChain
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
