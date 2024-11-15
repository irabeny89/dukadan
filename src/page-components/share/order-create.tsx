import { Html } from "@elysiajs/html";

export function OrderCreateForm() {
	return (
		<div>
			<link rel="stylesheet" href="public/css/refill-form.css" />

			<form method="dialog">
				<div>
					<label for="quantity">Quantity: </label>
					<input
						id="quantity"
						required
						type="number"
						min="1"
						step="0.5"
						name="quantity"
						placeholder="Enter quantity eg 3 for 3kg"
					/>
				</div>
				<div>
					<label for="phone">Phone: </label>
					<input
						id="phone"
						required
						type="number"
						name="phone"
						placeholder="Enter contact phone"
					/>
				</div>
				<div>
					<label for="fullAddress">Address: </label>
					<input
						id="address"
						required
						type="text"
						name="address"
						placeholder="Enter full address"
					/>
				</div>
				<button type="submit">send</button>
			</form>
			<div id="refill-response" data-reload="false">
				<p />
			</div>
		</div>
	);
}
