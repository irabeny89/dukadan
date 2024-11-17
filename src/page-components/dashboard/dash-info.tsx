import { Html } from "@elysiajs/html";
import { getSettings } from "../../config";
import { convertToNaira } from "../../utils";
import type { UserRoleT } from "../../types";

const settings = getSettings();
export function Info({ role }: Record<"role", UserRoleT>) {
  const isOwnerOrAdmin = ["owner", "admin"].includes(role);
  return (
    <div id="quick-info">
      <link rel="stylesheet" href="public/css/info.css" />
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
