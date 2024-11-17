import { Html } from "@elysiajs/html";
import Modal from "./modal";

const AreYouSure = () => (
	<div id="are-you-sure">
		<p>Are you sure?</p>
		<div class="x-axis">
			<button id="logout-no-btn" type="button">
				No
			</button>
			<button id="logout-yes-btn" type="button">
				Yes
			</button>
		</div>
	</div>
);
export default function Logout() {
	return (
		<div>
			<script type="module" src="public/js/logout.js" />
			<link rel="stylesheet" href="public/css/logout.css" />
			<Modal
				title="Logout"
				id="logout-dialog"
				closeBtnId="logout-dialog-close-btn"
			>
				<AreYouSure />
			</Modal>
			<small id="logout-btn">logout</small>
		</div>
	);
}
