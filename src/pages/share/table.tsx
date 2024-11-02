import { Html } from "@elysiajs/html";
import TrashIcon from "../../../public/css/share/trash-icon";
import AddIcon from "../../../public/css/share/add-icon";

type PropsT = {
  id: string;
  title: string;
  page: number;
  pageSize: number;
  pageCount: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  headerTitles: JSX.Element[];
  bodyRows: JSX.Element[][];
};
export default function Table(props: PropsT) {
  return (
    <div id={props.id} class="card">
      <div class="table-title">
        <h2 safe>{props.title}</h2>
      </div>
      <div class="button-container">
        <button type="button" class="danger" title="Delete Selected">
          <TrashIcon />
        </button>
        <button type="button" class="primary" title="Add New Data">
          <AddIcon />
        </button>
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
          Showing {props.page} to {props.pageSize}
          of {props.totalPage} items
        </div>
        <table>
          <thead>
            <tr>
              <th> </th>
              <th>No</th>
              {props.headerTitles.map((title, i) => (
                <th key={title.toString()}>{title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.bodyRows.map((row, idx) => (
              <tr key={idx.toString()}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{idx + 1}</td>
                {row.map((data, idx2) => (
                  <td key={idx2.toString()}>{data}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div class="pagination">
          <label
            class="disabled"
            for={
              props.hasPrevPage
                ? `table_radio_${props.page - 1}`
                : "table_radio_-1"
            }
          >
            &laquo; Previous
          </label>
          {Array.from({ length: props.pageCount }).map((_, index) => (
            <label
              key={index.toString()}
              class={props.page === index + 1 ? "active" : "undefined"}
              for={`table_radio_${index}`}
              id={`table_pager_${index}`}
            >
              {props.page}
            </label>
          ))}
          <label
            class={props.hasNextPage ? "undefined" : "disabled"}
            for={`table_radio_${props.page + 1}`}
          >
            Next &raquo;
          </label>
        </div>
      </div>
    </div>
  );
}
