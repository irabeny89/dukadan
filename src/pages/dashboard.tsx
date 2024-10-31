import { Html } from "@elysiajs/html";
import Head from "./share/head";
import Header from "./share/header";

export default function DashboardPage() {
  return (
    <html lang="en">
      <Head
        heads={[
          <title key="1">Dukadan | Dashboard</title>,
          <link key="2" rel="stylesheet" href="public/css/dashboard.css" />,
          <script key="3" type="module" src="public/js/dashboard.js" />,
        ]}
      />
      <body>
        <section class="section">
          <Header />
          <h5 id="greeting">
            Welcome <span id="username" />
          </h5>
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
          <div class="container">
            <div id="quick-info">
              <div>
                <h5>Gas Price Per Kilogram</h5>
                <div id="gas-price" />
                <h5>Delivery Fee</h5>
                <div id="delivery-fee" />
              </div>
            </div>
            <div id="options">
              <button id="feedback-btn" type="button" title="Send a feedback">
                Feedback
              </button>
              <button id="setting-btn" type="button">
                Settings
              </button>
            </div>

            <div class="tabs">
              <input type="radio" id="radio-1" name="tabs" checked />
              <label class="tab" for="radio-1">
                Orders<span class="notification">2</span>
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
          </div>
        </section>
      </body>
    </html>
  );
}
