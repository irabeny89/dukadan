import { Html } from "@elysiajs/html";

export function OrderCreateModal() {
	return (
		<dialog id="refill-dialog">
			<h4>
				<span>Refill Order</span>
				<span id="refill-dialog-close">Close</span>
			</h4>
			<form method="dialog">
				<input
					required
					type="number"
					name="cylinder"
					placeholder="Enter cylinder size"
				/>
				<input
					required
					type="text"
					name="address"
					placeholder="Enter location address"
				/>
				<input
					required
					type="tel"
					name="phone"
					placeholder="Enter contact phone"
				/>
				<button type="submit">send</button>
			</form>
			<div id="refill-response">
				<p />
			</div>
		</dialog>
	);
}
