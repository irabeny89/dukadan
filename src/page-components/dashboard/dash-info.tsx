import { Html } from "@elysiajs/html";
import { getSettings } from "../../config";
import { convertToNaira } from "../../utils";

const settings = getSettings();
export function Info() {
	return (
		<div id="quick-info">
			<div>
				<div>Gas Price Per Kg</div>
				<div safe id="gas-price">
					{convertToNaira(settings.pricePerKg)}
				</div>
			</div>
			<div>
				<div>Delivery Fee</div>
				<div safe id="delivery-fee">
					{convertToNaira(settings.deliveryFee)}
				</div>
			</div>
		</div>
	);
}
