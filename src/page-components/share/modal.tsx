import { Html } from "@elysiajs/html";

type PropsT = {
	title: string;
	children: JSX.Element;
	id?: string | number;
	closeBtnId?: string;
};

export default function Modal(props: PropsT) {
	return (
		<dialog id={props.id} class="custom-dialog">
			<link rel="stylesheet" href="public/css/modal.css" />

			<h4>
				<span safe>{props.title}</span>
				<span id={props.closeBtnId}>close</span>
			</h4>
			{props.children as "safe"}
		</dialog>
	);
}
