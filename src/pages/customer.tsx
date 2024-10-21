import AuthForm from "./share/auth-form";
import Footer from "./share/footer";
import Header from "./share/header";
import { Html } from "@elysiajs/html";

export default function CustomerPage() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dukadan | Customer</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="public/css/global.css" />
        <link rel="stylesheet" href="public/css/customer.css" />
      </head>

      <body>
        <section class="section">
          <Header />
          <div class="fixed">
            <AuthForm />
          </div>
          <div id="scroll-tip" class="pulsate-bck">
            scroll down <br />
            &#8595;
          </div>
        </section>

        <section class="section">
          <div class="fixed">
            <h2>Recover Password</h2>
            <p>coming soon...</p>
          </div>
          <Footer />
        </section>
      </body>
    </html>
  );
}
