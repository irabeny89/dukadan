import { Html } from "@elysiajs/html";
import Head from "./share/head";
import Header from "./share/header";
import Footer from "./share/footer";

export default function DashboardPage() {
  return (
    <html lang="en">
      <Head
        heads={[
          <title key="1">Dukadan | Dashboard</title>,
          <link key="2" rel="stylesheet" href="public/css/dashboard.css" />,
        ]}
      />
      <body>
        <h2>Welcome to your dashboard</h2>
      </body>
    </html>
  );
}
