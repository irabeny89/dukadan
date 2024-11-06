const LOGIN_FORM_ID = "login-form";
const CUSTOMER_LOGIN_API = "/api/customers/login";
const DASHBOARD_LINK = "/dashboard?tab=orders";

async function handleLogin(e, form) {
  e.preventDefault();
  const submit = document.getElementById("login-btn");
  // disable submit button to disallow multiple clicks
  submit.disabled = true;
  // extract input data from form
  const data = Object.fromEntries(new FormData(form));
  const res = await fetch(CUSTOMER_LOGIN_API, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  // on success
  // redirect to dashboard page
  if (res.ok) window.location.href = DASHBOARD_LINK;
  else {
    // on failure
    submit.disabled = false;
    alert(res.statusText);
  }
}

const form = document.getElementById(LOGIN_FORM_ID);
if (form) form.addEventListener("submit", (e) => handleLogin(e, form));
else console.log("form with id '%s' not found", LOGIN_FORM_ID);
