import { Html } from "@elysiajs/html";

export default function LoginForm() {
	return (
		<div class="container">
			<div class="main">
				<form id="login-form">
					<label for="chk" aria-hidden="true">
						Login
					</label>
					<input type="email" name="email" placeholder="Email" required />
					<input
						type="password"
						name="password"
						placeholder="Password"
						minlength="8"
						required
					/>
					<button id="login-btn" type="submit">
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
