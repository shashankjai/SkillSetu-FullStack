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
    <footer className="bg-white/80 backdrop-blur border-t border-blue-200 shadow-inner text-blue-900">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-12 text-base md:text-lg">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">SkillSetu</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            A collaborative platform for peer-to-peer learning and skill
            development.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-lg">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            {internalLinks.map(({ name, to }) => (
              <Link
                key={name}
                to={to}
                className="hover:text-indigo-600 transition duration-300 text-base"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="flex flex-col">
          <h3 className="text-left font-semibold text-gray-700 mb-3 text-lg">
            Connect with us
          </h3>
          <div className="flex space-x-5 mt-2 items-center">
            <a
              href="https://github.com/shashankjai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition transform hover:scale-110"
            >
              <FaGithub size={28} />
            </a>

            <a
              href="https://www.linkedin.com/in/shashank-jaiswal-203b15289/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700 transition transform hover:scale-110"
            >
              <FaLinkedin size={28} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-500 transition transform hover:scale-110"
            >
              <FaTwitter size={28} />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm py-5 border-t border-gray-200">
        © {new Date().getFullYear()} SkillSetu. All rights reserved. | Developed by{" "}
        <a
          href="https://shashankfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline font-bold text-base"
        >
          Shashank Jaiswal
        </a>
      </div>
    </footer>
  );
};

export default Footer;