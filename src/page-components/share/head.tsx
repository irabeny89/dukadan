import { Html } from "@elysiajs/html";

type PropsT = {
	heads: JSX.Element[];
};
export default function Head(props: PropsT) {
	return (
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
			<link
				href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap"
				rel="stylesheet"
			/>
			<link rel="stylesheet" href="public/css/global.css" />
			{props.heads.map((H) => H)}
		</head>
	);
}
