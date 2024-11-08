import { Html } from "@elysiajs/html";
import Footer from "../page-components/share/footer";
import Head from "../page-components/share/head";
import Header from "../page-components/share/header";
import LoginForm from "../page-components/share/login-form";
import SignupForm from "../page-components/share/signup-form";

export default function AuthPage() {
	return (
		<html lang="en">
			<Head
				heads={[
					<meta
						key="1"
						name="description"
						content="Register, login or retrieve your lost account password."
					/>,
					<link key="2" rel="stylesheet" href="public/css/auth.css" />,
					<script key="3" type="module" src="public/js/auth-form.js" />,
					<title key="4">Dukadan | Auth</title>,
				]}
			/>

			<body>
				<section class="section">
					<Header />
					<div class="fixed">
						<SignupForm />
					</div>
					<div id="scroll-tip" class="pulsate-bck">
						scroll down <br />
						&#8595;
					</div>
				</section>

				<section class="section">
					<div class="fixed">
						<LoginForm />
					</div>
					<div id="scroll-tip" class="pulsate-bck">
						scroll down <br />
						&#8595;
					</div>
				</section>

				<section class="section">
					<div class="fixed">
						<h2>Recover Password</h2>
						<p>coming soon...</p>
					</div>
					<Footer />
				</section>
			</body>
		</html>
	);
}
