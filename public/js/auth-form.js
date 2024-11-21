import { DASHBOARD_ORDER_TAB_LINK, apiClient } from "./utils.js";

const LOGIN_FORM_ID = "login-form";
const SIGNUP_FORM_ID = "signup-form";

const loginForm = document.getElementById(LOGIN_FORM_ID);
const signupForm = document.getElementById(SIGNUP_FORM_ID);

const searchParams = new URLSearchParams(window.location.search);

async function handleAuth(e) {
  e.preventDefault();

  const submit = document.querySelector("button");
  // disable submit button to disallow multiple clicks
  submit.disabled = true;
  // extract input data from form element
  const data = Object.fromEntries(new FormData(e.target));
  const role = searchParams.get("role");

  const apiMap =
    e.target.id === LOGIN_FORM_ID
      ? {
          customer: apiClient.auth.loginCustomer,
          owner: apiClient.auth.loginOwner,
          admin: apiClient.auth.loginAdmin,
          driver: apiClient.auth.loginDriver,
        }
      : {
          customer: apiClient.auth.signupCustomer,
          owner: apiClient.auth.signupOwner,
          admin: apiClient.auth.signupAdmin,
          driver: apiClient.auth.signupDriver,
        };

  const reqPromise =
    role in apiMap ? apiMap[role](data) : apiMap.customer(data);
  const res = await reqPromise;
  // on success
  // redirect to dashboard page
  if (res.ok) window.location.href = DASHBOARD_ORDER_TAB_LINK;
  else {
    // on failure
    submit.disabled = false;
    alert("Something went wrong. Contact support.");
  }
}

loginForm.addEventListener("submit", handleAuth);
signupForm.addEventListener("submit", handleAuth);

document.getElementById("login-label").onclick = () => {
  window.scroll({
    top: 500,
    left: 0,
    behavior: "smooth",
  });
};
