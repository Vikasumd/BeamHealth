import React from "react";
import { Link } from "react-router-dom";

function InvoiceManagement() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Invoice <span>Management</span></h1>
        <p className="subtitle">
          Track, create, and manage invoices for your healthcare practice
        </p>
      </header>

      <main className="app-main">
        <section className="card coming-soon-card">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">🚧</div>
            <h2>Coming Soon</h2>
            <p>
              We're building a powerful invoice management system that will allow you to:
            </p>
            <ul className="feature-list">
              <li>✓ Create and send professional invoices</li>
              <li>✓ Track payment status in real-time</li>
              <li>✓ Integrate with insurance claims</li>
              <li>✓ Generate financial reports</li>
              <li>✓ Automated payment reminders</li>
            </ul>
            <Link to="/" className="primary-btn">
              Return to Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InvoiceManagement;
