import { apiClient } from "./utils.js";

const logoutBtn = document.getElementById("logout-btn");
const logoutDialog = document.getElementById("logout-dialog");
const logoutDialogCloseBtn = document.getElementById("logout-dialog-close-btn");
const logoutYesBtn = document.getElementById("logout-yes-btn");
const logoutNoBtn = document.getElementById("logout-no-btn");

document.onclick = (e) => {
  if (e.target === logoutDialog) {
    console.log(e);
    logoutDialog.close();
  }
};

logoutBtn.onclick = () => {
  logoutDialog.showModal();
};

logoutYesBtn.onclick = () => {
  // logout
  apiClient.auth.logout();
  // redirect to homepage
  window.location.replace("/");
};

logoutNoBtn.onclick = () => {
  logoutDialog.close();
};

logoutDialogCloseBtn.onclick = () => {
  logoutDialog.close();
};
