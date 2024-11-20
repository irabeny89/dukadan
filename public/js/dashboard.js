import { apiClient } from "./utils.js";

const addOrderBtn = document.getElementById("order-add");
const refillOrderDialog = document.getElementById("refill-dialog");
const refillOrderCloseBtn = document.getElementById("refill-dialog-close");
const refillOrderForm = document.querySelector("#refill-dialog form");
const refillOrderResponse = document.getElementById("refill-response");

refillOrderCloseBtn.onclick = () => {
  // reload with close button if dataset reload is true
  if (refillOrderResponse.dataset.reload === "true") {
    refillOrderResponse.dataset.reload === "false";
    window.location.reload();
  } else refillOrderDialog.close();
};

addOrderBtn.onclick = () => {
  if (refillOrderDialog.checkVisibility()) refillOrderDialog.close();
  else {
    refillOrderDialog.showModal();
    // show refill form
    refillOrderForm.style.display = "block";
    // hide refill response
    refillOrderResponse.style.display = "none";
  }
};

refillOrderForm.onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const formdata = new FormData(form);
  const data = Object.fromEntries(formdata);
  try {
    const res = await apiClient.order.create({
      ...data,
      // remember to parse numbers as input values are strings by default
      quantity: Number(data.quantity),
    });
    refillOrderResponse.style.textAlign = "center";
    refillOrderResponse.textContent = res.message;
    refillOrderResponse.dataset.reload = "true";
  } catch (error) {
    console.error(error.message);
    refillOrderResponse.style.color = "red";
    refillOrderResponse.style.textAlign = "center";
    refillOrderResponse.textContent =
      "Order not sent. Try again or contact support.";
  }
  form.reset();
  // hide feedback form
  refillOrderForm.style.display = "none";
  // show feedback response
  refillOrderResponse.style.display = "block";
};
