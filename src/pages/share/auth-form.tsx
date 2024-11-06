import { Html } from "@elysiajs/html";

export default function AuthForm() {
	return (
		<div class="container">
			<link rel="stylesheet" href="public/css/auth.css" />
			<script type="module" src="public/js/auth-form.js" />
			<div class="main">
				<input type="checkbox" id="chk" />

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
							minlength="8"
							required
						/>
						<button type="submit">Sign up</button>
					</form>
				</div>

				<div class="login">
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
		</div>
	);
}
