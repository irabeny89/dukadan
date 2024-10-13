import { Html } from "@elysiajs/html";

export default function Home() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dukadan | Home</title>
      </head>
      <body>
        <header>
          <h1>
            Dukadan{" "}
            <span>
              <button type="button">logout</button>
            </span>
          </h1>
          <div>
            <nav>
              <a href="/">Home</a>
            </nav>
            <nav>
              <a href="/signup">Signup</a>
            </nav>
            <nav>
              <a href="/login">Login</a>
            </nav>
            <nav>
              <a href="/orders">Orders</a>
            </nav>
            <nav>
              <a href="/about">About Us</a>
            </nav>
          </div>
        </header>

        <main>
          <section>
            <h1>Welcome to Dukadan Online</h1>
          </section>
        </main>
        <footer>Dukadan Online &copy; 2024</footer>
      </body>
    </html>
  );
}
