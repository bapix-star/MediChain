# MediChain

**"Every medicine has a digital passport."**

Enterprise-grade supply chain authenticity and counterfeit anomaly detection built on the Stellar network using Soroban Smart Contracts.

## 🌟 Product Overview & Problem Statement

**The Problem:** The global pharmaceutical supply chain is plagued by counterfeit medicines, costing billions and endangering lives. Traditional QR codes can be cloned by malicious actors (e.g., printing the same QR on 1,000 fake packages). 

**The Solution:** MediChain introduces a **Digital Product Passport (DPP)**. Every medicine batch is cryptographically secured on the Stellar blockchain. We use a dual smart-contract architecture to separate Role-Based Access Control from supply chain logic. If a malicious actor clones a QR code, our **Counterfeit Anomaly Detection Algorithm** intercepts it by analyzing scan events (e.g., "Impossible travel time: Medicine scanned in Kolkata and Mumbai within 60 minutes").

---

## 🏗 Architecture Diagram

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

---

## 📜 Smart Contract Design

We implemented a **Dual-Contract Architecture** for security, upgradability, and modularity:

1. **Manufacturer Registry Contract (`medichain-manufacturer`)**
   - **Role:** Handles strict Role-Based Access Control (RBAC).
   - **Storage:** Persists `Admin` and an authorized `Manufacturer(Address)` registry.
   - **Functions:** `init`, `register_manufacturer`, `is_manufacturer`.

2. **Core Supply Chain Contract (`medichain-core`)**
   - **Role:** Handles the actual minting and custody transfers of medicine batches.
   - **Storage:** Persists `Batch` definitions and `Item` custody states.
   - **Inter-Contract Communication:** When a user calls `mint_batch()`, the Core contract dynamically invokes the Manufacturer Registry contract to assert authorization.

### Inter-Contract Communication Flow
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

## ✨ Features & Tech Stack

- **Smart Contracts:** Rust, Soroban SDK v25.3.1
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui (Geist, Framer Motion)
- **State Management:** Zustand, React Query
- **Wallet Integration:** StellarWalletsKit (Freighter)
- **Backend/DB:** Next.js Server Actions, Prisma, PostgresSQL
- **Testing:** Vitest (Frontend), Cargo Test (Contracts)
- **CI/CD:** GitHub Actions

---

## 🚀 Live Testnet Deployment

The contracts have been successfully deployed and initialized on the Stellar Testnet!

- **Manufacturer Contract (RBAC):** `CDSYRCSBV724HG35LB7HMR7DR7ZXVTCZ763WSSP7BIPGRQNHAL3LGI53`
- **Core Contract:** `CCSVYELDMLD53UFQLKAE3JY5P23UKUCYLWYJIKEVHODXOOLVPWWTSOE7`

**Recent Transactions:**
- RBAC Initialization: [7f79a3280b8bbbafa0179e81c8b5effcff121466849a90447df69ec27f5fea52](https://stellar.expert/explorer/testnet/tx/7f79a3280b8bbbafa0179e81c8b5effcff121466849a90447df69ec27f5fea52)
- Core Cross-Contract Initialization: [0cd0178d0d97af9c7a5991e2ada77be3cb9c63eab1ca2b173af8e1ea5a0d875f](https://stellar.expert/explorer/testnet/tx/0cd0178d0d97af9c7a5991e2ada77be3cb9c63eab1ca2b173af8e1ea5a0d875f)
- **Contract Call (Mint Batch)**: [bb18d4d7a1286b51eb3fa54e5904fcbe65e04dfa8b8cf9311dc05634b3e813f4](https://stellar.expert/explorer/testnet/tx/bb18d4d7a1286b51eb3fa54e5904fcbe65e04dfa8b8cf9311dc05634b3e813f4)

---

## 🔒 Security Considerations

- **Cross-Contract RBAC Validation:** Blockchain logic is immune to local bypass. The Core contract forcibly checks the Registry contract state on every mint.
- **Counterfeit Anomaly Algorithm:** An attacker cloning QRs will trigger the impossibility algorithm (Time/Distance disparity) in our Next.js Server Actions.
- **WASM Upgradability:** The Core contract includes an `upgrade(new_wasm_hash)` function restricted to the Admin, ensuring long-term bug fixes.

---

## 🛠 Local Dev & Environment Variables

### 1. Prerequisites
- Node.js 20+
- Rust Toolchain & Stellar CLI
- PostgreSQL database

### 2. Environment Setup
Create a `.env` file at the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/medichain"
```

### 3. Installation
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Testing
- **Frontend Tests:** `npm run test` (or `npx vitest run`)
- **Contract Tests:** `cd contracts && cargo test`

---

## 🔄 CI/CD & Deployment Steps

We use GitHub Actions to automate our deployments (`.github/workflows/ci.yml`).
On every push to `main`:
1. It validates the Next.js build.
2. It runs the Vitest frontend test suite.
3. It compiles the Rust/Soroban contracts to ensure wasm integrity.

### Deploying to Vercel
1. Create a PostgreSQL database (e.g., using Vercel Postgres, Neon, or Supabase).
2. Connect your GitHub repository to Vercel.
3. Set the `DATABASE_URL` environment variable in the Vercel dashboard.
4. Set the Build Command in Vercel to: `npx prisma generate && npx prisma db push && next build`
5. Deploy!

### Deploying Contracts Manually
If you wish to redeploy to testnet, run our provided bash script:
```bash
cd contracts
chmod +x deploy.sh
./deploy.sh
```
*(Ensure your `stellar keys` are configured and funded by friendbot first!)*

---

## 📸 Screenshots & Demo

### 1. Manufacturer Dashboard
*(Insert screenshot of `/manufacturer` UI here)*

### 2. Logistics & Scanning (Counterfeit Alert)
*(Insert screenshot of `/logistics` with the red alert triggered here)*

### 3. Digital Product Passport
*(Insert screenshot of `/item/123` showing the blockchain hash and history here)*

**Live Demo Link:** [Insert Vercel Link Here]
**Video Demo:** [Insert YouTube Link Here]
