"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface BatchDetailClientProps {
  batch: any;
}

export default function BatchDetailClient({ batch }: BatchDetailClientProps) {
  const qrCodesRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!qrCodesRef.current) return;
    toast.info("Generating PDF...");
    try {
      // Use strict background colors so html2canvas doesn't fail on modern CSS colors like lab()
      const canvas = await html2canvas(qrCodesRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MediChain-Batch-${batch.batchNumber}.pdf`);
      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="max-w-container-max mx-auto p-margin-mobile md:p-margin-desktop fade-in-up pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Batch Details</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">View details and re-download verification QR codes for this batch.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 border-b border-outline-variant/20 pb-4">Batch Info</h3>
            
            <div className="space-y-4">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">BATCH NUMBER</span>
                <span className="font-data-mono text-data-mono text-on-surface">{batch.batchNumber}</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">MEDICINE</span>
                <span className="font-body-md text-on-surface">{batch.medicineName}</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">MINTED BY</span>
                <span className="font-data-mono text-data-mono text-on-surface text-sm break-all">{batch.ownerAddress}</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">QUANTITY</span>
                <span className="font-data-mono text-data-mono text-on-surface">{batch.quantity} Units</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">ON-CHAIN HASH</span>
                <a href={`https://stellar.expert/explorer/testnet/tx/${batch.blockchainHash}`} target="_blank" rel="noopener noreferrer" className="font-data-mono text-xs text-primary hover:underline break-all block">
                  {batch.blockchainHash}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 shadow-sm min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Unit QR Codes</h3>
              </div>
              <button onClick={handleDownloadPDF} className="bg-secondary/10 text-secondary border border-secondary/20 font-label-caps text-label-caps px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-secondary/20 transition-colors">
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>Print Labels
              </button>
            </div>
            
            <p className="text-on-surface-variant font-body-sm mb-4">
              Below are the unique QR codes for each physical unit in this batch. They can be printed and attached to packaging. 
              <br/><br/>
              <span className="font-semibold text-primary">Instruction:</span> Scan a QR code using your mobile device or scanner to verify the product's authenticity and provenance on-chain.
            </p>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {/* Isolated printable area with strict hex colors */}
              <div ref={qrCodesRef} style={{ backgroundColor: '#ffffff', color: '#000000', padding: '16px' }} className="grid grid-cols-2 md:grid-cols-3 gap-6 rounded-lg">
                {batch.items.map((item: any, index: number) => {
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
      </div>
    </div>
  );
}
