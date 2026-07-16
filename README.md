<div align="center">
  
# 💊 MediChain

**Enterprise-grade supply chain authenticity and counterfeit anomaly detection built on the Stellar network using Soroban Smart Contracts.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-black)](https://stellar.org/)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange)](https://soroban.stellar.org/)

  <h3>🚀 Live Production Deployment: <a href="https://medichain-sepia.vercel.app/">https://medichain-sepia.vercel.app/</a></h3>
  <h3>🎥 Video Walkthrough: <a href="#">[Insert YouTube Link Here]</a></h3>

![Hero Dashboard](./demo-img/hero-showingconnected-balance-wallet.png)

*"Every medicine has a digital passport. cryptographically secure, immutable, and instantly verifiable on the Stellar network to ensure patient safety globally."*

</div>

---

## 🏆 Stellar Belt Challenge Submission Checklist

### ⚪️ Level 1 - White Belt Submission

| Requirement | Status & Implementation Details |
| :--- | :--- |
| **Wallet Setup** | ✅ Integrated StellarWalletsKit (Freighter) exclusively on Testnet |
| **Wallet Connection** | ✅ Unified UI component for seamless connect/disconnect with custom Pill design |
| **Balance Handling** | ✅ Fetches and clearly displays XLM balance via Soroban RPC |
| **Transaction Flow** | ✅ UI shows success/failure toasts and verified Tx Hash |
| **Development Standards** | ✅ High-quality UI, wallet integration, and error handling |
| **Required Deliverables** | ✅ Repo, README, Setup instructions, and 4 required Screenshots |

### 🟡 Level 2 - Yellow Belt Submission

| Requirement | Status & Implementation Details |
| :--- | :--- |
| **3 Error Types Handled** | ✅ Wallet rejection (`code: -1`), Prisma DB errors, Smart Contract validation failures |
| **Contract Deployed** | ✅ Manufacturer & Core Soroban contracts deployed on Testnet |
| **Contract Called** | ✅ Frontend successfully calls the deployed smart contracts to Mint Batches |
| **Tx Status Visible** | ✅ Success modals and real-time ledger polling confirm execution |
| **Meaningful Commits** | ✅ Repository contains over 100+ meaningful commits documenting the journey |
| **Deliverable Met** | ✅ Multi-wallet app with deployed contract and real-time events |
| **Required Deliverables** | ✅ Live demo, Multi-wallet screenshot, Verifiable Tx Hash |

### 🟠 Level 3 - Orange Belt Submission

| Requirement | Status & Implementation Details |
| :--- | :--- |
| **Advanced Contracts** | ✅ Built bespoke `Manufacturer` and `Core` supply chain contracts using Rust |
| **Inter-Contract Comm** | ✅ `Core` securely cross-calls `Manufacturer` (RBAC) to verify caller permissions |
| **Event Streaming** | ✅ Live Activity Blockchain Explorer actively polls the database for real-time events |
| **CI/CD Pipeline** | ✅ GitHub Actions runs Rust/Next.js tests, builds on PRs, and has highly optimized `cargo binstall` |
| **Deployment Workflow** | ✅ Automated `deploy.sh` scripts provided in documentation |
| **Mobile Responsive** | ✅ Complex tables, sidebars, and navigation perfectly optimized for mobile |
| **Error & Loading States** | ✅ Rich UX loading states (Zustand) and Toast error notifications |
| **Testing Suite** | ✅ 10 Vitest frontend tests passing and Rust unit tests implemented |
| **Production Architecture**| ✅ Built on Next.js App Router, Prisma Postgres ORM, and Zustand |
| **Documentation** | ✅ Comprehensive professional README provided with architecture and diagrams |
| **Required Deliverables** | ✅ Video Demo, Mobile/CI screenshots, Contract IDs & Hash |

---

## 📖 Product Overview & Problem Statement

### The Problem
The global pharmaceutical supply chain is plagued by counterfeit medicines, costing billions and endangering lives. Traditional QR codes can be easily cloned by malicious actors (e.g., printing the same QR code on 1,000 fake medicine packages), making standard tracking systems useless against coordinated fraud.

### The Solution: MediChain
MediChain introduces a **Digital Product Passport (DPP)**. Every medicine batch is cryptographically secured on the Stellar blockchain, ensuring absolute provenance while off-chain scans track the lifecycle.
- **Tamper-Proof Batches**: Manufacturers mint medicine batches as unique, immutable records on-chain (storing the Merkle root and Metadata hash).
- **Dual-Contract Architecture**: We separate Role-Based Access Control from supply chain logic. Only verified, registered manufacturers can mint medicine.
- **Pharmacy Dispensing & Reuse Prevention**: When a registered pharmacy dispenses a medicine to a patient, the item is permanently marked as `SOLD`. If a malicious actor clones that QR code and attempts to sell or scan it again, the system instantly triggers an **"ALREADY DISPENSED"** counterfeit alert, proving the physical item is either a clone or an illegal reuse.
- **Counterfeit Anomaly Detection**: Beyond reuse, the system intercepts cloned QR codes by analyzing real-time scan events (e.g., detecting impossible travel time if the same QR is scanned in two distant locations within 60 minutes).
- **Consumer Verification**: Patients can scan the QR code to instantly read the provenance, verify authenticity on the Stellar ledger, and ensure the medicine hasn't been recalled or previously dispensed.

---

## 🏗️ Architecture & Core Mechanism

### High-Level System Architecture

```mermaid
graph TD
    A[Manufacturer] -->|Mints Batch| B(Core Smart Contract)
    B -->|Cross-Contract Auth| C(Manufacturer RBAC Registry)
    C -.->|Returns Auth Result| B
    B -->|Stores Merkle Root & Emits Event| D[(Stellar Network)]
    E[Logistics / Retailer] -->|Scans QR & Transfers Custody| B
    F[Consumer App] -->|Reads Provenance| D
    G[Next.js App Router] -->|Counterfeit Detection| H[(Prisma Postgres DB)]
```

### Smart Contract Execution Sequence

We implemented a **Dual-Contract Architecture** for extreme security, upgradability, and modularity:

1. **Manufacturer Registry Contract (`medichain-manufacturer`)**
   - **Role:** Handles strict Role-Based Access Control (RBAC).
   - **Storage:** Persists `Admin` and an authorized `Manufacturer(Address)` registry.
   - **Functions:** `init`, `register_manufacturer`, `is_manufacturer`.

2. **Core Supply Chain Contract (`medichain-core`)**
   - **Role:** Handles the actual minting and custody transfers of medicine batches.
   - **Storage:** Persists `Batch` definitions and `Item` custody states.
   - **Inter-Contract Communication:** When a user calls `mint_batch()`, the Core contract dynamically invokes the Manufacturer Registry contract to assert authorization.

**Inter-Contract Communication Flow:**
```mermaid
sequenceDiagram
    participant UI as Next.js Client
    participant Core as Core Contract (CCSV...)
    participant RBAC as Manufacturer Registry (CDSY...)
    
    UI->>Core: invoke mint_batch(caller, merkleRoot)
    Core->>RBAC: invoke is_manufacturer(caller)
    RBAC-->>Core: true
    Core->>Core: Store Batch Data
    Core-->>UI: Success & emit event
```

---

## 🚀 Features & Tech Stack

**Frontend Layer**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **State Management**: Zustand (Global Store) + React Query
- **Wallet Integration**: StellarWalletsKit (Freighter support)

**Blockchain & Backend Layer**
- **Smart Contracts**: Rust (Soroban SDK v25.3.1)
- **Network**: Stellar Testnet
- **Database**: Next.js Server Actions + Prisma + PostgreSQL
---

## ⚙️ Overview: How it works under the hood

To achieve a seamless, Web2-like user experience while maintaining Web3 immutability, MediChain leverages a hybrid architecture:

1. **Next.js Server Actions & Prisma**: 
   - We bypass traditional REST APIs entirely. When a QR code is scanned, Next.js Server Actions (`src/actions/scan.ts`) execute securely on the server.
   - Prisma ORM interfaces with our PostgreSQL database to record every `TRANSIT` and `SALE` event. This allows us to perform complex, rapid calculations (like the "Impossible Travel Time" anomaly algorithm) off-chain without burdening the user with gas fees for every physical scan.
2. **Soroban Smart Contracts (Rust)**:
   - The heavy lifting of **trust** is handled on-chain. The `medichain-core` contract relies on the `medichain-manufacturer` contract via a cross-contract call (`contractimport!`) to assert that the caller's `Address` is whitelisted.
   - Instead of storing massive amounts of supply chain data on the ledger, we construct a **Merkle Tree** of the batch items and only store the `merkle_root` on-chain. This guarantees data integrity while keeping transaction costs negligible.
3. **StellarWalletsKit & RPC Integration**:
   - The frontend uses `StellarWalletsKit` to seamlessly connect to the Freighter extension. When a manufacturer mints a batch, the browser delegates the signing of the XDR payload to the wallet.
   - We poll the Soroban RPC to fetch live ledger events, ensuring the UI reflects the true on-chain state instantly.

---

## 📁 Project Directory Structure

```text
medichain/
├── contracts/                  # Soroban Smart Contracts Workspace
│   ├── medichain-core/         # Contract 1: Core Supply Chain Logic
│   ├── medichain-manufacturer/ # Contract 2: RBAC Registry for Manufacturers
│   ├── Cargo.toml              # Rust Workspace configuration
│   └── deploy.sh               # Bash script for testnet deployment
├── src/                        # Next.js Frontend & Backend Application
│   ├── actions/                # Next.js Server Actions (Off-chain Logic)
│   ├── app/                    # Next.js App Router (Pages & API Routes)
│   ├── components/             # Reusable UI elements (shadcn/ui, layouts)
│   ├── lib/                    # Shared utilities (Prisma singleton, utils)
│   ├── store/                  # Zustand global state (Wallet connections)
│   └── test/                   # Vitest suite for UI & component tests
├── prisma/                     # PostgreSQL Database Schema
├── public/                     # Static assets
├── demo-img/                   # Screenshots for documentation
├── package.json                # NPM Dependencies
└── README.md                   # Project Documentation
```

---

## 🛡️ Contract Addresses & Verifiable Links

The contracts have been successfully deployed and initialized on the Stellar Testnet!

*   **Verifiable Live App**: [https://medichain-sepia.vercel.app/](https://medichain-sepia.vercel.app/)
*   **Manufacturer Contract (RBAC)**: [`CDSYRCSBV724HG35LB7HMR7DR7ZXVTCZ763WSSP7BIPGRQNHAL3LGI53`](https://stellar.expert/explorer/testnet/contract/CDSYRCSBV724HG35LB7HMR7DR7ZXVTCZ763WSSP7BIPGRQNHAL3LGI53)
*   **Core Supply Chain Contract**: [`CCSVYELDMLD53UFQLKAE3JY5P23UKUCYLWYJIKEVHODXOOLVPWWTSOE7`](https://stellar.expert/explorer/testnet/contract/CCSVYELDMLD53UFQLKAE3JY5P23UKUCYLWYJIKEVHODXOOLVPWWTSOE7)
*   **Network**: Stellar Testnet

**Recent Transactions:**
*   **RBAC Initialization**: [7f79a3280b8bbbafa0179e81c8b5effcff121466849a90447df69ec27f5fea52](https://stellar.expert/explorer/testnet/tx/7f79a3280b8bbbafa0179e81c8b5effcff121466849a90447df69ec27f5fea52)
*   **Core Cross-Contract Initialization**: [0cd0178d0d97af9c7a5991e2ada77be3cb9c63eab1ca2b173af8e1ea5a0d875f](https://stellar.expert/explorer/testnet/tx/0cd0178d0d97af9c7a5991e2ada77be3cb9c63eab1ca2b173af8e1ea5a0d875f)
*   **Contract Call (Mint Batch)**: [bb18d4d7a1286b51eb3fa54e5904fcbe65e04dfa8b8cf9311dc05634b3e813f4](https://stellar.expert/explorer/testnet/tx/bb18d4d7a1286b51eb3fa54e5904fcbe65e04dfa8b8cf9311dc05634b3e813f4)

---

## 📸 Platform Previews

### 🌟 Hero & Dashboard
*A sleek, professional dashboard. Connect your Freighter wallet to sign and submit directly to the Stellar network.*
**(✅ Fulfills Level 1 Requirement: Wallet connected state & Balance displayed)**
<div align="center">
  <img src="demo-img/hero-showingconnected-balance-wallet.png" alt="Hero Dashboard" width="800"/>
</div>

### 🧰 Multi-Wallet Support
*Seamlessly connect using your preferred Stellar wallet via StellarWalletsKit.*
**(✅ Fulfills Level 2 Requirement: Screenshot showing wallet options available)**
<div align="center">
  <img src="demo-img/multiwallet-connect.png" alt="Multi Wallet Options" width="800"/>
</div>

### 📜 Batch Registry & QR Generation
*Mint highly-secure medicine batches. The system generates unique, verifiable QR codes for every individual medicine unit.*
**(✅ Fulfills Level 1 Requirement: Successful testnet transaction & Transaction result shown to the user)**
<div align="center">
  <img src="demo-img/batch-registry.png" alt="Batch Registry" width="800"/>
</div>

### 🔍 Consumer QR Scanning & Provenance
*Consumers scan the QR code to instantly read the entire supply chain provenance and verify authenticity via the Stellar ledger.*
<div align="center">
  <img src="demo-img/result-of-a-scanned-qr.png" alt="QR Scan Results" width="800"/>
</div>

### 📱 Fully Mobile Responsive
*The entire application, including complex dashboards, sidebars, and tables, is completely optimized for seamless mobile usage.*
**(✅ Fulfills Level 3 Requirement: Screenshot showing Mobile responsive UI)**
<div align="center">
  <img src="demo-img/mobile-ui-1.png" alt="Mobile View 1" width="300"/>
  <img src="demo-img/mobile-ui-2.png" alt="Mobile View 2" width="300"/>
</div>

### 🌐 Stellar Network Verification (Blockchain Explorer)
*All issuances and activities are instantly verifiable on our bespoke, real-time Blockchain Explorer.*
<div align="center">
  <img src="demo-img/verific-on-stellar-testnet.png" alt="Network Verification" width="800"/>
</div>

### 🧪 Automated Testing Suite
*Comprehensive frontend testing using Vitest ensures platform stability. We rigorously test layouts, dashboards, and logic.*
**(✅ Fulfills Level 3 Requirement: Screenshot showing Test output with 3+ passing tests)**
<div align="center">
  <img src="demo-img/test-1.png" alt="Test Suite" width="400"/>
  <img src="demo-img/test-2.png" alt="Test Results" width="400"/>
</div>

### 🚀 CI/CD Pipeline
*Automated GitHub Actions trigger on every push, performing blazingly fast `cargo binstall` Rust compilation and full frontend validation.*
**(✅ Fulfills Level 3 Requirement: Screenshot showing CI/CD pipeline running)**
<div align="center">
  <img src="demo-img/CI_CD-pipeline.png" alt="CI/CD Pipeline" width="800"/>
</div>

---

## 🔒 Security Considerations

- **Cross-Contract RBAC Validation:** Blockchain logic is immune to local bypass. The Core contract forcibly checks the Registry contract state on every mint.
- **Counterfeit Anomaly Algorithm:** An attacker cloning QRs will trigger the impossibility algorithm (Time/Distance disparity) in our Next.js Server Actions.
- **WASM Upgradability:** The Core contract includes an `upgrade(new_wasm_hash)` function restricted to the Admin, ensuring long-term bug fixes and evolution.
- **Wallet Security**: Uses `StellarWalletsKit` to ensure private keys never touch the DOM or React state. All signing is delegated entirely to the secure Freighter extension.

---

## 💻 Local Development & Setup

### Prerequisites
- Node.js 20+
- Rust Toolchain & Stellar CLI
- PostgreSQL database
- Freighter Wallet browser extension

### Environment Variables
Create a `.env` file at the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/medichain"
```

### Installation
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Running Tests
```bash
# Frontend Tests (Vitest)
npm run test

# Smart Contract Tests
cd contracts
cargo test
```

### Deploying Contracts Manually
If you wish to redeploy to testnet, run our provided bash script:
```bash
cd contracts
chmod +x deploy.sh
./deploy.sh
```
*(Ensure your `stellar keys` are configured and funded by friendbot first!)*
