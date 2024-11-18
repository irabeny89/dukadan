import { Html } from "@elysiajs/html";
import { getSettings } from "../../config";
import type { UserRoleT } from "../../types";
import { convertToNaira } from "../../utils";
import Modal from "../share/modal";

const GasPriceForm = () => (
	<form id="gas-price-form" method="dialog">
		<input
			type="number"
			id="gas-price"
			name="pricePerKg"
			placeholder="New price"
			min="1"
		/>
		<button type="submit">Submit</button>
	</form>
);
const DeliveryFeeForm = () => (
	<form id="delivery-fee-form" method="dialog">
		<input
			type="number"
			id="delivery-fee"
			name="deliveryFee"
			placeholder="New price"
			min="1"
		/>
		<button type="submit">Submit</button>
	</form>
);
export function Info({ role }: Record<"role", UserRoleT>) {
	const settings = getSettings();
	const isOwnerOrAdmin = ["owner", "admin"].includes(role);
	return (
		<div id="quick-info">
			<script type="module" src="public/js/info.js" />
			<link rel="stylesheet" href="public/css/info.css" />

			{isOwnerOrAdmin && (
				<>
					<Modal
						title="Update Gas Price"
						id="gas-price-dialog"
						closeBtnId="gas-price-dialog-close-btn"
					>
						<GasPriceForm />
					</Modal>
					<Modal
						title="Update Delivery Fee"
						id="delivery-fee-dialog"
						closeBtnId="delivery-fee-dialog-close-btn"
					>
						<DeliveryFeeForm />
					</Modal>
				</>
			)}
			<div id="gas-price-btn" title="Click or tap to edit amount">
				{isOwnerOrAdmin ? <small>edit</small> : null}
				<div>Gas Price Per Kg</div>
				<div safe id="gas-price">
					{convertToNaira(settings.pricePerKg)}
				</div>
			</div>
			<div id="delivery-fee-btn" title="Click or tap to edit amount">
				{isOwnerOrAdmin ? <small>edit</small> : null}
				<div>Delivery Fee</div>
				<div safe id="delivery-fee">
					{convertToNaira(settings.deliveryFee)}
				</div>
			</div>
		</div>
	);
}
