#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
pub enum DataKey {
    Admin,
    Manufacturer(Address),
}

#[contract]
pub struct ManufacturerRegistry;

#[contractimpl]
impl ManufacturerRegistry {
    /// Initialize the contract with an admin.
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Register a manufacturer. Only admin can do this.
    pub fn register_manufacturer(env: Env, manufacturer: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).expect("Not initialized");
        admin.require_auth();
        env.storage().persistent().set(&DataKey::Manufacturer(manufacturer), &true);
    }

    /// Check if an address is a registered manufacturer.
    pub fn is_manufacturer(env: Env, manufacturer: Address) -> bool {
        env.storage().persistent().has(&DataKey::Manufacturer(manufacturer))
    }
}

mod test;
