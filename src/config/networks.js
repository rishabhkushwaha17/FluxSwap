import { defineChain } from "@reown/appkit/networks";


export const ACTIVE_NETWORK = "POLYGON_AMOY"; 

export const NETWORKS = {
    
    POLYGON_MAINNET: defineChain({
        id: 137,
        caipNetworkId: "eip155:137",
        chainNamespace: "eip155",
        name: "Polygon Mainnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["https://polygon-rpc.com"],
            },
        },
        blockExplorers: {
            default: {
                name: "PolygonScan",
                url: "https://polygonscan.com",
            },
        },
        testnet: false,
    }),

    POLYGON_AMOY: defineChain({
        id: 80002,
        caipNetworkId: "eip155:80002",
        chainNamespace: "eip155",
        name: "Polygon Amoy Testnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["https://polygon-amoy.drpc.org"],
            },
        },
        blockExplorers: {
            default: {
                name: "PolygonScan",
                url: "https://amoy.polygonscan.com",
            },
        },
        testnet: true,
    }),
};

export const activeNetwork = NETWORKS[ACTIVE_NETWORK];


if (!activeNetwork) {
    console.error(` Invalid ACTIVE_NETWORK: "${ACTIVE_NETWORK}". Available options:`, Object.keys(NETWORKS).join(", "));
    throw new Error(`Invalid network configuration. Please check ACTIVE_NETWORK in src/config/networks.js`);
}

console.log(` Active Network: ${activeNetwork.name} (Chain ID: ${activeNetwork.id})`);
