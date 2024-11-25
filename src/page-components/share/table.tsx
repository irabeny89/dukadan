import { Html } from "@elysiajs/html";
import { createTitleFromObjectKeys } from "../../utils";
import AddIcon from "./add-icon";
import TrashIcon from "./trash-icon";
import type { MetadataT } from "../../types";

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
  metadata: MetadataT;
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
        {[id, ...rest].map(renderRowData)}
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
  // slice off `id`
  const headerTitles = createTitleFromObjectKeys(props.data[0]);
  const bodyRows = props.data.map(Object.values);

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
            <TrashIcon /> Request Refill
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
        <div class="table-display">Total: {props.metadata.totalItems}</div>
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>No</th>
              {headerTitles.map(renderHeaders)}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map(
              renderRows(props.metadata.page, props.metadata.pageSize),
            )}
          </tbody>
        </table>
        <div class="pagination">
          <button
            type="button"
            id="previous-button"
            disabled={!props.metadata.hasPrevPage}
          >
            &laquo; Previous
          </button>
          {Array.from({ length: props.metadata.pageCount }).map(
            renderPagingNumbers(props.metadata.page),
          )}
          <button
            type="button"
            id="next-button"
            disabled={!props.metadata.hasNextPage}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
