import React, { useState } from "react";
import { Link } from "react-router-dom";

function AboutPage() {
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

                    {agent.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/about" className="nav-active">About</Link>
          <a href="https://www.beam.health/#cta" target="_blank" rel="noopener noreferrer">Contact</a>
        </div>
      </nav>

      {/* About Section */}
      <section className="about-section about-page">
        <div className="about-content">
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
          
          <div className="about-intro">
            <h2>Freeing clinicians to focus on what matters most.</h2>
            <p>
              At Beam Health, we believe clinicians should spend more time with patients, not paperwork. 
              Our AI-powered workflows streamline the entire patient journey, from intake and documentation 
              to billing, care coordination, and follow-up, reducing EMR time, unifying fragmented systems, 
              and freeing clinicians to focus on care, improve outcomes, and boost satisfaction.
            </p>
          </div>

          <div className="founder-letter">
            <h3>A Letter from Our Founder</h3>
            <div className="letter-content">
              <p>
                I started Beam Health with a simple belief: the tools designed to help clinicians should 
                actually make their work easier. Too often, the opposite has happened — technology adds 
                complexity, extra clicks, and burnout to an already overwhelming system.
              </p>
              <p><strong>Beam was built to change that.</strong></p>
              <p>
                Our mission is to simplify healthcare tech so clinicians can focus on what truly matters: 
                patient care. We embed a seamless, intelligent layer across operations, connecting fragmented 
                systems and making data flow effortlessly, giving time back to the people who matter most.
              </p>
              <p>
                Whether you're running a growing clinic or navigating multiple disconnected systems, Beam 
                helps you reclaim your day and work smarter, not harder.
              </p>
              <p>
                We're proud to support the physicians and care teams who keep our communities healthy — 
                helping them reduce friction, reclaim time, and focus on patients. And this is just the beginning.
              </p>
              <p className="letter-closing">Warmly,</p>
              <div className="founder-signature">
                <span className="founder-name">Sas Ponnapalli</span>
                <span className="founder-title">Founder & CEO, Beam Health</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2024 BeamHealth. Built for modern healthcare.</p>
      </footer>
    </div>
  );
}

export default AboutPage;
