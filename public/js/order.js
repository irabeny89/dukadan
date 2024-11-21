import { apiClient } from "./utils.js";

const pendingStatusBtn = document.getElementById("pending-status-btn");
const processingStatusBtn = document.getElementById("processing-status-btn");
const doneStatusBtn = document.getElementById("done-status-btn");
const addOrderBtn = document.getElementById("order-add");
const refillOrderDialog = document.getElementById("refill-dialog");
const refillOrderCloseBtn = document.getElementById("refill-dialog-close");
const refillOrderForm = document.querySelector("#refill-dialog form");
const refillOrderResponse = document.getElementById("refill-response");
const refillStatusDialog = document.getElementById("refill-status-dialog");
const refillStatusClose = document.getElementById("refill-status-close");
const allTr = document.querySelectorAll("tbody tr");

const handleStatusChange = (status) => () => {};

allTr.forEach((tr) => {
  tr.onclick = () => {
    refillStatusDialog.showModal();

    const status = tr.querySelector("[key='8']").textContent;
    const address = tr.querySelector("[key='6']").textContent;
    const cylinderSize =
      tr.querySelector("[key='4']").textContent +
      tr.querySelector("[key='5']").textContent;

    document.getElementById("customer-address").textContent = address;
    document.getElementById("cylinder-size").textContent = cylinderSize;
    document.getElementById("status").textContent = status;
  };
});

refillStatusDialog.onclick = (e) => {
  const rect = refillStatusDialog.getBoundingClientRect();
  const isInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (!isInDialog) refillStatusDialog.close();
};

if (refillStatusClose)
  refillStatusClose.onclick = () => refillStatusDialog.close();

if (refillOrderDialog)
  refillOrderDialog.onclick = (e) => {
    const rect = refillOrderDialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;

    if (!isInDialog) refillOrderDialog.close();
  };

if (refillOrderCloseBtn)
  refillOrderCloseBtn.onclick = () => {
    // reload with close button if dataset reload is true
    if (refillOrderResponse.dataset.reload === "true") {
      refillOrderResponse.dataset.reload === "false";
      window.location.reload();
    } else refillOrderDialog.close();
  };

if (addOrderBtn)
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

if (refillOrderForm)
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
