import { DASHBOARD_ORDER_TAB_LINK, apiClient } from "./utils.js";

const LOGIN_FORM_ID = "login-form";

const searchParams = new URLSearchParams(window.location.search);

async function handleLogin(e, form) {
  e.preventDefault();
  const submit = document.getElementById("login-btn");
  // disable submit button to disallow multiple clicks
  submit.disabled = true;
  // extract input data from form
  const data = Object.fromEntries(new FormData(form));
  const apiMap = {
    customer: apiClient.auth.loginCustomer,
    owner: apiClient.auth.loginOwner,
    admin: apiClient.auth.loginAdmin,
    driver: apiClient.auth.loginDriver,
  };
  const role = searchParams.get("role");
  const reqPromise =
    role in apiMap ? apiMap[role](data) : apiMap.customer(data);
  const res = await reqPromise;
  // on success
  // redirect to dashboard page
  if (res.ok) window.location.href = DASHBOARD_ORDER_TAB_LINK;
  else {
    // on failure
    submit.disabled = false;
    alert(res.statusText);
  }
}

const form = document.getElementById(LOGIN_FORM_ID);
if (form) form.addEventListener("submit", (e) => handleLogin(e, form));
else console.log("form with id '%s' not found", LOGIN_FORM_ID);
