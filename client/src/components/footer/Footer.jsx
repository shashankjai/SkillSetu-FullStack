import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const internalLinks = [
    { name: "Home", to: "/" },
    { name: "Profile", to: "/profile" },
    { name: "Login", to: "/login" },
    { name: "Signup", to: "/register" },
    { name: "Chat", to: "/chat" },
    { name: "Skill Matching", to: "/skill-matching" },
    { name: "Settings", to: "/profile-settings" },
    { name: "About Us", to: "/about-us" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="brand-mark">S</span>
          <div>
            <h2>SkillSetu</h2>
            <p>
              A learning network built around trust, exchange, and practical
              skill growth.
            </p>
          </div>
        </div>

        <div>
          <h3>Explore</h3>
          <div className="footer-links">
            {internalLinks.map(({ name, to }) => (
              <Link key={name} to={to}>
                {name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3>Connect</h3>
          <div className="social-row">
            <a
              href="https://github.com/shashankjai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/shashank-jaiswal-203b15289/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SkillSetu. All rights reserved. | Developed
        by{" "}
        <a
          href="https://shashankfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shashank Jaiswal
        </a>
      </div>
    </footer>
  );
};

export default Footer;
