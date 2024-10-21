import { Html } from "@elysiajs/html";
import Footer from "./footer";
import Head from "./head";
import Header from "./header";

type PropsT = {
	/** html head title */
	title: string;
	children: JSX.Element;
	pageCssPath?: string;
};
export default function Layout(props: PropsT) {
	return (
		<html lang="en">
			<Head pageTitle="Home" pageCssPath={props.pageCssPath} />
			<body>
				<Header />
				{props.children as "safe"}
				<Footer />
			</body>
		</html>
	);
}
