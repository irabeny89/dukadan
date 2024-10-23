import { Html } from "@elysiajs/html";
import Footer from "./share/footer";
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
        <section>
          <Header />
          <h5 id="greeting">Welcome</h5>
          <div class="container">
            <div class="tabs">
              <input type="radio" id="radio-1" name="tabs" checked />
              <label class="tab" for="radio-1">
                Upcoming<span class="notification">2</span>
              </label>
              <input type="radio" id="radio-2" name="tabs" />
              <label class="tab" for="radio-2">
                Development
              </label>
              <input type="radio" id="radio-3" name="tabs" />
              <label class="tab" for="radio-3">
                Completed
              </label>
              <span class="glider" />
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
