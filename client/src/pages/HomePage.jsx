import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  MessageSquareText,
  Sparkles,
  Users,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import "./Home.css";

const Home = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const features = [
    {
      icon: <Users size={18} />,
      title: "Relevant matches",
      text: "Connect with people who teach the skills you want and learn from the ones you already know.",
    },
    {
      icon: <BookOpen size={18} />,
      title: "Real skill exchange",
      text: "Turn learning into something practical through live sessions, direct feedback, and trusted peer support.",
    },
    {
      icon: <MessageSquareText size={18} />,
      title: "Clear communication",
      text: "Message, schedule, and collaborate without friction inside one focused learning environment.",
    },
  ];

  const steps = [
    "Create your profile and show your strengths.",
    "Discover people with complementary skills.",
    "Request a session and start learning together.",
  ];

  const stats = [
    { value: "1:1", label: "peer learning" },
    { value: "24/7", label: "session coordination" },
    { value: "100%", label: "human connection" },
  ];

  return (
    <div className="home-page-shell">
      <Navbar />
      <section className="hero-section">
        <div className="hero-content-wrap">
          <div className="hero-copy">
            <span className="eyebrow">Learn from people, not just courses</span>
            <h1>
              SkillSetu connects what you know with what you want to learn.
            </h1>
            <p>
              Build a stronger learning network by sharing expertise, meeting
              the right people, and turning skill exchange into everyday
              progress.
            </p>

            {!isAuthenticated && (
              <div className="cta-row">
                <Link to="/login" className="primary-btn hero-btn">
                  Login <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="secondary-btn hero-btn">
                  Create account
                </Link>
              </div>
            )}

            <div className="mini-proof">
              <div>
                <strong>2k+</strong>
                <span>community members</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>session satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-topbar">
              <span className="dot blue" />
              <span className="dot gold" />
              <span className="dot green" />
            </div>

            <div className="panel-card main">
              <div className="profile-row">
                <div className="avatar">SJ</div>
                <div>
                  <strong>Shashank</strong>
                  <small>Frontend & UX</small>
                </div>
              </div>

              <div className="skill-pair">
                <div>
                  <label>Wants to learn</label>
                  <span>React</span>
                </div>
                <div className="swap-mark">↔</div>
                <div>
                  <label>Can teach</label>
                  <span>UI Design</span>
                </div>
              </div>

              <div className="match-summary">
                <span className="pill success">
                  <CheckCircle2 size={14} /> Verified match
                </span>
                <div className="summary-row">
                  <span>Session fit</span>
                  <strong>92%</strong>
                </div>
              </div>
            </div>

            <div className="panel-card small-card">
              <div className="small-card-header">
                <Sparkles size={16} />
                <span>Why people stay</span>
              </div>
              <ul>
                <li>Flexible scheduling</li>
                <li>Trustworthy peer matches</li>
                <li>Clear session flow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span className="eyebrow dark">Why SkillSetu works</span>
          <h2>Practical learning, built around real people.</h2>
        </div>

        <div className="feature-grid">
          {features.map(({ icon, title, text }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading narrow">
          <span className="eyebrow dark">How it works</span>
          <h2>Start with one skill, grow into a full learning circle.</h2>
        </div>

        <div className="workflow-list">
          {steps.map((step, index) => (
            <div key={step} className="workflow-item">
              <div className="step-number">0{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
