import React, { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);

  const aiAgents = [
    { id: "ai-intake", icon: "📋", title: "AI Intake" },
    { id: "ai-scribe", icon: "✍️", title: "AI Scribe" },
    { id: "ai-revenue", icon: "💰", title: "AI Revenue" },
    { id: "ai-patient-acquisition", icon: "🎯", title: "AI Patient Acquisition" },
    { id: "ai-support", icon: "🛠️", title: "AI Support" }
  ];

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
            <span className="logo-icon">⚕️</span>
            <span className="logo-text">Beam<span>Health</span></span>
        </div>
        <div className="nav-links">
          <div 
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setShowFeaturesDropdown(true)}
            onMouseLeave={() => setShowFeaturesDropdown(false)}
          >
            <span className="nav-dropdown-trigger">
              Features <span className="dropdown-arrow">▾</span>
            </span>
            {showFeaturesDropdown && (
              <div className="nav-dropdown">
                {aiAgents.map(agent => (
                  <Link 
                    key={agent.id} 
                    to={`/${agent.id}`} 
                    className="nav-dropdown-item"
                  >
                    <span className="dropdown-item-icon">{agent.icon}</span>
                    {agent.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/about">About</Link>
          <a href="https://www.beam.health/#cta" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-main">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ Streamline Your Healthcare Operations</span>
          </div>
          
          <h1 className="hero-title">
            Simplify your
            <br />
            <span className="hero-highlight">healthcare</span>
            <br />
            workflows
          </h1>
          
          <p className="hero-description">
            Manage patient intake, eligibility verification, scheduling,
            and invoicing — all in one unified platform designed for
            modern healthcare practices.
          </p>

          <div className="hero-buttons">
            <Link to="/workflow" className="btn-primary">
              <span className="btn-icon">👤</span>
              Employee Workflow
            </Link>
            <Link to="/invoices" className="btn-secondary">
              <span className="btn-icon">📄</span>
              Invoice Management
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-right">
          <div className="features-header">
            <h2>A single, integrated AI layer that works with your existing systems</h2>
            <p>Beam Health frees clinicians to focus on what matters most: delivering excellent patient care.</p>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid-simple">
            {/* Card 1 */}
            <div className="bento-card">
              <div className="card-glow-cyan"></div>
              <div className="bento-icon">⏱️</div>
              <h3>Reduce EMR time &<br/>administrative burden</h3>
              <p>Beam's AI-powered workflows cut documentation, billing, and intake time by up to 99%, freeing clinicians from tedious data entry.</p>
            </div>

            {/* Card 2 */}
            <div className="bento-card">
              <div className="bento-icon">🧩</div>
              <h3>Integrate across<br/>fragmented systems</h3>
              <p>Unlike clunky point solutions, Beam embeds directly into existing clinical systems, creating a unified, effortless data flow.</p>
            </div>

            {/* Card 3 */}
            <div className="bento-card bento-card-highlight">
              <div className="bento-icon">👨‍⚕️</div>
              <h3>Restore focus<br/>to patient care</h3>
              <p>By eliminating administrative overhead, Beam empowers clinicians to spend more meaningful time with patients.</p>
            </div>
          </div>
        </div>
      </main>


      {/* Footer */}

    </div>
  );
}

export default LandingPage;

