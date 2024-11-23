import { Html } from "@elysiajs/html";

export default function RefillStatusUpdate() {
  return (
    <div>
      <div class="x-axis">
        <button id="pending-status-btn" type="button">
          PENDING
        </button>
        <button id="processing-status-btn" type="button">
          PROCESSING
        </button>
        <button id="done-status-btn" type="button">
          DONE
        </button>
      </div>
      <hr />
      <br />
      <small>Current Status:</small>
      <div id="status" />
      <br />
      <small>Address:</small>
      <div id="customer-address" />
      <br />
      <small>Cylinder Size:</small>
      <div id="cylinder-size" />
    </div>
  );
}
