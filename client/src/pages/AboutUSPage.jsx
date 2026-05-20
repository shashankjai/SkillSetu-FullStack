import React, { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

// Importing components
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "../components/background/Background.css";

// Import your profile image
import profileImg from "../assets/profile.png";

const AboutUsPage = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div
        className="home-hero flex-grow"
        style={{
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Hero Section */}
        <Background />

        <section className="flex flex-col justify-center text-center py-16 px-4 mt-10">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white"
          >
            About SkillSetu
          </motion.h1>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-light italic max-w-2xl mx-auto text-blue-100"
          >
            A futuristic peer-to-peer skill exchange platform, connecting
            learners and experts worldwide.
          </motion.p>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 px-6 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mission Block */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 hover:bg-white/15 transition duration-300"
          >
            <h2 className="text-2xl font-semibold mb-3 text-blue-200">Our Mission</h2>
            <p className="text-white/90 leading-relaxed">
              To empower individuals to grow through collaborative learning
              and skill-sharing communities without financial barriers.
            </p>
          </motion.div>

          {/* Vision Block */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 hover:bg-white/15 transition duration-300"
          >
            <h2 className="text-2xl font-semibold mb-3 text-blue-200">Our Vision</h2>
            <p className="text-white/90 leading-relaxed">
              A global network where anyone can teach and learn any
              skill—seamlessly, affordably, and quickly.
            </p>
          </motion.div>
        </section>

        {/* About Me (Developer) Section */}
        <section className="py-20 px-6 relative">
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>

          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-bold text-center mb-12 text-white"
            >
              Meet the Developer
            </motion.h2>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-10"
            >
              {/* Profile Image */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                {/* Increased size to w-56/h-56 (mobile) and w-72/h-72 (desktop) to fit hair better */}
                <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white/30">
                  <img
                    src={profileImg}
                    alt="Profile"
                    // Added "object-top" to prioritize the top of the image (hair)
                    className="w-full h-full object-cover object-top transform transition duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center md:text-left flex-1">
                <h3 className="text-3xl font-bold text-white mb-1">Shashank Jaiswal</h3>
                <p className="text-blue-300 font-medium mb-4 text-lg">Full Stack Developer</p>
                
                <p className="text-gray-200 leading-relaxed mb-6">
                  Hello! I am the sole developer behind SkillSetu. I built this platform 
                  with the passion to democratize education and make skill exchange accessible 
                  to everyone. When I'm not coding, I love exploring new technologies and 
                  designing user-centric experiences.
                </p>

                {/* Social Links */}
                <div className="flex justify-center md:justify-start gap-6">
                  <a 
                    href="https://www.linkedin.com/in/shashank-jaiswal-203b15289/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-white/10 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a 
                    href="https://github.com/shashankjai" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-white/10 rounded-full hover:bg-gray-700 transition duration-300"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a 
                    href="mailto:shashank3021195@gmail.com" 
                    className="p-3 bg-white/10 rounded-full hover:bg-red-500 transition duration-300"
                  >
                    <FaEnvelope size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 opacity-90"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-4xl font-extrabold mb-4 text-white"
            >
              Join the Skill Revolution
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-lg text-blue-100"
            >
              Start teaching, learning, and growing with the global SkillSetu
              community today.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg"
            >
              Explore Skills
            </motion.button>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;