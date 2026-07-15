"use client";

import { useState, useEffect } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";
import { getProfile, updateProfile } from "@/actions/profile";
import { AppShell } from "@/components/layout/AppShell";

export default function ProfilePage() {
  const { address, isConnected } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (isConnected && address) {
      setFetchingProfile(true);
      getProfile(address).then(res => {
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
        setFetchingProfile(false);
      });
    } else {
      setProfile(null);
      setFetchingProfile(false);
    }
  }, [isConnected, address]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isConnected || !address) return;
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const brandName = formData.get("brandName") as string;
    const factoryAddress = formData.get("factoryAddress") as string;
    
    try {
      const res = await updateProfile({
        walletAddress: address,
        brandName,
        factoryAddress
      });
      if (res.success) {
        setProfile(res.profile);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-margin-mobile md:p-margin-desktop fade-in-up pb-24">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-caps text-label-caps px-3 py-1 rounded-full w-fit mb-3">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            USER PROFILE
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">Manage Profile</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Update your manufacturer details and brand identity.</p>
        </div>

        <div className="glass-card rounded-xl p-8 border border-outline-variant/30">
          {!isConnected ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">wallet</span>
              <p className="text-on-surface-variant font-body-md">Connect your wallet to manage your profile</p>
            </div>
          ) : fetchingProfile ? (
            <div className="text-center py-10 flex flex-col items-center gap-4">
              <span className="animate-spin material-symbols-outlined text-4xl text-primary">refresh</span>
              <p className="text-on-surface-variant font-body-md">Loading Profile...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-4 mb-8 p-4 bg-surface-container rounded-lg border border-outline-variant/30">
                 <div className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">wallet</span>
                 </div>
                 <div>
                    <p className="text-xs text-on-surface-variant font-label-caps">CONNECTED WALLET</p>
                    <p className="font-data-mono text-sm text-on-surface font-semibold">{address}</p>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">BRAND NAME</label>
                <input 
                  name="brandName" 
                  defaultValue={profile?.brandName || ""}
                  required 
                  placeholder="e.g. PharmaCorp Global" 
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm font-body-sm shadow-sm" 
                />
              </div>

              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant">NAME AND ADDRESS OF THE MANUFACTURER</label>
                <input 
                  name="factoryAddress" 
                  defaultValue={profile?.factoryAddress || ""}
                  required 
                  placeholder="e.g. 123 Industrial Ave, Tech City, 10001" 
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-body-sm font-body-sm shadow-sm" 
                />
              </div>
              
              <button type="submit" disabled={loading} className="w-full mt-8 bg-primary text-on-primary font-label-caps text-label-caps py-4 rounded-lg flex items-center justify-center gap-2 shadow-md">
                {loading ? <><span className="animate-spin material-symbols-outlined">refresh</span>Saving...</> : <><span className="material-symbols-outlined">save</span>Save Profile</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
}
