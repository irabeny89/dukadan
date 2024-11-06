import { decodeJwt, apiClient, convertToNaira } from "./utils.js";

const searchParams = new URLSearchParams(window.location.search);
const feedbackDialog = document.querySelector("#feedback-dialog");
const feedbackBtn = document.getElementById("feedback-btn");
const feedbackForm = document.querySelector("#feedback-dialog form");
const settingBtn = document.getElementById("setting-btn");
const feedbackCloseBtn = document.getElementById("feedback-dialog-close");
const feedbackResponse = document.getElementById("feedback-response");
const accessToken = window.localStorage.getItem("access");

if (!accessToken) throw new Error("Token not found with name `access`");
const user = decodeJwt(accessToken);
// set dashboard user name in greeting eg 'Welcome Dev'
document.getElementById("username").textContent = user.username;
// only `customer` can send feedback, hide if role is not `customer`
if (user.role !== "customer") feedbackBtn.style.display = "none";
if (!["owner", "admin"].includes(user.role)) settingBtn.style.display = "none";

// set gas price per kg and delivery fee
try {
  const res = await apiClient.setting.getAll();
  const setting = res.data[0];
  // set gas price per kg
  document.getElementById("gas-price").textContent =
    `${convertToNaira(setting.pricePerKg)}`;
  // set delivery fee
  document.getElementById("delivery-fee").textContent =
    `${convertToNaira(setting.deliveryFee)}`;
} catch (error) {
  console.error(error.message);
}

// handle tabs selection
const orderTable = document.getElementById("order");
const ordersTabMarker = document.getElementById("radio-1");
// add other tabs
// const profileTabMarker = document.getElementById("radio-2");

// order tab
if (searchParams.get("tab") === "orders") {
  orderTable.style.display = "block";
  ordersTabMarker.checked = true;
}

ordersTabMarker.onclick = (e) => {
  // disable other tabs
  // profileTabMarker.checked = false;

  e.target.checked = true;
  orderTable.style.display = "block";
};
// profileTabMarker.onclick = (e) => {
//   // disable other tabs
//   // ordersTabMarker.checked = false;
//   e.target.checked = true;
//   orderTable.style.display = "none";
// };

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
