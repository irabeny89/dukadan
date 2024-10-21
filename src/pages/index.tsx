import Footer from "./share/footer";
import Header from "./share/header";
import { Html } from "@elysiajs/html";

export default function HomePage() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dukadan | Home</title>
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
        <link rel="stylesheet" href="public/css/home.css" />
      </head>
      <body>
        <section class="section">
          <Header />
          <div class="fixed">
            <h1 class="large">Welcome to Dukadan Oil & Gas Nig Ltd</h1>
            <p>Your Trusted Partner for Cooking Gas Solutions</p>
            <a href="/customer">
              <button id="get-started-btn" class="glow-anim" type="button">
                Get Cooking Gas Today!
              </button>
            </a>
          </div>
          <div id="scroll-tip" class="pulsate-bck">
            scroll down <br />
            &#8595;
          </div>
        </section>

        <section class="section">
          <div class="fixed">
            <h2>What We Offer</h2>
            <div>
              <div>High-quality LPG cylinders</div>
              <div>Competitive pricing</div>
              <div>Timely delivery</div>
              <div>Expert technical support</div>
              <div>Wide distribution network</div>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="fixed">
            <h2>Our Products & Services</h2>
            <div class="product-card">
              <h3>Gas Refilling</h3>
              <p>Refill your gas cylinders at our depot.</p>
            </div>
            <div class="product-card">
              <h3>Online Refilling</h3>
              <p>Order a refill online and have it sorted out fast.</p>
            </div>
            <div class="product-card">
              <h3>New Cylinder & Accessories Sales</h3>
              <p>
                Purchase new gas cylinders and accessories from our extensive
                range.
              </p>
            </div>
            <div class="product-card">
              <h3>Gas Installation & Maintenance</h3>
              <p>New installation or existing gas appliances maintenance.</p>
            </div>
            <div class="product-card">
              <h3>Gas Safety Consulting</h3>
              <p>Get expert advice on gas safety and usage.</p>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="fixed">
            <h2>Safety Tips</h2>
            <ul>
              <li>Always check cylinders for leaks before use.</li>
              <li>Store cylinders upright and secure.</li>
              <li>Keep cylinders away from heat sources.</li>
              <li>Use approved regulators and hoses.</li>
            </ul>
          </div>
        </section>

        <section class="section">
          <div class="fixed">
            <h2>What Our Customers Say</h2>
            <div class="testimonial-card">
              <p>
                "Dukadan Oil & Gas has been my go-to for cooking gas. Their
                service is prompt and reliable." - Mrs. Johnson
              </p>
            </div>
            <div class="testimonial-card">
              <p>
                "I appreciate the safety tips and guidance provided by Dukadan's
                staff." - Mr. Thompson
              </p>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="fixed white">
            <h2>Get Cooking Gas Today!</h2>
            <p>Contact us: 080 XXXX XXXX | info@dukadan.com</p>
            <a href="/customer">
              <button id="get-started-btn" class="heartbeat" type="button">
                Get Started
              </button>
            </a>
          </div>
          <Footer />
        </section>
      </body>
    </html>
  );
}
