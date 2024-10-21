const LOGIN_FORM_ID = "login-form";

async function handleLogin(e, form) {
  e.preventDefault();
  const submit = document.getElementById("login-btn");
  // disable submit button to disallow multiple clicks
  submit.disabled = true;
  // extract input data from form
  const data = Object.fromEntries(new FormData(form));
  const res = await fetch("/api/customers/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  // on success
  if (res.ok) {
    // parse response data to js object
    const json = await res.json();
    window.localStorage.setItem("token", json.data.access);
    window.sessionStorage.setItem("refresh", json.data.refresh);
    // redirect to dashboard page
    window.location.href = "/dashboard";
  } else {
    // on failure
    submit.disabled = false;
    alert(res.statusText);
  }
}

const form = document.getElementById(LOGIN_FORM_ID);
if (form) form.addEventListener("submit", (e) => handleLogin(e, form));
else console.log("form with id '%s' not found", LOGIN_FORM_ID);
