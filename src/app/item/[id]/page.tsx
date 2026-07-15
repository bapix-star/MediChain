import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ItemPassport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id: id },
    include: {
      batch: true,
      scans: {
        orderBy: { timestamp: 'desc' }
      }
    }
  });

  if (!item) {
    notFound();
  }

  const isExpired = new Date(item.batch.expiryDate) < new Date();

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Dot Pattern to match screenshot */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 md:p-10 border border-gray-100">
        
        {/* Header section with verified checkmark */}
        <div className="flex flex-col items-center justify-center mb-10 border-b border-gray-100 pb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-600/20">
            <span className="material-symbols-outlined text-white text-5xl font-bold">check</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Verified Product</h1>
          <p className="text-gray-500 mt-2 font-medium">Authenticity confirmed via MediChain Network</p>
        </div>

        {/* Code Details Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Code Details
          </h2>

          <div className="space-y-5">
            {/* GTIN */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">qr_code_2</span>
                <span className="text-sm font-medium text-gray-600">Unique Product Identifier (Unit ID) :</span>
              </div>
              <div className="text-sm font-bold text-gray-900 tracking-wider">
                {item.id.slice(-8).toUpperCase()}
              </div>
            </div>

            {/* Proper Name */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">medication</span>
                <span className="text-sm font-medium text-gray-600">Proper Name Of The Drug :</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.batch.medicineName}
              </div>
            </div>

            {/* Brand Name */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">domain</span>
                <span className="text-sm font-medium text-gray-600">Brand Name :</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.batch.medicineName.split(' ')[0]} +
              </div>
            </div>

            {/* Manufacturer */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">factory</span>
                <span className="text-sm font-medium text-gray-600">Name And Address Of The Manufacturer :</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.batch.manufacturer}
              </div>
            </div>

            {/* Batch Number */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">tag</span>
                <span className="text-sm font-medium text-gray-600">Batch Number :</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.batch.batchNumber}
              </div>
            </div>

            {/* Mfg Date */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                <span className="text-sm font-medium text-gray-600">Date Of Manufacturing :</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {new Date(item.batch.manufacturingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Exp Date */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">event_busy</span>
                <span className="text-sm font-medium text-gray-600">Date Of Expiry :</span>
              </div>
              <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                {new Date(item.batch.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                {isExpired && <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-0.5 rounded">Expired!</span>}
              </div>
            </div>

            {/* Composition */}
            <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                <span className="material-symbols-outlined text-gray-400">science</span>
                <span className="text-sm font-medium text-gray-600">Qualitative Details of Excipients :</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.batch.composition}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Thanks */}
        <div className="text-center mt-10 mb-8">
          <p className="text-red-600 font-bold text-sm">Thank you for visiting us ! We appreciate the opportunity to serve you.</p>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="#" className="text-red-500 hover:text-red-700 text-sm font-bold underline transition-colors">Contact Us</a>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">Powered by <span className="font-bold text-red-500">MediChain Secure</span></span>
            
            {/* The actual blockchain proof link */}
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${item.batch.blockchainHash}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
            >
              <img src="https://stellar.expert/img/stellar-expert-blue.svg" alt="Stellar" className="h-4" />
              View Blockchain Proof
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
