import { Html } from "@elysiajs/html";
import Head from "./share/head";
import Header from "./share/header";
import Table from "./share/table";

export default function DashboardPage() {
  return (
    <html lang="en">
      <Head
        heads={[
          <title key="1">Dukadan | Dashboard</title>,
          <link key="2" rel="stylesheet" href="public/css/dashboard.css" />,
          <link key="3" rel="stylesheet" href="public/css/share/table.css" />,
          <script key="4" type="module" src="public/js/dashboard.js" />,
        ]}
      />
      <body>
        <Header />
        <div id="options">
          <small id="feedback-btn" title="Send a feedback">
            Feedback
          </small>
          <small id="setting-btn">Settings</small>
        </div>
        <div class="container">
          <h4 id="greeting">
            Welcome <span id="username" />
          </h4>
          <dialog id="feedback-dialog">
            <h4>
              <span>Feedback</span>
              <span id="feedback-dialog-close">Close</span>
            </h4>
            <form method="dialog">
              <textarea
                required
                name="feedback-msg"
                placeholder="Enter message here..."
              />
              <button type="submit">send</button>
            </form>
            <div id="feedback-response">
              <p />
            </div>
          </dialog>
          <div>
            <div id="quick-info">
              <div>
                <h5>Gas Price Per KG</h5>
                <div id="gas-price" />
              </div>
              <div>
                <h5>Delivery Fee</h5>
                <div id="delivery-fee" />
              </div>
            </div>

            <div class="tabs">
              <input type="radio" id="radio-1" name="tabs" checked />
              <label class="tab" for="radio-1">
                Orders
                {/* <span class="notification">2</span> */}
              </label>
              {/* <input type="radio" id="radio-2" name="tabs" />
              <label class="tab" for="radio-2">
                Profile
              </label> */}
              {/* <input type="radio" id="radio-3" name="tabs" />
							<label class="tab" for="radio-3">
								Completed
							</label> */}
              <span class="glider" />
            </div>
            <Table
              id="order"
              bodyRows={[]}
              hasNextPage={false}
              hasPrevPage={false}
              headerTitles={[]}
              page={1}
              pageCount={1}
              pageSize={1}
              title="Orders"
              totalPage={1}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
