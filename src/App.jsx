import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
    useAppKit,
    useAppKitAccount,
    useAppKitProvider,
} from "@reown/appkit/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { wagmiAdapter } from "./config/reown";
import { abi, CONTRACT_ADDRESS, USDC_CONFIG, WETH_CONFIG } from "./constants";
import ContainerComponent from "./components/ContainerComponent";
import "./styles.css";

// Create a query client for React Query
const queryClient = new QueryClient();

function AppContent() {
    const [myContract, setMyContract] = useState(null);
    const [myUSDC, setMyUSDC] = useState(null);
    const [myWETH, setMyWETH] = useState(null);
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider("eip155");
    const { open } = useAppKit();

    // Setup contract when wallet is connected
    useEffect(() => {
        async function setupContract() {
            if (isConnected && walletProvider) {
                try {
                    const provider = new ethers.providers.Web3Provider(walletProvider);
                    const network = await provider.getNetwork();
                    console.log("Connected Network:", network.name, "Chain ID:", network.chainId);
                    console.log("Contract Address:", CONTRACT_ADDRESS);
                    console.log("Expected Network: Polygon Amoy (Chain ID: 80002)");

                    if (network.chainId !== 80002) {
                        console.warn("WRONG NETWORK! Please switch to Polygon Amoy Testnet (Chain ID: 80002)");
                    }

                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
                    const usdc = new ethers.Contract(USDC_CONFIG.address, USDC_CONFIG.abi, signer);
                    const weth = new ethers.Contract(WETH_CONFIG.address, WETH_CONFIG.abi, signer);
                    console.log("USDC Contract :: ", usdc);
                    console.log("WETH Contract :: ", weth);
                    setMyContract(contract);
                    setMyUSDC(usdc);
                    setMyWETH(weth);
                    console.log("Contract connected successfully");
                } catch (err) {
                    console.log("Error setting up contract:", err);
                    toast.error("Unable to connect to the smart contract. Please check your network connection.");
                }
            } else {
                setMyContract(null);
            }
        }
        setupContract();
    }, [isConnected, walletProvider]);


    // Handle button click - open AppKit modal for both connect and account management
    const handleButtonClick = () => {
        open();
    };

    return (
        <div className="pageBody">
            <div className="navBar">
                <div className="navLogoContainer">
                    <img src="/logo.png" className="appLogo" alt="FluxSwap Logo" />
                </div>
                {isConnected ? (
                    <button 
                        className="connected" 
                        onClick={handleButtonClick}
                        type="button"
                    >
                        {"Connected to " + address?.slice(0, 6) + "..." + address?.slice(-4)}
                    </button>
                ) : (
                    <button 
                        className="connectBtn" 
                        onClick={handleButtonClick}
                        type="button"
                    >
                        Connect Wallet
                    </button>
                )}
            </div>
            <ContainerComponent
                contract={myContract}
                usdcContract={myUSDC}
                wethContract={myWETH}
            />
        </div >
    );
}

export default function App() {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <AppContent />
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </QueryClientProvider>
        </WagmiProvider>
    );
}
