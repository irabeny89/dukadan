async function handleLogin(e, form) {
  e.preventDefault();
  const submit = document.getElementById("login-btn");
  submit.disabled = true;
  const data = Object.fromEntries(new FormData(form));
  const res = await fetch("/api/customers/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    const json = await res.json();
    window.location.href = "/customer/dashboard";
  } else alert(res.statusText);
}

const form = document.querySelector("#login-form");
if (form) form.addEventListener("submit", (e) => handleLogin(e, form));
else console.log("form with id 'login-form' not found");
