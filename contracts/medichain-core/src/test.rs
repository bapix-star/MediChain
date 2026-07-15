#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

mod manufacturer_contract_tests {
    soroban_sdk::contractimport!(
        file = "../target/wasm32v1-none/release/medichain_manufacturer.wasm"
    );
}

#[test]
fn test_core_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy manufacturer contract
    let manufacturer_contract_id = env.register_contract_wasm(None, manufacturer_contract_tests::WASM);
    let manufacturer_client = manufacturer_contract_tests::Client::new(&env, &manufacturer_contract_id);
    
    let admin = Address::generate(&env);
    let manufacturer = Address::generate(&env);
    
    manufacturer_client.init(&admin);
    manufacturer_client.register_manufacturer(&manufacturer);

    // Deploy core contract
    let core_contract_id = env.register_contract(None, MediChainCore);
    let core_client = MediChainCoreClient::new(&env, &core_contract_id);

    let distributor = Address::generate(&env);

    core_client.init(&admin, &manufacturer_contract_id);

    let batch_id = String::from_str(&env, "BATCH-123");
    let merkle_root = String::from_str(&env, "0xabc123");
    let metadata_hash = String::from_str(&env, "0xdef456");

    core_client.mint_batch(&manufacturer, &batch_id, &merkle_root, &metadata_hash, &1721000000);

    let item_id = String::from_str(&env, "ITEM-123-1");
    core_client.init_item(&manufacturer, &item_id, &batch_id);

    core_client.transfer_custody(
        &manufacturer,
        &item_id,
        &distributor,
        &String::from_str(&env, "In Transit"),
    );
}

#[test]
#[should_panic(expected = "Caller is not an authorized manufacturer")]
fn test_unauthorized_mint() {
    let env = Env::default();
    env.mock_all_auths();

    // Deploy manufacturer contract
    let manufacturer_contract_id = env.register_contract_wasm(None, manufacturer_contract_tests::WASM);
    let manufacturer_client = manufacturer_contract_tests::Client::new(&env, &manufacturer_contract_id);
    
    let admin = Address::generate(&env);
    let fake_manufacturer = Address::generate(&env);
    
    manufacturer_client.init(&admin);
    // Did not register fake_manufacturer

    // Deploy core contract
    let core_contract_id = env.register_contract(None, MediChainCore);
    let core_client = MediChainCoreClient::new(&env, &core_contract_id);

    core_client.init(&admin, &manufacturer_contract_id);

    let batch_id = String::from_str(&env, "BATCH-999");
    let merkle_root = String::from_str(&env, "0x000");
    let metadata_hash = String::from_str(&env, "0x000");

    core_client.mint_batch(&fake_manufacturer, &batch_id, &merkle_root, &metadata_hash, &1721000000);
}
