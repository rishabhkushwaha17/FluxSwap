import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { getFriendlyErrorMessage, successMessages, warningMessages } from "../utils/errorHandler";

export default function ProvideComponent(props) {
	const [amountOfUSDC, setAmountOfUSDC] = useState("");
	const [amountOfWETH, setAmountOfWETH] = useState("");
	const [error, setError] = useState("");

	const [loading, setLoading] = useState(false);

	const getProvideEstimate = async (token, value) => {
		if (["", "."].includes(value)) return;
		if (props.contract !== null) {
			try {
				let estimate;
				if (token === "USDC") {
					estimate = await props.contract.getEquivalentToken2Estimate(
						ethers.utils.parseUnits(value.toString(), 6)
					);
					setAmountOfWETH(ethers.utils.formatUnits(estimate, 18));
				} else {
					estimate = await props.contract.getEquivalentToken1Estimate(
						ethers.utils.parseUnits(value.toString(), 18)
					);
					setAmountOfUSDC(ethers.utils.formatUnits(estimate, 6));
				}
			} catch (err) {
				console.log("Err: ", err);
				if (err?.data?.message?.includes("Zero Liquidity")) {
					setError(warningMessages.emptyPool);
				}
			}
		}
	};

	const onChangeAmountOfUSDC = (e) => {
		setAmountOfUSDC(e.target.value);
		getProvideEstimate("USDC", e.target.value);
	};

	const onChangeAmountOfWETH = (e) => {
		setAmountOfWETH(e.target.value);
		getProvideEstimate("WETH", e.target.value);
	};

	const provide = async () => {
		if (["", "."].includes(amountOfUSDC) || ["", "."].includes(amountOfWETH)) {
			toast.warning(warningMessages.invalidAmount);
			return;
		}
		if (props.contract === null) {
			toast.warning(warningMessages.connectWallet);
			return;
		} else {
			try {
				setLoading(true);
				const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

				const usdcAmount = ethers.utils.parseUnits(amountOfUSDC.toString(), 6);
				const wethAmount = ethers.utils.parseUnits(amountOfWETH.toString(), 18);

				console.log("Approving USDC...");
				let response = await props.usdcContract.approve(props.contract.address, usdcAmount);
				await response.wait();

				console.log("Approving WETH...");
				response = await props.wethContract.approve(props.contract.address, wethAmount);
				await response.wait();

				console.log("Providing liquidity...");
				response = await props.contract.provide(
					usdcAmount,
					wethAmount,
					deadline
				);
				await response.wait();

				setAmountOfUSDC("");
				setAmountOfWETH("");
				await props.getHoldings();
				toast.success(successMessages.provide);
				setError("");
			} catch (err) {
				console.log("Err::: Provide ", err);
				toast.error(getFriendlyErrorMessage(err));
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="tabBody">
			<BoxTemplate
				leftHeader={"Amount of USDC"}
				value={amountOfUSDC}
				onChange={(e) => onChangeAmountOfUSDC(e)}
			/>
			<div className="swapIcon">
				<MdAdd />
			</div>
			<BoxTemplate
				leftHeader={"Amount of WETH"}
				value={amountOfWETH}
				onChange={(e) => onChangeAmountOfWETH(e)}
			/>
			<div className="error" style={{ display: error ? "block" : "none" }}>{error}</div>
			<div className="bottomDiv">
				<button className="btn" onClick={() => provide()} disabled={loading}>
					{loading ? <div className="spinner"></div> : "Provide"}
				</button>
			</div>
		</div>
	);
}
