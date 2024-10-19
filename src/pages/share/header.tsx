const Brand = () => (
	<div class="logo">
		<img src="public/assets/logo.png" alt="Dukadan Oil & Gas Nig Ltd" />
		<h1>Dukadan Online</h1>
	</div>
);
const Menu = () => (
	<nav>
		<a href="/">Home</a>
		<a href="/signup">Sign Up</a>
		<a href="/login">Log In</a>
		<a href="/order-refill">Order Refill</a>
		<a href="/feedback">Feedback</a>
		<a href="/dashboard">Dashboard</a>
	</nav>
);

export default function Header() {
	return (
		<header>
			<Brand />
			<Menu />
		</header>
	);
}
