import { Html } from "@elysiajs/html";
import AuthForm from "./share/auth-form";
import Footer from "./share/footer";
import Head from "./share/head";
import Header from "./share/header";

export default function AuthPage() {
	return (
		<html lang="en">
			<Head
				heads={[
					<meta
						key="1"
						name="description"
						content="Register, login or retrieve your lost account password. "
					/>,
					<title key="2">Dukadan | Auth</title>,
				]}
			/>

			<body>
				<section class="section">
					<Header />
					<div class="fixed">
						<AuthForm />
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
