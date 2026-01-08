/**
 * =============================================================================
 * CONSTANTS FILE
 * =============================================================================
 * 
 * This file contains app constants and re-exports contract configuration.
 * CONTRACT_ADDRESS and ABI are now imported from config/contracts.js for dynamic switching.
 * 
 * To change the contract address or ABI for a specific network:
 *   - Edit the CONTRACTS object in src/config/contracts.js
 *   - Add new ABIs in src/config/abis.js
 * 
 * =============================================================================
 */

// Import contract address and ABI from dynamic config
import { CONTRACT_ADDRESS as DYNAMIC_CONTRACT_ADDRESS, CONTRACT_ABI, USDC_CONFIG as DYNAMIC_USDC_CONFIG, WETH_CONFIG as DYNAMIC_WETH_CONFIG } from "./config/contracts";

// App constants
export const PRECISION = 1000000;
export const FEE_RATE_PRECISION = 10000;
export const RE = /^[0-9]*[.]?[0-9]{0,6}$/;

// Re-export the dynamically configured contract address and ABI
export const CONTRACT_ADDRESS = DYNAMIC_CONTRACT_ADDRESS;
export const abi = CONTRACT_ABI;
export const USDC_CONFIG = DYNAMIC_USDC_CONFIG;
export const WETH_CONFIG = DYNAMIC_WETH_CONFIG;
