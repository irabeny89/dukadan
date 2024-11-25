import { Html } from "@elysiajs/html";
import Footer from "../page-components/share/footer";
import Head from "../page-components/share/head";
import Header from "../page-components/share/header";

export default function HomePage() {
  const AUTH_PAGE_LINK = "/auth";
  return (
    <html lang="en">
      <Head
        heads={[
          <meta
            key="1"
            name="description"
            content="GasRefill for everything cooking gas LPG online and offline order."
          />,
          <title key="2">GasRefill | Home</title>,
          <link key="3" rel="stylesheet" href="public/css/home.css" />,
        ]}
      />
      <body>
        <section class="section">
          <Header />
          <div class="fixed wide">
            <h1 class="large">
              Introducing GasRefill - Your One-Stop Solution for Cooking Gas
              Refills
            </h1>
            <p>
              Are you tired of waiting in long queues or making endless phone
              calls to order a cooking gas refill? Look no further! GasRefill is
              an innovative online platform designed to make ordering cooking
              gas refills a breeze.
            </p>
            <a href={AUTH_PAGE_LINK}>
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
          <div id="what-we-offer" class="fixed wide">
            <h2>What We Offer</h2>
            <h3>1. Streamlined Ordering and Management</h3>
            <p>
              With GasRefill, customers can easily place orders online and track
              their status in real-time. Our platform provides a seamless
              experience, ensuring that your gas refills are delivered promptly
              and efficiently.
            </p>
          </div>
        </section>

        <section class="section">
          <div id="what-we-offer" class="fixed wide">
            <h2>What We Offer</h2>
            <h3>2. Order Tracking and Management</h3>
            <p>
              GasRefill provides real-time order tracking, enabling customers to
              stay informed about the status of their orders. Our platform also
              allows admins and owners to manage orders efficiently, ensuring
              timely delivery and minimizing delays.
            </p>
          </div>
        </section>

        <section class="section">
          <div id="what-we-offer" class="fixed wide">
            <h2>What We Offer</h2>
            <h3>3. Feedback Management for Continuous Improvement</h3>
            <p>
              At GasRefill, we value your feedback and use it to continuously
              improve our services. Our platform allows customers to provide
              feedback on their experience, helping us refine our services to
              meet your evolving needs.
            </p>
          </div>
        </section>

        <section class="section">
          <div id="safety-tips" class="fixed wide">
            <h2>Safety Tips</h2>
            <div>
              <div>Always check cylinders for leaks before use.</div>
              <div>Store cylinders upright and secure.</div>
              <div>Keep cylinders away from heat sources.</div>
              <div>Use approved regulators and hoses.</div>
            </div>
          </div>
        </section>

        <section class="section">
          <div id="what-our-customers-say" class="fixed wide">
            <h2>What Our Customers Say</h2>
            <div class="testimonial-card">
              <p>
                "GasRefill has been my go-to for cooking gas. Their service is
                prompt and reliable." - Mrs. Johnson
              </p>
            </div>
            <div class="testimonial-card">
              <p>
                "I appreciate the safety tips and guidance provided by
                GasRefill's staff." - Mr. Thompson
              </p>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="fixed white wide">
            <h2>Experience the Convenience of GasRefill Today!</h2>
            <p>
              Sign up for GasRefill today and discover a hassle-free way to
              order cooking gas refills online. Our platform is designed to save
              you time, effort, and frustration, ensuring that you can focus on
              what matters most - enjoying delicious meals with your loved ones!
            </p>
            <p>Contact us: 080 XXXX XXXX | info@gasrefill.com</p>
            <a href={AUTH_PAGE_LINK}>
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
