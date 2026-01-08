import { ACTIVE_NETWORK } from "./networks";
import { AMM_V1_ABI, ERC20_ABI, USDC_ABI, WETH_ABI } from "./abis";


export const CONTRACTS = {

    POLYGON_MAINNET: {
        address: "0x0000000000000000000000000000000000000000", // TODO: Deploy and add address
        abi: AMM_V1_ABI,
        name: "AMM Contract",
        version: "v1",
        description: "Polygon Mainnet AMM Contract",
        usdc: { address: "0x0000000000000000000000000000000000000000", abi: ERC20_ABI },
        weth: { address: "0x0000000000000000000000000000000000000000", abi: ERC20_ABI },
    },

    POLYGON_AMOY: {
        address: "0xFB22B3EaD4f31221AB69dffbb9C5da6A569F449e", // Currently deployed contract
        abi: AMM_V1_ABI,
        name: "AMM Contract",
        version: "v1",
        description: "Polygon Amoy Testnet AMM Contract",
        usdc: { address: "0x8B0180f2101c8260d49339abfEe87927412494B4", abi: USDC_ABI },
        weth: { address: "0x52eF3d68BaB452a294342DC3e5f464d7f610f72E", abi: WETH_ABI },
    },

};


export const activeContract = CONTRACTS[ACTIVE_NETWORK];

if (!activeContract) {
    console.error(`No contract configured for network: "${ACTIVE_NETWORK}". Available options:`, Object.keys(CONTRACTS).join(", "));
    throw new Error(`No contract configuration found for ${ACTIVE_NETWORK}. Please add it to src/config/contracts.js`);
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
if (activeContract.address === ZERO_ADDRESS) {
    console.warn(`Contract address for ${ACTIVE_NETWORK} is not set! Please deploy a contract and update the address in src/config/contracts.js`);
}

if (!activeContract.abi || activeContract.abi.length === 0) {
    console.error(`ABI not configured for ${ACTIVE_NETWORK}!`);
    throw new Error(`No ABI found for ${ACTIVE_NETWORK}. Please add it to src/config/abis.js and reference it in contracts.js`);
}
console.log("activeContract ::", activeContract);
console.log("activeContract.abi ::", activeContract.abi);

export const CONTRACT_ADDRESS = activeContract.address;
export const CONTRACT_ABI = activeContract.abi;
export const USDC_CONFIG = activeContract.usdc;
export const WETH_CONFIG = activeContract.weth;

console.log(`Active Contract: ${activeContract.name} (${activeContract.version})`);
console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
console.log(`Description: ${activeContract.description}`);
console.log(`ABI Functions: ${CONTRACT_ABI.length}`);
