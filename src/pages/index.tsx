import { Html } from "@elysiajs/html";
import Footer from "../page-components/share/footer";
import Head from "../page-components/share/head";
import Header from "../page-components/share/header";

export default function HomePage() {
	const AUTH_PAGE_LINK = "/auth";
	return (
		<html lang="en">
			<Head
				heads={[
					<meta
						key="1"
						name="description"
						content="Dukadan Oil and Gas Nigeria Limited for everything cooking gas LPG online and offline order."
					/>,
					<title key="2">Dukadan | Home</title>,
					<link key="3" rel="stylesheet" href="public/css/home.css" />,
				]}
			/>
			<body>
				<section class="section">
					<Header />
					<div class="fixed wide">
						<h1 class="large">Welcome to Dukadan Online</h1>
						<p>Your Trusted Partner for Cooking Gas Solutions</p>
						<a href={AUTH_PAGE_LINK}>
							<button id="get-started-btn" class="glow-anim" type="button">
								Get Cooking Gas Today!
							</button>
						</a>
					</div>
					<div id="scroll-tip" class="pulsate-bck">
						scroll down <br />
						&#8595;
					</div>
				</section>

				<section class="section">
					<div id="what-we-offer" class="fixed wide">
						<h2>What We Offer</h2>
						<div>
							<div>High-quality LPG cylinders</div>
							<div>Competitive pricing</div>
							<div>Timely delivery</div>
							<div>Expert technical support</div>
							<div>Wide distribution network</div>
						</div>
					</div>
				</section>

				<section class="section">
					<div class="fixed wide">
						<h2>Our Products & Services</h2>
						<div class="product-card">
							<h3>Gas Refilling</h3>
							<p>Refill your gas cylinders at our depot.</p>
						</div>
						<div class="product-card">
							<h3>Online Refilling</h3>
							<p>Order a refill online and have it sorted out fast.</p>
						</div>
						<div class="product-card">
							<h3>New Cylinder & Accessories Sales</h3>
							<p>
								Purchase new gas cylinders and accessories from our extensive
								range.
							</p>
						</div>
						<div class="product-card">
							<h3>Gas Installation & Maintenance</h3>
							<p>New installation or existing gas appliances maintenance.</p>
						</div>
						<div class="product-card">
							<h3>Gas Safety Consulting</h3>
							<p>Get expert advice on gas safety and usage.</p>
						</div>
					</div>
				</section>

				<section class="section">
					<div id="safety-tips" class="fixed wide">
						<h2>Safety Tips</h2>
						<div>
							<div>Always check cylinders for leaks before use.</div>
							<div>Store cylinders upright and secure.</div>
							<div>Keep cylinders away from heat sources.</div>
							<div>Use approved regulators and hoses.</div>
						</div>
					</div>
				</section>

				<section class="section">
					<div id="what-our-customers-say" class="fixed wide">
						<h2>What Our Customers Say</h2>
						<div class="testimonial-card">
							<p>
								"Dukadan Oil & Gas has been my go-to for cooking gas. Their
								service is prompt and reliable." - Mrs. Johnson
							</p>
						</div>
						<div class="testimonial-card">
							<p>
								"I appreciate the safety tips and guidance provided by Dukadan's
								staff." - Mr. Thompson
							</p>
						</div>
					</div>
				</section>

				<section class="section">
					<div class="fixed white wide">
						<h2>Get Cooking Gas Today!</h2>
						<p>Contact us: 080 XXXX XXXX | info@dukadan.com</p>
						<a href={AUTH_PAGE_LINK}>
							<button id="get-started-btn" class="heartbeat" type="button">
								Get Started
							</button>
						</a>
					</div>
					<Footer />
				</section>
			</body>
		</html>
	);
}
