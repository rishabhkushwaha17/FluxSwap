import { useState } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import "../styles.css";
import BoxTemplate from "./BoxTemplate";
import { PRECISION } from "../constants";

export default function FaucetComponent(props) {
	const [amountOfUSDC, setAmountOfUSDC] = useState(0);
	const [amountOfWETH, setAmountOfWETH] = useState(0);

	const onChangeAmountOfWETH = (e) => {
		setAmountOfWETH(e.target.value);
	};

	const onChangeAmountOfUSDC = (e) => {
		setAmountOfUSDC(e.target.value);
	};

	async function onClickFund() {
		if (props.contract === null) {
			toast.warning("Connect to Metamask");
			return;
		}
		if (["", "."].includes(amountOfUSDC) || ["", "."].includes(amountOfWETH)) {
			toast.warning("Amount should be a valid number");
			return;
		}
		try {
			const usdcAmount = ethers.utils.parseUnits(amountOfUSDC.toString(), 6);
			const wethAmount = ethers.utils.parseUnits(amountOfWETH.toString(), 18);

			let response = await props.contract.faucet(
				usdcAmount,
				wethAmount
			);
			let res = await response.wait();
			console.log("res", res);
			setAmountOfUSDC(0);
			setAmountOfWETH(0);
			await props.getHoldings();
			toast.success("Tokens funded successfully!");
		} catch (err) {
			console.error("Faucet failed:", err);
			toast.error(err?.data?.message || err?.message || "Funding failed");
		}
	}

	return (
		<div className="tabBody">
			<BoxTemplate
				leftHeader={"Amount of USDC"}
				right={"USDC"}
				value={amountOfUSDC}
				onChange={(e) => onChangeAmountOfUSDC(e)}
			/>
			<BoxTemplate
				leftHeader={"Amount of WETH"}
				right={"WETH"}
				value={amountOfWETH}
				onChange={(e) => onChangeAmountOfWETH(e)}
			/>
			<div className="bottomDiv">
				<div className="btn" onClick={() => onClickFund()}>
					Fund
				</div>
			</div>
		</div>
	);
}
