#!/bin/bash

# Ensure script stops on first error
set -e

echo "==========================================="
echo "MediChain: Smart Contract Deployment Script"
echo "==========================================="

echo "1. Building contracts..."
stellar contract build

echo "2. Generating testnet identity if it doesn't exist..."
if ! stellar keys ls | grep -q "MEDICHAIN_ADMIN"; then
  stellar keys generate MEDICHAIN_ADMIN --network testnet
  echo "New identity 'MEDICHAIN_ADMIN' created."
  # Friendbot funding logic could go here, but assumed done manually or via GUI
else
  echo "Identity 'MEDICHAIN_ADMIN' already exists."
fi

ADMIN_ADDRESS=$(stellar keys address MEDICHAIN_ADMIN)
echo "Admin Address: $ADMIN_ADDRESS"

echo "3. Deploying Manufacturer Registry (RBAC)..."
MANUFACTURER_ADDRESS=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/medichain_manufacturer.wasm \
  --source MEDICHAIN_ADMIN \
  --network testnet)
echo "✅ Manufacturer Contract Deployed at: $MANUFACTURER_ADDRESS"

echo "4. Deploying Core Contract..."
CORE_ADDRESS=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/medichain_core.wasm \
  --source MEDICHAIN_ADMIN \
  --network testnet)
echo "✅ Core Contract Deployed at: $CORE_ADDRESS"

echo "5. Initializing Contracts..."
# Initialize Manufacturer Contract
stellar contract invoke \
  --id $MANUFACTURER_ADDRESS \
  --source MEDICHAIN_ADMIN \
  --network testnet \
  -- init --admin $ADMIN_ADDRESS
echo "✅ Manufacturer Contract initialized."

# Initialize Core Contract
stellar contract invoke \
  --id $CORE_ADDRESS \
  --source MEDICHAIN_ADMIN \
  --network testnet \
  -- init --admin $ADMIN_ADDRESS --manufacturer_contract $MANUFACTURER_ADDRESS
echo "✅ Core Contract initialized and wired to Manufacturer Contract."

echo "==========================================="
echo "Deployment Complete!"
echo "Manufacturer Contract: $MANUFACTURER_ADDRESS"
echo "Core Contract: $CORE_ADDRESS"
echo "==========================================="
