"use client";

import { useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";
import { processScan, getRandomItem } from "@/actions/scan";
import { AppShell } from "@/components/layout/AppShell";
import { Scanner } from "@yudiel/react-qr-scanner";
import jsQR from "jsqr";
import { useRef } from "react";

export default function LogisticsDashboard() {
  const { address, isConnected, connect: connectWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const [itemId, setItemId] = useState("");
  const [location, setLocation] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWebcamScan = (detectedCodes: any) => {
    if (detectedCodes && detectedCodes.length > 0) {
      setItemId(detectedCodes[0].rawValue);
      setShowScanner(false);
      toast.success("QR Code scanned! You can now verify.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setItemId(code.data);
          toast.success("QR Code extracted successfully!");
        } else {
          toast.error("Could not find a valid QR code in the image.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDemoFill = async () => {
    toast.info("Fetching a test item from the database...");
    const res = await getRandomItem();
    if (res.success && res.itemId) {
      setItemId(res.itemId);
      setLocation("Walgreens Pharmacy, Main St.");
      toast.success("Test data loaded! Click Scan & Dispense.");
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
      actionType: "SALE",
    });
    
    setLoading(false);
    
    if (!result.success) {
      toast.error(result.error || "Failed to process scan");
      if (result.itemDetails || result.isCounterfeit) {
        setScanResult(result);
      }
    } else {
      if (result.isCounterfeit) {
        toast.error("COUNTERFEIT ANOMALY DETECTED!", { duration: 5000 });
      } else {
        toast.success(
          "Scan verified successfully. Custody updated.",
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
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
              PHARMACY DISPENSE
            </div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Pharmacy POS</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Scan medicine QR code to officially dispense it to the patient and check for counterfeits.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <div className="glass-card rounded-xl p-8 border border-outline-variant/30 delay-100 fade-in-up relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              <div className="border-b border-outline-variant/20 pb-4 mb-6">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
                  Scan Item QR
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setShowScanner(!showScanner)} type="button" className={`w-full justify-center text-xs font-label-caps text-label-caps px-2 py-2 rounded-lg transition-colors flex flex-col items-center gap-1 ${showScanner ? 'bg-error/10 text-error hover:bg-error/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                    {showScanner ? "Close" : "Webcam"}
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} type="button" className="w-full justify-center text-xs font-label-caps text-label-caps bg-primary/10 text-primary hover:bg-primary/20 px-2 py-2 rounded-lg transition-colors flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Upload
                  </button>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                  <button onClick={handleDemoFill} type="button" className="w-full justify-center text-xs font-label-caps text-label-caps bg-secondary/10 text-secondary hover:bg-secondary/20 px-2 py-2 rounded-lg transition-colors flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">auto_fix</span>
                    Test Mode
                  </button>
                </div>
              </div>
              
              {/* Toggle section removed as per user request */}

              {showScanner && (
                <div className="mb-6 rounded-lg overflow-hidden border border-outline-variant/30 aspect-square max-w-[300px] mx-auto relative">
                  <Scanner onScan={handleWebcamScan} onError={(error) => console.error(error)} />
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"></div>
                  <div className="absolute inset-0 border-2 border-primary m-10 pointer-events-none rounded-lg"></div>
                  <p className="absolute bottom-2 inset-x-0 text-center text-white text-xs font-bold drop-shadow-md z-10">Hold QR code up to camera</p>
                </div>
              )}

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
                      <span className="material-symbols-outlined">point_of_sale</span>
                      Scan & Dispense
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
                    <><span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_good</span> Product Dispensed & Verified</>
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
                      {!scanResult.isCounterfeit && scanResult.itemDetails?.id && (
                        <>
                          <hr className="border-outline-variant/20" />
                          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <span className="font-label-caps text-label-caps text-on-surface-variant block mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                              FULL VERIFICATION PORTAL
                            </span>
                            <a href={`/item/${scanResult.itemDetails.id}`} target="_blank" rel="noreferrer" className="text-primary font-medium hover:underline flex items-center gap-1 transition-all">
                              View Complete Product History <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {scanResult.isCounterfeit && (
                    <div className="mt-6 p-4 bg-error/10 text-error font-medium rounded-lg border border-error/20 flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5">warning</span>
                      <div>
                        <div className="font-label-caps mb-1">ANOMALY REASON</div>
                        <div className="font-body-sm">{scanResult.error || scanResult.scanEvent?.flagReason || "Flagged by anomaly detection algorithm."}</div>
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
