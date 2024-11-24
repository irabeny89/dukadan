import { apiClient } from "./utils.js";

const processingStatusBtn = document.getElementById("processing-status-btn");
const doneStatusBtn = document.getElementById("done-status-btn");
const addOrderBtn = document.getElementById("order-add");
const refillOrderDialog = document.getElementById("refill-dialog");
const refillOrderCloseBtn = document.getElementById("refill-dialog-close");
const refillOrderForm = document.querySelector("#refill-dialog form");
const refillStatusDialog = document.getElementById("refill-status-dialog");
const refillStatusClose = document.getElementById("refill-status-close");
const allTr = document.querySelectorAll("tbody tr");

let selectedRowDataId;
const handleStatusChange = async (id, status) => {
  const res = await apiClient.order.update(id, { status });
  if (res.ok) {
    alert(`Status changed to '${status.toUpperCase()}' successfully.`);
    window.location.reload();
  } else alert("Something went wrong. Contact support.");
};
if (processingStatusBtn) {
  processingStatusBtn.onclick = () =>
    handleStatusChange(selectedRowDataId, "processing");
}
if (doneStatusBtn) {
  doneStatusBtn.onclick = () => handleStatusChange(selectedRowDataId, "done");
}

allTr.forEach((tr) => {
  tr.onclick = () => {
    refillStatusDialog.showModal();
    // set data id from the table role data to refill dialog
    selectedRowDataId = tr.dataset.id;

    const status = tr.querySelector("[key='2']").textContent;
    const address = tr.querySelector("[key='8']").textContent;
    const cylinderSize =
      tr.querySelector("[key='4']").textContent +
      tr.querySelector("[key='3']").textContent;

    document.getElementById("customer-address").textContent = address;
    document.getElementById("cylinder-size").textContent = cylinderSize;
    document.getElementById("status").textContent = status;
  };
});

if (refillStatusDialog)
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
    refillOrderDialog.close();
  };

if (addOrderBtn)
  addOrderBtn.onclick = () => {
    if (refillOrderDialog.checkVisibility()) refillOrderDialog.close();
    else {
      refillOrderDialog.showModal();
    }
  };

if (refillOrderForm)
  refillOrderForm.onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata);
    const res = await apiClient.order.create({
      ...data,
      // remember to parse numbers as input values are strings by default
      quantity: Number(data.quantity),
    });
    if (res.ok) {
      form.reset();
      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } else alert("Something went wrong.Contact support.");
  };
