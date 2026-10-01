import React, { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "../components/background/Background.css";

import profileImg from "../assets/profile.png";

const AboutUsPage = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative bg-slate-950 text-white">
      <Background />
      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          {/* Header */}
          <section className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-blue-600/20 via-sky-500/10 to-indigo-600/20 p-6 text-center shadow-[0_22px_50px_rgba(37,99,235,0.15)] backdrop-blur-xl md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              About us
            </p>
            <h1 className="brand-gradient-text mt-3 text-4xl font-black md:text-5xl">
              SkillSetu
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
              A peer-to-peer skill exchange platform connecting learners and
              experts worldwide.
            </p>
          </section>

          {/* Mission & Vision */}
          <section className="grid gap-6 py-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.25)] backdrop-blur-md">
              <h2 className="mb-2 text-xl font-semibold text-blue-400">
                Our Mission
              </h2>
              <p className="text-slate-300 leading-relaxed">
                To empower individuals to grow through collaborative learning
                and skill-sharing communities without financial barriers.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.25)] backdrop-blur-md">
              <h2 className="mb-2 text-xl font-semibold text-blue-400">
                Our Vision
              </h2>
              <p className="text-slate-300 leading-relaxed">
                A global network where anyone can teach and learn any
                skill—seamlessly, affordably, and quickly.
              </p>
            </div>
          </section>

          {/* Developer Section */}
          <section className="py-12">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              Meet the Developer
            </h2>

            <div className="flex flex-col items-center gap-8 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.25)] backdrop-blur-md md:flex-row md:p-8">
              <div className="shrink-0">
                <div className="h-48 w-48 overflow-hidden rounded-full border-2 border-blue-400/50 shadow-[0_20px_50px_rgba(59,130,246,0.25)] md:h-64 md:w-64">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">
                  Shashank Jaiswal
                </h3>
                <p className="mb-3 text-blue-400">Full Stack Developer</p>

                <p className="mb-5 text-slate-300 leading-relaxed">
                  I built <span className="brand-gradient-text">SkillSetu</span>{" "}
                  to make education accessible to everyone. This platform lets
                  people share knowledge without worrying about money. When I'm
                  not coding, I explore new technologies and design
                  user-friendly experiences.
                </p>

                <div className="flex justify-center gap-4 md:justify-start">
                  <a
                    href="https://www.linkedin.com/in/shashank-jaiswal-203b15289/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/10 p-3 text-slate-300 transition hover:bg-blue-600 hover:text-white"
                  >
                    <FaLinkedin size={22} />
                  </a>
                  <a
                    href="https://github.com/shashankjai"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/10 p-3 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                  >
                    <FaGithub size={22} />
                  </a>
                  <a
                    href="mailto:shashank3021195@gmail.com"
                    className="rounded-full bg-white/10 p-3 text-slate-300 transition hover:bg-red-600 hover:text-white"
                  >
                    <FaEnvelope size={22} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-8 text-center">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 p-8 shadow-[0_22px_50px_rgba(37,99,235,0.15)] backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Join the Skill Revolution
              </h2>
              <p className="mt-2 text-slate-300">
                Start teaching, learning, and growing with the{" "}
                <span className="brand-gradient-text">SkillSetu</span> community
                today.
              </p>
              <button className="mt-5 rounded-full bg-white px-8 py-3 font-semibold text-blue-900 transition hover:bg-slate-100">
                Explore Skills
              </button>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;
