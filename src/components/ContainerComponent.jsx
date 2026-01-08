import { useEffect, useState, useCallback } from "react";
import "../styles.css";
import SwapComponent from "./SwapComponent";
import ProvideComponent from "./ProvideComponent";
import WithdrawComponent from "./WithdrawComponent";
import {
	useAppKitAccount,
} from "@reown/appkit/react";
// FaucetComponent is commented out - uncomment if needed
// import FaucetComponent from "./FaucetComponent";
import { FEE_RATE_PRECISION } from "../constants";
import { ethers } from "ethers";


export default function ContainerComponent(props) {
	const { address } = useAppKitAccount();
	const [activeTab, setActiveTab] = useState("Swap");
	const [amountOfUSDC, setAmountOfUSDC] = useState(0);
	const [amountOfWETH, setAmountOfWETH] = useState(0);
	const [amountOfShare, setAmountOfShare] = useState(0);
	const [totalUSDC, setTotalUSDC] = useState(0);
	const [totalWETH, setTotalWETH] = useState(0);
	const [totalShare, setTotalShare] = useState(0);
	const [feeRate, setFeeRate] = useState(0);

	const getHoldings = useCallback(async () => {
		try {
			if (!props.contract) {
				console.log("Contract not connected yet");
				return;
			}
			console.log("Fetching holdings----");

			try {
				let usdcBalance = await props.usdcContract.balanceOf(address);
				console.log("usdcBalance :: ", ethers.utils.formatUnits(usdcBalance, 6));
				let wethBalance = await props.wethContract.balanceOf(address);
				console.log("wethBalance :: ", ethers.utils.formatUnits(wethBalance, 18));
				let myShare = await props.contract.balanceOf(address);
				console.log("myShare :: ", ethers.utils.formatUnits(myShare, 6));
				setAmountOfUSDC(ethers.utils.formatUnits(usdcBalance, 6));
				setAmountOfWETH(ethers.utils.formatUnits(wethBalance, 18));
				setAmountOfShare(ethers.utils.formatUnits(myShare, 6));
			} catch (e) {
				console.log("getMyHoldings not supported by this contract version");
			}


			let response = await props.contract.getPoolDetails();
			console.log("response", response);
			setTotalUSDC(ethers.utils.formatUnits(response[0], 6));
			setTotalWETH(ethers.utils.formatUnits(response[1], 18));
			setTotalShare(ethers.utils.formatUnits(response[2], 6));
			setFeeRate(response[3] / FEE_RATE_PRECISION);
		} catch (err) {
			console.log("Couldn't Fetch holdings", err);
		}
	}, [props.contract, address, props.usdcContract, props.wethContract]);

	useEffect(() => {
		if (props.contract) {
			getHoldings();
		}
	}, [props.contract, getHoldings]);

	const changeTab = (tab) => {
		setActiveTab(tab);
	};

	return (
		<div className="centerBody">
			<div className="centerContainer">
				<div className="selectTab">
					<div
						className={"tabStyle " + (activeTab === "Swap" ? "activeTab" : "")}
						onClick={() => changeTab("Swap")}
					>
						Swap
					</div>
					<div
						className={
							"tabStyle " + (activeTab === "Provide" ? "activeTab" : "")
						}
						onClick={() => changeTab("Provide")}
					>
						Provide
					</div>
					<div
						className={
							"tabStyle " + (activeTab === "Withdraw" ? "activeTab" : "")
						}
						onClick={() => changeTab("Withdraw")}
					>
						Withdraw
					</div>
				</div>

				{activeTab === "Swap" && (
					<SwapComponent
						contract={props.contract}
						getHoldings={() => getHoldings()}
						feeRate={feeRate}
						usdcBalance={amountOfUSDC}
						wethBalance={amountOfWETH}
						usdcContract={props.usdcContract}
						wethContract={props.wethContract}
					/>
				)}
				{activeTab === "Provide" && (
					<ProvideComponent
						contract={props.contract}
						usdcContract={props.usdcContract}
						wethContract={props.wethContract}
						getHoldings={() => getHoldings()}
					/>
				)}
				{activeTab === "Withdraw" && (
					<WithdrawComponent
						contract={props.contract}
						maxShare={amountOfShare}
						getHoldings={() => getHoldings()}
						usdcContract={props.usdcContract}
						wethContract={props.wethContract}
					/>
				)}
			</div>
			<div className="details">
				<div className="detailsBody">
					<div className="detailsHeader">Details</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Amount of USDC:</div>
						<div className="detailsValue">{Number(amountOfUSDC).toFixed(6)}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Amount of WETH:</div>
						<div className="detailsValue">{Number(amountOfWETH).toFixed(6)}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Your Share:</div>
						<div className="detailsValue">{Number(amountOfShare).toFixed(6)}</div>
					</div>
					<div className="detailsHeader">Pool Details</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Total USDC:</div>
						<div className="detailsValue">{Number(totalUSDC).toFixed(6)}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Total WETH:</div>
						<div className="detailsValue">{Number(totalWETH).toFixed(6)}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Total Shares:</div>
						<div className="detailsValue">{Number(totalShare).toFixed(6)}</div>
					</div>
					<div className="detailsRow">
						<div className="detailsAttribute">Fee Rate:</div>
						<div className="detailsValue">{Number(feeRate).toFixed(6)}%</div>
					</div>
				</div>
			</div>
		</div>
	);
}
