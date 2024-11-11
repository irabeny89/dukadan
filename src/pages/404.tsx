import { Html } from "@elysiajs/html";
import Head from "../page-components/share/head";
import Footer from "../page-components/share/footer";
import Header from "../page-components/share/header";

export default function NotFoundPage() {
  return (
    <html lang="en">
      <Head
        heads={[
          <meta
            key="1"
            name="description"
            content="Page not existing on this domain."
          />,
          <title key="2">Dukadan | Not Found</title>,
          <link key="3" rel="stylesheet" href="public/css/404.css" />,
        ]}
      />
      <Header />
      <div class="face">
        <div class="band">
          <div class="red" />
          <div class="white" />
          <div class="blue" />
        </div>
        <div class="eyes" />
        <div class="dimples" />
        <div class="mouth" />
      </div>

      <h1>Oops! Something went wrong!</h1>
      <a href="/">
        <div class="btn">Return to Home Page</div>
      </a>
      <br />
      <br />
      <br />
      <Footer />
    </html>
  );
}
