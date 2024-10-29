import { decodeJwt, apiClient, convertToNaira } from "./utils.js";

try {
  const feedbackDialog = document.querySelector("#feedback-dialog");
  const feedbackBtn = document.getElementById("feedback-btn");
  const settingBtn = document.getElementById("setting-btn");
  const feedbackCloseBtn = document.getElementById("feedback-dialog-close");
  const gasPrice = document.getElementById("gas-price");
  const deliveryFee = document.getElementById("delivery-fee");
  const accessToken = window.localStorage.getItem("access");

  if (!accessToken) throw new Error("Token not found with name `access`");
  const user = decodeJwt(accessToken);
  // set dashboard user name in greeting eg 'Welcome Dev'
  document.getElementById("username").textContent = user.username;
  // only `customer` can send feedback, hide if role is not `customer`
  if (user.role !== "customer") feedbackBtn.style.display = "none";
  if (!["owner", "admin"].includes(user.role))
    settingBtn.style.display = "none";

  feedbackCloseBtn.onclick = () => feedbackDialog.close();
  // enable feedback button toggling
  feedbackBtn.onclick = () => {
    if (feedbackDialog.checkVisibility()) feedbackDialog.close();
    else feedbackDialog.show();
  };

  window.onload = async () => {
    const res = await apiClient.settings.getAll();
    const setting = res.data[0];
    // set gas price per kg
    gasPrice.textContent = `${convertToNaira(setting.pricePerKg)}`;
    // set delivery fee
    deliveryFee.textContent = `${convertToNaira(setting.deliveryFee)}`;
  };
} catch (error) {
  console.error(error.message);
  // redirect to home page
  document.location.href = "/?error=true";
}
