import { Html } from "@elysiajs/html";
import Layout from "../share/layout";
import Badge from "../share/badge";

export default function Home() {
  return (
    <Layout title="Home" pageCssPath="public/css/home.css">
      <main>
        <section id="home" class="hero">
          <div class="background-image">
            <img src="public/assets/hero-image.jpg" alt="Cooking Gas" />
          </div>
          <div class="hero-content">
            <h1>Welcome to Dukadan Oil & Gas Nig Ltd</h1>
            <p>Your Trusted Partner for Cooking Gas Solutions</p>
            <button id="get-started-btn" type="button">
              Get Cooking Gas Today!
            </button>
          </div>
        </section>
        <section id="about" class="what-we-offer">
          <h2>What We Offer</h2>
          <ul>
            <li>High-quality LPG (Liquefied Petroleum Gas) cylinders</li>
            <li>Competitive pricing</li>
            <li>Timely delivery</li>
            <li>Expert technical support</li>
            <li>Wide distribution network</li>
          </ul>
        </section>
        <section id="products" class="products">
          <h2>Our Products & Services</h2>
          <div class="product-card">
            <h3>Gas Refilling</h3>
            <p>Refill your gas cylinder with our high-quality LPG.</p>
          </div>
          <div class="product-card">
            <h3>Online Gas Refill Order</h3>
            <p>
              Order a refill of your gas cylinders online and have it delivered
              to you.
            </p>
          </div>
          <div class="product-card">
            <h3>New Cylinder Sales</h3>
            <p>Purchase new gas cylinders from our extensive range.</p>
          </div>
          <div class="product-card">
            <h3>Gas Installation & Maintenance</h3>
            <p>
              Expert installation and maintenance services for your gas
              appliances.
            </p>
          </div>
          <div class="product-card">
            <h3>Gas Safety Consulting</h3>
            <p>Get expert advice on gas safety and usage.</p>
          </div>
        </section>
        <section id="safety" class="safety-tips">
          <h2>Safety Tips</h2>
          <ul>
            <li>Always check cylinders for leaks before use.</li>
            <li>Store cylinders upright and secure.</li>
            <li>Keep cylinders away from heat sources.</li>
            <li>Use approved regulators and hoses.</li>
          </ul>
        </section>
        <section class="testimonials">
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
        </section>
        <section id="contact" class="cta">
          <h2>Get Cooking Gas Today!</h2>
          <p>Contact us: 080 XXXX XXXX | info@dukadan.com</p>
          <button id="get-started-btn" type="button">
            Get Started
          </button>
        </section>
      </main>
    </Layout>
  );
}
