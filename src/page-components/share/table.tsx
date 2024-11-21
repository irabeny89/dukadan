import { Html } from "@elysiajs/html";
import paginator from "../../lib/paginator";
import { createTitleFromObjectKeys } from "../../utils";
import AddIcon from "./add-icon";
import TrashIcon from "./trash-icon";

export type TablePropsT = {
	data: object[];
	cssId: string;
	cssAddId?: string;
	cssDeleteId?: string;
	title: string;
	page?: string;
	pageSize?: string;
	allowDelete: boolean;
	allowAdd: boolean;
};

const renderHeaders = (title: string, i: number) => (
	<th key={title.toString()} safe>
		{title}
	</th>
);
const renderRowData = (data: string, idx2: number) => (
	<td key={idx2.toString()} safe>
		{data}
	</td>
);
const renderRows =
	(page: number, pageSize: number) => (row: string[], idx: number) => {
		const lastNumOfPrevPage = pageSize * (page - 1);
		const rowNum = 1 + idx + lastNumOfPrevPage;
		const [id, ...rest] = row;
		return (
			<tr key={idx.toString()} data-id={id}>
				<td>
					<input type="checkbox" />
				</td>
				<td>{rowNum}</td>
				{rest.map(renderRowData)}
			</tr>
		);
	};
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

export default function Table(props: TablePropsT) {
	const { data, metadata } = paginator(props.data, {
		page: +(props.page ?? 1),
		pageSize: +(props.pageSize ?? 10),
	});
	// slice off `id`
	const headerTitles = createTitleFromObjectKeys(data[0]).slice(1);
	const bodyRows = data.map(Object.values);

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
				<div class="table-display">Total: {metadata.totalItems}</div>
				<table>
					<thead>
						<tr>
							<th> </th>
							<th>No</th>
							{headerTitles.map(renderHeaders)}
						</tr>
					</thead>
					<tbody>
						{bodyRows.map(renderRows(metadata.page, metadata.pageSize))}
					</tbody>
				</table>
				<div class="pagination">
					<button
						type="button"
						id="previous-button"
						disabled={!metadata.hasPrevPage}
					>
						&laquo; Previous
					</button>
					{Array.from({ length: metadata.pageCount }).map(
						renderPagingNumbers(metadata.page),
					)}
					<button
						type="button"
						id="next-button"
						disabled={!metadata.hasNextPage}
					>
						Next &raquo;
					</button>
				</div>
			</div>
		</div>
	);
}
