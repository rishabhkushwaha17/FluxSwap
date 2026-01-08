import { useState } from "react";
import { MdSwapVert } from "react-icons/md";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { getFriendlyErrorMessage, successMessages, warningMessages } from "../utils/errorHandler";

export default function SwapComponent(props) {
	const [coin, setCoin] = useState(["USDC", "WETH"]);
	const [amountFrom, setAmountFrom] = useState("");
	const [amountTo, setAmountTo] = useState("");
	const [slippageTolerance, setSlippageTolerance] = useState(0.5);
	const tolerance = [0.5, 1, 2, 5];

	const [loading, setLoading] = useState(false);

	const rev = () => {
		setCoin([...coin.reverse()]);
		getSwapEstimateAmountTo(amountFrom);
	};

	const getSwapEstimateAmountTo = async (val) => {
		if (["", "."].includes(val)) return;
		if (props.contract !== null) {
			try {
				let estimateOfAmountTo;
				if (coin[0] === "USDC") {
					estimateOfAmountTo = await props.contract.getSwapToken1Estimate(
						ethers.utils.parseUnits(val.toString(), 6)
					);
					setAmountTo(ethers.utils.formatUnits(estimateOfAmountTo, 18));
				} else {
					estimateOfAmountTo = await props.contract.getSwapToken2Estimate(
						ethers.utils.parseUnits(val.toString(), 18)
					);
					setAmountTo(ethers.utils.formatUnits(estimateOfAmountTo, 6));
				}
			} catch (err) {
				console.error(err?.data?.message || "Failed to get swap estimate");
			}
		}
	};

	const getSwapEstimateAmountFrm = async (val) => {
		if (["", "."].includes(val)) return;
		if (props.contract !== null) {
			try {
				let estimateOfAmountFrm;
				if (coin[0] === "USDC") {
					estimateOfAmountFrm =
						await props.contract.getSwapToken1EstimateGivenToken2(
							ethers.utils.parseUnits(val.toString(), 18)
						);
					setAmountFrom(ethers.utils.formatUnits(estimateOfAmountFrm, 6));
				} else {
					estimateOfAmountFrm =
						await props.contract.getSwapToken2EstimateGivenToken1(
							ethers.utils.parseUnits(val.toString(), 6)
						);
					setAmountFrom(ethers.utils.formatUnits(estimateOfAmountFrm, 18));
				}
			} catch (err) {
				console.error(err?.data?.message || "Failed to get swap estimate");
			}
		}
	};

	const onChangeAmtFrm = (val) => {
		setAmountFrom(val.target.value);
		getSwapEstimateAmountTo(val.target.value);
	};

	const onChangeAmtTo = (val) => {
		setAmountTo(val.target.value);
		getSwapEstimateAmountFrm(val.target.value);
	};

	const onChangeTolerance = (val) => {
		if (val !== slippageTolerance) {
			setSlippageTolerance(val);
		}
	};

	const onSwap = async () => {
		if (["", "."].includes(amountFrom)) {
			toast.warning(warningMessages.invalidAmount);
			return;
		}
		if (props.contract === null) {
			toast.warning(warningMessages.connectWallet);
			return;
		} else {
			try {
				setLoading(true);
				const minAmountOut = (amountTo * (100 - slippageTolerance)) / 100;
				const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

				if (coin[0] === "USDC") {
					const amountIn = ethers.utils.parseUnits(amountFrom.toString(), 6);
					const minOut = ethers.utils.parseUnits(minAmountOut.toFixed(18), 18);
					console.log("Approving USDC...", props.usdcContract);
					let response = await props.usdcContract.approve(props.contract.address, amountIn);
					await response.wait();

					console.log("Swapping USDC for WETH...");
					response = await props.contract.swapToken1(
						amountIn,
						minOut,
						deadline
					);
					await response.wait();
				} else {
					const amountIn = ethers.utils.parseUnits(amountFrom.toString(), 18);
					const minOut = ethers.utils.parseUnits(minAmountOut.toFixed(6), 6);

					console.log("Approving WETH...");
					let response = await props.wethContract.approve(props.contract.address, amountIn);
					await response.wait();

					console.log("Swapping WETH for USDC...");
					response = await props.contract.swapToken2(
						amountIn,
						minOut,
						deadline
					);
					await response.wait();
				}
				setAmountFrom("");
				setAmountTo("");
				await props.getHoldings();
				toast.success(successMessages.swap);
			} catch (err) {
				console.log("Swap failed", err);
				toast.error(getFriendlyErrorMessage(err));
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="tabBody">
			<BoxTemplate
				leftHeader={"From"}
				right={coin[0]}
				value={amountFrom}
				onChange={(e) => onChangeAmtFrm(e)}
				showBalance={true}
				balance={Number(coin[0] === "USDC" ? props.usdcBalance : props.wethBalance).toFixed(6)}
			/>
			<div className="swapIcon" onClick={() => rev()}>
				<MdSwapVert />
			</div>
			<BoxTemplate
				leftHeader={"To"}
				right={coin[1]}
				value={amountTo}
				onChange={(e) => onChangeAmtTo(e)}
				showBalance={true}
				balance={Number(coin[1] === "USDC" ? props.usdcBalance : props.wethBalance).toFixed(6)}
			/>

			<div className="selectTolerance">
				<div className="toleranceHeading">SLIPPAGE TOLERANCE</div>
				<div className="toleranceValues">
					{tolerance.map((val) => {
						return (
							<div
								key={val}
								className={
									"toleranceCard " +
									(slippageTolerance === val ? "selectedTolerance" : "")
								}
								onClick={() => onChangeTolerance(val)}
							>
								{val + "%"}
							</div>
						);
					})}
				</div>
			</div>

			<div className="transactionFee">
				TRADING FEE ({props.feeRate}%):{" "}
				<b>
					{(props.feeRate / 100) * amountFrom} {coin[0]}
				</b>
			</div>
			<div className="transactionFee">
				MINIMUM {coin[1]} YOU RECEIVE:{" "}
				<b>{(amountTo * (100 - slippageTolerance)) / 100}</b>
			</div>

			<div className="bottomDiv">
				<button className="btn" onClick={() => onSwap()} disabled={loading}>
					{loading ? <div className="spinner"></div> : "Swap"}
				</button>
			</div>
		</div>
	);
}
