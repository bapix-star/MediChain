"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWalletStore } from "@/store/useWalletStore";
import { WalletConnect } from "@/components/WalletConnect";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { DnaStrand } from "@/components/DnaStrand";
import * as THREE from "three";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { address } = useWalletStore();
  const isConnected = !!address;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const fragmentShader = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;

      void main() {
          vec2 uv = v_texCoord;
          
          float color = 0.0;
          color += sin(uv.x * 10.0 + u_time * 0.5) * 0.1;
          color += sin(uv.y * 8.0 - u_time * 0.3) * 0.1;
          color += sin((uv.x + uv.y) * 5.0 + u_time * 0.2) * 0.1;
          
          vec3 color1 = vec3(0.047, 0.388, 0.906); // #0c63e7
          vec3 color2 = vec3(0.976, 0.976, 0.988); // #f9f9fc
          
          vec3 finalColor = mix(color1, color2, color + 0.85);
          
          float dist = distance(uv, vec2(0.5));
          finalColor *= 1.0 - dist * 0.2;

          gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const vertexShader = `
      varying vec2 v_texCoord;
      void main() {
          v_texCoord = uv;
          gl_Position = vec4(position, 1.0);
      }
    `;

    const uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
    };

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = performance.now();
    let frameId: number;

    function animate() {
        frameId = requestAnimationFrame(animate);
        uniforms.u_time.value = (performance.now() - startTime) / 1000;
        renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
        if(container) {
            renderer.setSize(container.clientWidth, container.clientHeight);
            uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
        }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full bg-surface">
      {/* Landing Page Header */}
      <header className="bg-surface/80 backdrop-blur-xl docked full-width top-0 sticky z-50 border-b border-outline-variant/30 shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3">
        <div className="flex items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/manufacturer" className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors px-2 py-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">inventory_2</span> REGISTRY</Link>
            <Link href="/logistics" className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors px-2 py-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">local_pharmacy</span> PHARMACY POS</Link>
            <Link href="/explorer" className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors px-2 py-1 flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">database</span> EXPLORER</Link>
          </nav>
          <div className="h-6 w-px bg-outline-variant/30 hidden md:block mx-2"></div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="text-on-surface-variant hover:bg-surface-container-high/50 transition-colors p-2 rounded-full hidden md:block">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            {isConnected && (
              <Link href="/profile" className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-colors p-2 rounded-full hidden md:block" title="My Profile">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            )}
            <WalletConnect />
            <button 
              className="md:hidden p-2 text-on-surface-variant rounded-full hover:bg-surface-container-low transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/30 shadow-lg py-4 px-margin-mobile flex flex-col gap-4 z-40 animate-fade-in-up">
            <Link href="/manufacturer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              <span className="font-label-caps text-label-caps text-on-surface">Registry</span>
            </Link>
            <Link href="/logistics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-secondary">local_pharmacy</span>
              <span className="font-label-caps text-label-caps text-on-surface">Pharmacy POS</span>
            </Link>
            <Link href="/explorer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-primary">database</span>
              <span className="font-label-caps text-label-caps text-on-surface">Explorer</span>
            </Link>
            {isConnected && (
              <Link href="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
                <span className="font-label-caps text-label-caps text-on-surface">My Profile</span>
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="w-full relative">
        {/* Unified Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-[1600px] z-0 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
          <div className="absolute inset-0" ref={canvasRef}></div>
        </div>

        {/* Hero Section */}
        <section className="relative w-full pt-20 pb-16 md:pt-24 md:pb-20 px-margin-mobile md:px-margin-desktop overflow-hidden">
          
          <div className="relative z-10 w-full max-w-container-max mx-auto">
            <div className="glass-panel p-8 md:p-12 rounded-2xl shadow-xl w-full animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-caps text-label-caps px-3 py-1 rounded-full w-fit animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    ON-CHAIN VERIFIED LOGISTICS
                  </div>
                  <h1 className="font-display-lg text-display-lg text-on-surface animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    Secure the Source.<br/><span className="text-primary">Verify the Journey.</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    Immutable, real-time tracking for pharmaceutical supply chains. Ensure clinical precision and data transparency from manufacturer to patient.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <Link href="/manufacturer" className="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-[0.98] transition-transform shadow-md">
                      <span className="material-symbols-outlined">precision_manufacturing</span>
                      Manufacturer Portal
                    </Link>
                    <Link href="/logistics" className="border border-outline-variant text-on-surface font-label-caps text-label-caps px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors bg-white/50 backdrop-blur-sm">
                      <span className="material-symbols-outlined">local_pharmacy</span>
                      Pharmacy POS
                    </Link>
                  </div>
                </div>
                <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden glass-panel flex items-center justify-center bg-white/60 animate-fade-in-up shadow-inner" style={{ animationDelay: '200ms' }}>
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* Animated Slogan below hero */}
            <div className="mt-12 -mb-6 text-center animate-fade-in-up relative z-20" style={{ animationDelay: '300ms' }}>
              <div className="inline-flex items-center gap-3 px-6 md:px-8 py-3 rounded-full bg-surface-container-lowest/60 backdrop-blur-md border border-white/50 shadow-xl shadow-primary/5">
                <span className="material-symbols-outlined text-secondary animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <p className="font-label-caps text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-text drop-shadow-sm mt-0.5">
                  Trusted by 100+ Global Pharmaceutical Leaders
                </p>
              </div>
            </div>
            
          </div>
        </section>

        {/* Pharma Partners Marquee */}
        <section className="py-12 border-y border-outline-variant/20 bg-surface-container-lowest overflow-hidden flex relative z-10">
          <div className="w-full flex relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-container-lowest to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-container-lowest to-transparent z-20 pointer-events-none"></div>
            
            <div className="flex animate-marquee whitespace-nowrap opacity-100 transition-opacity duration-300" style={{ animationDuration: '20s' }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 mx-8 shrink-0">
                <img src="/logos/Acadia_rgb_primary_gradient.png" alt="Acadia" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/Akeso.svg" alt="Akeso" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/Allergan_logo.svg" alt="Allergan" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/Cetaphil_Thailand_Logo.png" alt="Cetaphil" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/Chiesi_Logo_-_1.Primary_pantoni_RGB.jpg" alt="Chiesi" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/Hansoh_Pharmaceutical.svg" alt="Hansoh" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/I3_Consult_Logo.jpg" alt="I3 Consult" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/National_Pharmacy_Association_Logo.svg" alt="NPA" className="h-12 w-auto object-contain shrink-0 rounded" />
                <img src="/logos/Orion_pharma_logo_(2025-).svg" alt="Orion" className="h-12 w-auto object-contain shrink-0 rounded" />
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="pt-16 pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

          <div className="mb-20 text-center animate-fade-in-up relative z-10">
            <h2 className="font-headline-lg text-4xl md:text-5xl text-on-surface mb-6 font-bold tracking-tight">Immutable Security Architecture</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">Built on a decentralized framework to eliminate single points of failure in critical medical supply chains, ensuring 100% data integrity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            {/* Card 1 - Real-Time Tracking */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-6 group relative rounded-2xl p-[1px] overflow-hidden bg-gradient-to-br from-outline-variant/50 to-transparent hover:from-primary/50 hover:to-secondary/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-full bg-surface-container-lowest rounded-[15px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
                
                <div>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(12,99,231,0.2)]">
                    <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                  </div>
                  <h3 className="font-headline-md text-2xl text-on-surface mb-4 font-bold tracking-tight">Stellar Blockchain Registry</h3>
                  <p className="font-body-md text-on-surface-variant max-w-xl leading-relaxed text-lg">Immutable minting of pharmaceutical batches directly to the Stellar network using smart contracts, ensuring absolute origin authenticity.</p>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-primary font-label-lg font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <Link href="/manufacturer" className="flex items-center gap-2">
                    <span>View Registry Network</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Card 2 - Compliance */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-6 group relative rounded-2xl p-[1px] overflow-hidden bg-gradient-to-br from-outline-variant/50 to-transparent hover:from-secondary/50 hover:to-transparent transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-full bg-surface-container-lowest rounded-[15px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                    <span className="material-symbols-outlined text-3xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
                  </div>
                  <h3 className="font-headline-md text-2xl text-on-surface mb-4 font-bold tracking-tight">Pharmacy POS & Dispensing</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed text-lg">Integrated barcode scanning at the point of sale to instantly detect already-dispensed medication and prevent counterfeits.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Card 3 - Anti-Counterfeit */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-6 group relative rounded-2xl p-[1px] overflow-hidden bg-gradient-to-br from-outline-variant/50 to-transparent hover:from-error/50 hover:to-transparent transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-full bg-surface-container-lowest rounded-[15px] p-8 md:p-10 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <span className="material-symbols-outlined text-3xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
                  </div>
                  <h3 className="font-headline-md text-2xl text-on-surface mb-4 font-bold tracking-tight">Public Verification Portal</h3>
                  <p className="font-body-md text-on-surface-variant leading-relaxed text-lg">Consumers can scan QR codes to instantly view the complete, transparent journey of their medication from factory to pharmacy.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Card 4 - Zero-Knowledge Proofs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-6 group relative rounded-2xl p-[1px] overflow-hidden bg-gradient-to-br from-outline-variant/50 to-transparent hover:from-tertiary/50 hover:to-primary/50 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-full bg-surface-container-lowest rounded-[15px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <span className="material-symbols-outlined text-3xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_bad</span>
                  </div>
                  <h3 className="font-headline-md text-2xl text-on-surface mb-4 font-bold tracking-tight">Counterfeit Anomaly Detection</h3>
                  <p className="font-body-md text-on-surface-variant max-w-xl leading-relaxed text-lg">Real-time cryptographic validation that flags duplicate scans, unauthorized supply chain entries, and impossible transit times.</p>
                </div>
                
                <div className="hidden md:flex flex-col items-center justify-center p-6 bg-surface-container rounded-xl border border-outline-variant/30 shadow-inner min-w-[200px]">
                  <div className="relative">
                    <span className="material-symbols-outlined text-tertiary text-4xl mb-2 relative z-10">verified</span>
                    <div className="absolute inset-0 bg-tertiary blur-xl opacity-40 mix-blend-screen group-hover:opacity-80 transition-opacity duration-500"></div>
                  </div>
                  <span className="font-data-mono text-sm font-bold text-on-surface tracking-wider">STELLAR</span>
                  <span className="font-label-sm text-tertiary uppercase tracking-widest mt-1">Verified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works (Timeline) */}
        <section id="how-it-works" className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="mb-16 text-center animate-fade-in-up">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">The Immutable Journey</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">A transparent, step-by-step overview of how a pharmaceutical batch moves through the MediChain network.</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block">
              <DnaStrand />
            </div>
            {/* Simple vertical line for mobile */}
            <div className="absolute left-8 top-0 bottom-0 w-[2px] -ml-[1px] bg-outline-variant/30 md:hidden z-0"></div>
            
            <div className="relative flex items-center justify-between mb-12 flex-col md:flex-row animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-full md:w-5/12 pl-16 md:pl-0 md:text-right md:pr-12">
                <h3 className="font-headline-md text-headline-md text-on-surface">1. Manufacturer</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Batch is produced. Serialization data and initial QA parameters are minted as an NFT on the ledger.</p>
              </div>
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary -ml-2 border-4 border-surface shadow-sm z-10 top-2 md:top-auto"></div>
              <div className="w-full md:w-5/12 pl-16 md:pl-12 mt-4 md:mt-0">
                <div className="glass-panel p-4 rounded-lg flex items-center gap-3 w-fit">
                  <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant">TX HASH</div>
                    <div className="font-data-mono text-data-mono text-on-surface">0x7a...9f2b</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between mb-12 flex-col md:flex-row-reverse animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-full md:w-5/12 pl-16 md:pl-0 md:text-left md:pl-12">
                <h3 className="font-headline-md text-headline-md text-on-surface">2. Distributor</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Ownership transferred via smart contract. IoT sensors update environmental logs during transit.</p>
              </div>
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary -ml-2 border-4 border-surface shadow-sm z-10 top-2 md:top-auto"></div>
              <div className="w-full md:w-5/12 pl-16 md:pl-0 md:pr-12 mt-4 md:mt-0 flex md:justify-end">
                <div className="glass-panel p-4 rounded-lg flex items-center gap-3 w-fit">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant">TEMP LOG</div>
                    <div className="font-data-mono text-data-mono text-on-surface">2.4°C - VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between mb-12 flex-col md:flex-row animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="w-full md:w-5/12 pl-16 md:pl-0 md:text-right md:pr-12">
                <h3 className="font-headline-md text-headline-md text-on-surface">3. Pharmacy</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Arrival scan validates complete transit history. Drug authenticity is guaranteed before dispensing.</p>
              </div>
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-primary -ml-2 border-4 border-surface shadow-sm z-10 top-2 md:top-auto"></div>
              <div className="w-full md:w-5/12 pl-16 md:pl-12 mt-4 md:mt-0">
                <div className="glass-panel p-4 rounded-lg flex items-center gap-3 w-fit">
                  <span className="material-symbols-outlined text-primary">local_pharmacy</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant">STATUS</div>
                    <div className="font-data-mono text-data-mono text-on-surface">IN STOCK</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between flex-col md:flex-row-reverse animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="w-full md:w-5/12 pl-16 md:pl-0 md:text-left md:pl-12">
                <h3 className="font-headline-md text-headline-md text-on-surface">4. Consumer</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">End-user scans package QR to view complete, immutable history of their medication.</p>
              </div>
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-secondary -ml-2 border-4 border-surface shadow-sm z-10 top-2 md:top-auto"></div>
              <div className="w-full md:w-5/12 pl-16 md:pl-0 md:pr-12 mt-4 md:mt-0 flex md:justify-end">
                <div className="glass-panel p-4 rounded-lg border-secondary/50 bg-secondary/5 flex items-center gap-3 w-fit">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-secondary">PROOF OF DELIVERY</div>
                    <div className="font-data-mono text-data-mono text-secondary">VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Verification Demo Section */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-primary-fixed/20">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Live Verification Demo</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">Scan the QR code to simulate a consumer verifying a pharmaceutical batch. Experience the speed and transparency of on-chain data retrieval.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check</span>
                  <span className="font-body-sm text-body-sm text-on-surface">Instantly check origin facility</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check</span>
                  <span className="font-body-sm text-body-sm text-on-surface">Review temperature logs during transit</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check</span>
                  <span className="font-body-sm text-body-sm text-on-surface">Confirm FDA compliance status</span>
                </li>
              </ul>
              
              <Link href="/explorer" className="mt-8 inline-flex items-center gap-2 text-primary font-label-caps text-label-caps hover:underline">
                BROWSE BLOCKCHAIN EXPLORER <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="glass-panel p-8 rounded-2xl w-fit flex flex-col items-center">
                <div className="relative w-48 h-48 bg-white p-2 rounded-lg border border-outline-variant/30 mb-6 flex items-center justify-center">
                  <div className="w-full h-full border-4 border-primary/20 flex flex-col justify-between p-2">
                    <div className="flex justify-between w-full"><div className="w-8 h-8 border-t-4 border-l-4 border-primary"></div><div className="w-8 h-8 border-t-4 border-r-4 border-primary"></div></div>
                    <div className="flex justify-between w-full"><div className="w-8 h-8 border-b-4 border-l-4 border-primary"></div><div className="w-8 h-8 border-b-4 border-r-4 border-primary"></div></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-outline">qr_code_scanner</span>
                    </div>
                  </div>
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant mb-2">SCAN TO VERIFY BATCH</div>
                <div className="font-data-mono text-data-mono text-primary bg-primary/10 px-3 py-1 rounded">#MC-892-XT</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest border-t border-outline-variant/10 w-full py-8">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up">
          <div className="font-headline-md text-headline-md font-bold text-primary">MediChain</div>
          <div className="text-on-surface-variant font-body-sm text-body-sm">
            © 2024 MediChain Platform. On-Chain Verified.
          </div>
          <nav className="flex gap-6">
            <Link href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-on-surface-variant font-body-sm text-body-sm hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
