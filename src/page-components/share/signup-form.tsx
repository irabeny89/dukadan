import { Html } from "@elysiajs/html";

export default function SignForm() {
  return (
    <div class="container">
      <div class="main">
        <form id="signup-form">
          <label for="chk" aria-hidden="true">
            Sign up
          </label>
          <input type="text" name="username" placeholder="User name" required />
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            minlength="8"
            required
          />
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}
