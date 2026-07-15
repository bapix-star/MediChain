#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, BytesN};

mod manufacturer_contract {
    soroban_sdk::contractimport!(
        file = "../target/wasm32v1-none/release/medichain_manufacturer.wasm"
    );
}

#[contracttype]
pub enum DataKey {
    Admin,
    ManufacturerContract,
    Batch(String),
    Item(String),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchData {
    pub manufacturer: Address,
    pub merkle_root: String,
    pub metadata_hash: String,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ItemData {
    pub batch_id: String,
    pub current_owner: Address,
    pub status: String,
}

#[contract]
pub struct MediChainCore;

#[contractimpl]
impl MediChainCore {
    /// Initialize the contract with an admin and the manufacturer contract ID.
    pub fn init(env: Env, admin: Address, manufacturer_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::ManufacturerContract, &manufacturer_contract);
    }

    /// Mint a new batch. Caller must be an authorized manufacturer (inter-contract call)
    pub fn mint_batch(
        env: Env,
        caller: Address,
        batch_id: String,
        merkle_root: String,
        metadata_hash: String,
        timestamp: u64,
    ) {
        caller.require_auth();
        
        let manufacturer_id: Address = env.storage().instance().get(&DataKey::ManufacturerContract).expect("Not initialized");
        let manufacturer_client = manufacturer_contract::Client::new(&env, &manufacturer_id);
        
        let is_authorized = manufacturer_client.is_manufacturer(&caller);
        if !is_authorized {
            panic!("Caller is not an authorized manufacturer");
        }

        let batch_key = DataKey::Batch(batch_id.clone());
        if env.storage().persistent().has(&batch_key) {
            panic!("Batch already exists");
        }

        let batch_data = BatchData {
            manufacturer: caller.clone(),
            merkle_root: merkle_root.clone(),
            metadata_hash: metadata_hash.clone(),
            timestamp,
        };

        env.storage().persistent().set(&batch_key, &batch_data);
        
        env.events().publish(
            (symbol_short!("mint"), batch_id.clone()),
            (caller, merkle_root),
        );
    }

    /// Transfer custody of an item from one party to another
    pub fn transfer_custody(env: Env, caller: Address, item_id: String, new_owner: Address, status: String) {
        caller.require_auth();

        let item_key = DataKey::Item(item_id.clone());
        
        let mut item = if let Some(existing_item) = env.storage().persistent().get::<_, ItemData>(&item_key) {
            if existing_item.current_owner != caller {
                panic!("Caller is not the current owner");
            }
            existing_item
        } else {
            panic!("Item does not exist. Must be initialized first.");
        };

        item.current_owner = new_owner.clone();
        item.status = status.clone();

        env.storage().persistent().set(&item_key, &item);

        env.events().publish(
            (symbol_short!("transfer"), item_id),
            (caller, new_owner, status),
        );
    }
    
    pub fn init_item(env: Env, caller: Address, item_id: String, batch_id: String) {
        caller.require_auth();
        let batch_key = DataKey::Batch(batch_id.clone());
        let batch: BatchData = env.storage().persistent().get(&batch_key).expect("Batch not found");
        
        if batch.manufacturer != caller {
            panic!("Only manufacturer can init item");
        }
        
        let item_key = DataKey::Item(item_id.clone());
        if env.storage().persistent().has(&item_key) {
            panic!("Item already initialized");
        }
        
        let item = ItemData {
            batch_id,
            current_owner: caller.clone(),
            status: String::from_str(&env, "Manufactured"),
        };
        
        env.storage().persistent().set(&item_key, &item);
    }

    /// Upgrade the contract
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

mod test;
