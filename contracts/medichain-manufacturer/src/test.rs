#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_manufacturer_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ManufacturerRegistry);
    let client = ManufacturerRegistryClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let manufacturer = Address::generate(&env);

    client.init(&admin);

    assert_eq!(client.is_manufacturer(&manufacturer), false);
    
    client.register_manufacturer(&manufacturer);
    
    assert_eq!(client.is_manufacturer(&manufacturer), true);
}
