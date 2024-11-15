import { Html } from "@elysiajs/html";
import AddIcon from "./add-icon";
import TrashIcon from "./trash-icon";

type PropsT = {
	cssId: string;
	cssAddId?: string;
	cssDeleteId?: string;
	title: string;
	page: number;
	pageSize: number;
	pageCount: number;
	totalItems: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	headerTitles: JSX.Element[];
	bodyRows: unknown[][];
	allowDelete: boolean;
	allowAdd: boolean;
};

const renderHeaders = (title: JSX.Element, i: number) => (
	<th key={title.toString()}>{title}</th>
);
const renderRowData = (data: unknown, idx2: number) => (
	<td key={idx2.toString()}>{data}</td>
);
const renderRows = (row: unknown[], idx: number) => (
	<tr key={idx.toString()}>
		<td>
			<input type="checkbox" />
		</td>
		<td>{idx + 1}</td>
		{row.map(renderRowData)}
	</tr>
);
const renderPagingNumbers = (page: number) => (_: unknown, index: number) => (
	<label
		key={index.toString()}
		class={page === index + 1 ? "active" : "undefined"}
		for={`table_radio_${index}`}
		id={`table_pager_${index}`}
	>
		{1 + index}
	</label>
);
export default function Table(props: PropsT) {
	const computedPageSize =
		props.pageSize < props.totalItems ? props.pageSize : props.totalItems;
	return (
		<div id={props.cssId} class="card">
			<link rel="stylesheet" href="public/css/share/table.css" />
			<script type="module" src="public/js/table.js" />
			<div class="table-title">
				<h2 safe>{props.title}</h2>
			</div>
			<div class="button-container">
				{props.allowDelete && (
					<button
						id={props.cssDeleteId}
						type="button"
						class="danger"
						title="Delete Selected"
					>
						<TrashIcon />
					</button>
				)}
				{props.allowAdd && (
					<button
						id={props.cssAddId}
						type="button"
						class="primary"
						title="Add New Data"
					>
						<AddIcon />
					</button>
				)}
			</div>
			<div class="table-concept">
				<input
					class="table-radio"
					type="radio"
					name="table_radio"
					id="table_radio_0"
					checked
				/>
				<div class="table-display">
					Showing {props.page} to {computedPageSize} of {props.totalItems} items
				</div>
				<table>
					<thead>
						<tr>
							<th> </th>
							<th>No</th>
							{props.headerTitles.map(renderHeaders)}
						</tr>
					</thead>
					<tbody>{props.bodyRows.map(renderRows)}</tbody>
				</table>
				<div class="pagination">
					<button
						type="button"
						id="previous-button"
						disabled={!props.hasPrevPage}
					>
						&laquo; Previous
					</button>
					{Array.from({ length: props.pageCount }).map(
						renderPagingNumbers(props.page),
					)}
					<button type="button" id="next-button" disabled={!props.hasNextPage}>
						Next &raquo;
					</button>
				</div>
			</div>
		</div>
	);
}
