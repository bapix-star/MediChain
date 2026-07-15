#!/bin/bash

# Reset all staged files to ensure a clean slate
git reset

# Helper function to add and commit
commit_file() {
    file_path="$1"
    commit_msg="$2"
    if [ -e "$file_path" ] || ls $file_path 1> /dev/null 2>&1; then
        git add "$file_path"
        git commit -m "$commit_msg"
    fi
}

commit_file "package.json package-lock.json" "chore: setup project dependencies"
commit_file ".gitignore" "chore: configure gitignore for Next.js and Rust"
commit_file "README.md" "docs: add initial project README and documentation"
commit_file "prisma/schema.prisma" "feat: initialize Prisma schema for PostgreSQL models"
commit_file "src/lib/prisma.ts" "feat: add Prisma client singleton instance"
commit_file "tailwind.config.ts" "chore: configure Tailwind CSS with custom tokens"
commit_file "postcss.config.mjs" "chore: add PostCSS configuration"
commit_file "components.json" "chore: add shadcn ui components configuration"
commit_file "src/app/globals.css" "style: add global CSS with custom design tokens"
commit_file "src/lib/utils.ts" "utils: add class merge utility for components"
commit_file "src/components/ui/button.tsx" "ui: add reusable Button component"
commit_file "src/components/ui/card.tsx" "ui: add reusable Card component"
commit_file "src/components/ui/input.tsx" "ui: add reusable Input component"
commit_file "src/components/ui/sonner.tsx" "ui: add Sonner toast notification provider"
commit_file "src/components/Logo.tsx" "components: add MediChain Logo component"
commit_file "src/components/WalletConnect.tsx" "components: implement Freighter wallet connection integration"
commit_file "src/store/useWalletStore.ts" "store: add Zustand store for global wallet state"
commit_file "src/components/providers.tsx" "components: add global app providers for context"
commit_file "src/app/layout.tsx" "feat: setup root layout component with custom fonts"
commit_file "src/components/layout/AppShell.tsx" "feat: implement main application shell and navigation"
commit_file "public/hero-video.mp4" "assets: add hero background video"
commit_file "src/app/page.tsx" "feat: implement home page dashboard and metrics"
commit_file "src/app/manufacturer/page.tsx" "feat: add manufacturer registry portal for minting"
commit_file "src/app/logistics/page.tsx" "feat: implement logistics scanner and transit interface"
commit_file "src/app/explorer/page.tsx" "feat: create explorer dashboard for global batch search"
commit_file "src/app/batch/[batchNumber]/BatchDetailClient.tsx" "feat: add client view for batch details"
commit_file "src/app/batch/[batchNumber]/page.tsx" "feat: implement server-side batch tracking page"
commit_file "src/components/DnaStrand.tsx" "components: add 3D DNA strand visualizer for item authenticity"
commit_file "src/components/PassportVisualizer.tsx" "components: add 3D digital passport visualizer"
commit_file "src/app/item/[id]/page.tsx" "feat: implement digital product passport public view"
commit_file "src/actions/batch.ts" "server: implement batch creation server action"
commit_file "src/actions/scan.ts" "server: implement counterfeit detection scan logic"
commit_file "contracts/Cargo.toml" "contracts: setup Soroban workspace"
commit_file "contracts/Cargo.lock" "contracts: lock Soroban dependencies"
commit_file "contracts/medichain-manufacturer/Cargo.toml" "contracts: add manufacturer contract manifest"
commit_file "contracts/medichain-manufacturer/src/lib.rs" "contracts: implement RBAC registry in manufacturer contract"
commit_file "contracts/medichain-manufacturer/src/test.rs" "contracts: add manufacturer contract test suite"
commit_file "contracts/medichain-core/Cargo.toml" "contracts: add core supply chain contract manifest"
commit_file "contracts/medichain-core/src/lib.rs" "contracts: implement supply chain core logic with cross-contract calls"
commit_file "contracts/medichain-core/src/test.rs" "contracts: add core contract test suite and coverage"
commit_file "contracts/deploy.sh" "scripts: add bash script for testnet deployment"
commit_file "vitest.config.ts" "test: configure Vitest for React component testing"
commit_file "src/test/setup.ts" "test: add global test setup and three.js mocks"
commit_file "src/test/Home.test.tsx" "test: add unit tests for home dashboard components"
commit_file "src/test/Manufacturer.test.tsx" "test: add unit tests for manufacturer portal interactions"
commit_file "src/test/Logistics.test.tsx" "test: add unit tests for logistics scanner validation"
commit_file "src/test/App.integration.test.tsx" "test: add frontend integration test suite for user flows"
commit_file ".github/workflows/ci.yml" "ci: setup GitHub actions for continuous integration"
commit_file ".env.example" "chore: add environment variables template for deployments"
commit_file "demo-img/" "docs: add demo images to repository"

# Finally, add everything else left over and commit
git add .
git commit -m "chore: final touches, formatting, and remaining setup files"

