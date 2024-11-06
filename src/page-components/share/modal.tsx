import { Html } from "@elysiajs/html";

type PropsT = {
	children: JSX.Element;
	id?: string | number;
	stype?: Record<string, string> | string;
	title?: string;
};

type HeaderPropsT = {
	title?: string;
};

const headerStyle = {
	display: "flex",
	justifyContent: "between",
};
const Header = (props: HeaderPropsT) => (
	<h4 style={headerStyle}>
		<span safe>{props.title}</span>
		<span>&#128473;</span>
	</h4>
);

export default function Modal(props: PropsT) {
	return (
		<dialog open id={props.id} style={props.stype}>
			{(props.title as "safe") ? Header : null}
			{props.children as "safe"}
		</dialog>
	);
}
