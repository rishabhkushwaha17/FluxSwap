import { useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { getFriendlyErrorMessage, successMessages, warningMessages } from "../utils/errorHandler";

export default function WithdrawComponent(props) {
	const [amountOfShare, setAmountOfShare] = useState("");
	const [estimateTokens, setEstimateTokens] = useState([]);

	const [loading, setLoading] = useState(false);

	const getWithdrawEstimate = async (shareValue) => {
		if (!shareValue || ["", "."].includes(shareValue)) return;
		if (props.contract !== null) {
			try {
				const shareAmount = ethers.utils.parseUnits(shareValue.toString(), 6);
				if (props.contract.getWithdrawEstimate) {
					let response = await props.contract.getWithdrawEstimate(shareAmount);
					setEstimateTokens([
						ethers.utils.formatUnits(response.amountToken1, 6),
						ethers.utils.formatUnits(response.amountToken2, 18),
					]);
				} else {
					console.log("getWithdrawEstimate not found in contract ABI");
				}
			} catch (err) {
				console.error("Failed to get withdraw estimate:", err);
			}
		}
	};

	const onChangeAmountOfShare = async (e) => {
		setAmountOfShare(e.target.value);
		await getWithdrawEstimate(e.target.value);
	};

	const getMaxShare = async () => {
		if (props.contract !== null) {
			setAmountOfShare(props.maxShare);
			await getWithdrawEstimate(props.maxShare);
		} else {
			toast.warning(warningMessages.connectWallet);
		}
	};

	const withdrawShare = async () => {
		if (["", "."].includes(amountOfShare)) {
			toast.warning(warningMessages.invalidAmount);
			return;
		}
		if (Number(props.maxShare) < Number(amountOfShare)) {
			toast.warning("Amount exceeds your available shares. Please reduce the amount.");
			return;
		}
		if (props.contract === null) {
			toast.warning(warningMessages.connectWallet);
			return;
		} else {
			try {
				setLoading(true);
				const shareAmount = ethers.utils.parseUnits(amountOfShare.toString(), 6);
				const minAmount1 = 0; // Could be calculated based on slippage
				const minAmount2 = 0;
				const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

				let response = await props.contract.withdraw(
					shareAmount,
					minAmount1,
					minAmount2,
					deadline
				);
				console.log(response);
				await response.wait();
				setAmountOfShare("");
				setEstimateTokens([]);
				await props.getHoldings();
				toast.success(successMessages.withdraw);
			} catch (err) {
				console.error("Withdrawal failed:", err);
				toast.error(getFriendlyErrorMessage(err));
			} finally {
				setLoading(false);
			}
		}
	};
	return (
		<div className="tabBody">
			<BoxTemplate
				leftHeader={"Amount:"}
				right={
					<div onClick={() => getMaxShare()} className="getMax">
						Max
					</div>
				}
				value={amountOfShare}
				onChange={(e) => onChangeAmountOfShare(e)}
			/>
			{estimateTokens.length > 0 && (
				<div className="withdrawEstimate">
					<div className="amount">Amount of USDC: {estimateTokens[0]}</div>
					<div className="amount">Amount of WETH: {estimateTokens[1]}</div>
				</div>
			)}
			<div className="bottomDiv">
				<button className="btn" onClick={() => withdrawShare()} disabled={loading}>
					{loading ? <div className="spinner"></div> : "Withdraw"}
				</button>
			</div>
		</div>
	);
}
