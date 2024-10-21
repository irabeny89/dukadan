import { Html } from "@elysiajs/html";

const handleLogin = async (e: Event) => {
  e.preventDefault();
  const submit = document.getElementById("login-btn") as HTMLButtonElement;
  submit.disabled = true;
  const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
  const res = await fetch("/api/customers/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    const json = await res.json();
    window.location.href = "/customer/dashboard";
  } else alert(res.statusText);
};

export default function AuthForm() {
  return (
    <div class="container">
      <div class="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div class="signup">
          <form id="signup-form">
            <label for="chk" aria-hidden="true">
              Sign up
            </label>
            <input
              type="text"
              name="username"
              placeholder="User name"
              required
            />
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button type="submit">Sign up</button>
          </form>
        </div>

        <div class="login">
          <form id="login-form" onsubmit={handleLogin.toString()}>
            <label for="chk" aria-hidden="true">
              Login
            </label>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
            <button id="login-btn" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
