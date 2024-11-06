import { Html } from "@elysiajs/html";
import { convertToNaira } from "../../utils";
import { getSettings } from "../../config";

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
