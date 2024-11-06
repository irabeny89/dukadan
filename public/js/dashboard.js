import { apiClient, convertToNaira } from "./utils.js";

const DASHBOARD_ORDER_TAB_LINK = "/dashboard?tab=orders";

const searchParams = new URLSearchParams(window.location.search);
const feedbackDialog = document.querySelector("#feedback-dialog");
const feedbackBtn = document.getElementById("feedback-btn");
const feedbackForm = document.querySelector("#feedback-dialog form");
const settingBtn = document.getElementById("setting-btn");
const feedbackCloseBtn = document.getElementById("feedback-dialog-close");
const feedbackResponse = document.getElementById("feedback-response");

// handle tabs selection
const orderTable = document.getElementById("order");
const ordersTabMarker = document.getElementById("radio-1");
// add other tabs
// const profileTabMarker = document.getElementById("radio-2"); //e.g

// order tab
if (searchParams.get("tab") === "orders") {
  ordersTabMarker.checked = true;
  orderTable.style.display = "block";
}

ordersTabMarker.onclick = (e) => {
  window.location.href = DASHBOARD_ORDER_TAB_LINK;
};
// profileTabMarker.onclick = (e) => {
//   // disable other tabs
//   // ordersTabMarker.checked = false;
//   e.target.checked = true;
//   orderTable.style.display = "none";
// };

// handle feedback dialog modal
feedbackCloseBtn.onclick = () => feedbackDialog.close();
// enable feedback button toggling
feedbackBtn.onclick = () => {
  if (feedbackDialog.checkVisibility()) feedbackDialog.close();
  else {
    feedbackDialog.show();
    // show feedback form again
    feedbackForm.style.display = "block";
    // hide feedback response
    feedbackResponse.style.display = "none";
  }
};

// send feedback
feedbackForm.onsubmit = async (e) => {
  try {
    e.preventDefault();
    const form = e.target;
    const formdata = new FormData(form);
    const message = formdata.get("feedback-msg");
    const res = await apiClient.feedback.create({ message });
    form.reset();
    // hide feedback form
    feedbackForm.style.display = "none";
    // show feedback response
    feedbackResponse.style.display = "block";
    feedbackResponse.textContent = res.message;
  } catch (error) {
    console.error(error.message);
    feedbackResponse.textContent = "Something went wrong.";
  }
};
