import { apiClient } from "./utils.js";

const gasPriceBtn = document.getElementById("gas-price-btn");
const deliveryFeeBtn = document.getElementById("delivery-fee-btn");
const gasPriceDialog = document.getElementById("gas-price-dialog");
const deliveryFeeDialog = document.getElementById("delivery-fee-dialog");
const gasPriceForm = document.getElementById("gas-price-form");
const deliveryFeeForm = document.getElementById("delivery-fee-form");
const gasPriceDialogCloseBtn = document.getElementById(
  "gas-price-dialog-close-btn",
);
const deliveryFeeDialogCloseBtn = document.getElementById(
  "delivery-fee-dialog-close-btn",
);

if (gasPriceDialog)
  gasPriceDialog.onclick = (e) => {
    const rect = gasPriceDialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) {
      gasPriceDialog.close();
    }
  };

document.onclick = (e) => {
  if (e.target === deliveryFeeDialog) deliveryFeeDialog.close();
};

if (gasPriceDialogCloseBtn)
  gasPriceDialogCloseBtn.onclick = () => {
    gasPriceDialog.close();
  };

gasPriceBtn.onclick = () => {
  gasPriceDialog.showModal();
};

if (gasPriceForm)
  gasPriceForm.onsubmit = async (e) => {
    e.preventDefault();
    const pricePerKg = Number(new FormData(gasPriceForm).get("pricePerKg"));
    const res = await apiClient.setting.update({ pricePerKg });
    if (res.ok) window.location.reload();
    else alert("Something went wrong. Try again or contact support.");
  };

if (deliveryFeeDialogCloseBtn)
  deliveryFeeDialogCloseBtn.onclick = () => {
    deliveryFeeDialog.close();
  };

deliveryFeeBtn.onclick = () => {
  deliveryFeeDialog.showModal();
};

if (deliveryFeeForm)
  deliveryFeeForm.onsubmit = async (e) => {
    e.preventDefault();
    const deliveryFee = Number(
      new FormData(deliveryFeeForm).get("deliveryFee"),
    );
    const res = await apiClient.setting.update({ deliveryFee });
    if (res.ok) window.location.reload();
    else alert("Something went wrong. Try again or contact support.");
  };
