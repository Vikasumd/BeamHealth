import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const agentDetails = {
  "ai-intake": {
    icon: "📋",
    title: "AI Intake",
    description: "Simplify registration with automated eligibility checks, forms, and reminders."
  },
  "ai-scribe": {
    icon: "✍️",
    title: "AI Scribe",
    description: "Capture accurate, structured clinical notes in real time."
  },
  "ai-revenue": {
    icon: "💰",
    title: "AI Revenue",
    description: "Automate coding, claims, and billing to reduce denials."
  },
  "ai-patient-acquisition": {
    icon: "🎯",
    title: "AI Patient Acquisition",
    description: "Convert referrals and leads into scheduled visits."
  },
  "ai-support": {
    icon: "🛠️",
    title: "AI Support",
    description: "Handle IT issues and admin tasks automatically."
  }
};

function AIAgentPage() {
  const { agentId } = useParams();
  const agent = agentDetails[agentId];
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);

  const aiAgents = [
    { id: "ai-intake", icon: "📋", title: "AI Intake" },
    { id: "ai-scribe", icon: "✍️", title: "AI Scribe" },
    { id: "ai-revenue", icon: "💰", title: "AI Revenue" },
    { id: "ai-patient-acquisition", icon: "🎯", title: "AI Patient Acquisition" },
    { id: "ai-support", icon: "🛠️", title: "AI Support" }
  ];

  if (!agent) {
    return (
      <div className="landing-container">
        <nav className="landing-nav">
          <div className="nav-logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">⚕️</span>
              <span className="logo-text">Beam<span>Health</span></span>
            </Link>
          </div>
        </nav>
        <section className="about-section about-page">
          <div className="about-content">
            <Link to="/" className="back-button">← Back to Home</Link>
            <h2>Page Not Found</h2>
          </div>
        </section>
      </div>
    );
  }

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
            <span className="nav-dropdown-trigger nav-active">
              Features <span className="dropdown-arrow">▾</span>
            </span>
            {showFeaturesDropdown && (
              <div className="nav-dropdown">
                {aiAgents.map(a => (
                  <Link 
                    key={a.id} 
                    to={`/${a.id}`} 
                    className={`nav-dropdown-item ${a.id === agentId ? 'active' : ''}`}
                  >
                    <span className="dropdown-item-icon">{a.icon}</span>
                    {a.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/about">About</Link>
          <a href="https://www.beam.health/#cta" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
      </nav>

      {/* Agent Content */}
      <section className="about-section about-page">
        <div className="about-content">
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>

          <div className="agent-hero">
            <div className="agent-icon-large">{agent.icon}</div>
            <h2>{agent.title}</h2>
            <p className="agent-description">{agent.description}</p>
          </div>

          <div className="founder-letter">
            <div className="coming-soon-content">
              <div className="coming-soon-icon">🚧</div>
              <h3>Coming Soon</h3>
              <p>
                We're building {agent.title} to revolutionize your healthcare practice.
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default AIAgentPage;
