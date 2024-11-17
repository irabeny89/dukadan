import { apiClient } from "./utils.js";

const gasPriceBtn = document.getElementById("gas-price-btn");
const deliveryFeeBtn = document.getElementById("delivery-fee-btn");
const gasPriceDialog = document.getElementById("gas-price-dialog");
const gasPriceForm = document.getElementById("gas-price-form");
const gasPriceDialogCloseBtn = document.getElementById(
  "gas-price-dialog-close-btn",
);

gasPriceDialogCloseBtn.onclick = () => {
  gasPriceDialog.close();
};

gasPriceBtn.onclick = () => {
  gasPriceDialog.showModal();
};

gasPriceForm.onsubmit = async (e) => {
  e.preventDefault();
  const pricePerKg = Number(new FormData(gasPriceForm).get("pricePerKg"));
  const res = await apiClient.setting.update({ pricePerKg });
  if (res.ok) window.location.reload();
  else alert("Something went wrong. Try again or contact support.");
};
