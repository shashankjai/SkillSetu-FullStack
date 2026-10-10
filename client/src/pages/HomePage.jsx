// client/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  MessageSquareText,
  Users,
  CheckCircle2,
  Search,
  Compass,
  Zap,
} from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "./Home.css";

const Home = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const features = [
    {
      icon: <Users size={20} className="text-blue-400" />,
      title: "Relevant Skill Matches",
      text: "Connect with peers who teach the exact skills you want to learn, and share what you already know.",
    },
    {
      icon: <BookOpen size={20} className="text-sky-400" />,
      title: "Structured Learning Exchange",
      text: "Turn learning into practical mastery through 1-on-1 sessions, guided roadmaps, and actionable feedback.",
    },
    {
      icon: <MessageSquareText size={20} className="text-indigo-400" />,
      title: "Focused Peer Messaging",
      text: "Message, schedule sessions, and track exchange requests directly within a clean, quiet environment.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Define Your Profile",
      desc: "List skills you want to learn and skills you can teach to establish your exchange profile.",
    },
    {
      num: "02",
      title: "Discover Complementary Peers",
      desc: "Use algorithmic skill matching to find peers with complementary knowledge goals.",
    },
    {
      num: "03",
      title: "Request & Exchange Knowledge",
      desc: "Coordinate interactive sessions, exchange expertise, and build personalized roadmaps.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#0B1220] text-slate-100 flex flex-col font-sans">
      <Background />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Hero Left Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
                  <Zap size={14} className="text-blue-400" />
                  <span>Peer-to-Peer Knowledge Platform</span>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                  Master new skills through direct <span className="text-blue-500">peer exchange</span>.
                </h1>

                <p className="max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
                  SkillSetu connects what you know with what you want to learn. Trade expertise with motivated peers, build custom AI roadmaps, and accelerate your practical growth.
                </p>

                {/* CTAs */}
                <div className="hero-cta-group max-w-2xl flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Link
                    to="/skill-matching"
                    className="flex items-center gap-2 rounded-xl bg-[#3478F6] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#2563EB] transition"
                  >
                    <Search size={18} />
                    Explore Skills
                  </Link>

                  {!isAuthenticated ? (
                    <Link
                      to="/register"
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#172338] px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                    >
                      Get Started <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link
                      to="/learning-roadmap"
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#172338] px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                    >
                      <Compass size={18} />
                      View AI Roadmap
                    </Link>
                  )}
                </div>
              </div>

              {/* Hero Right Preview Card (Real Product UI Preview) */}
              <div className="lg:col-span-5">
                <div className="hero-preview-card rounded-2xl border border-slate-800 bg-[#111B2B] p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Live Match Preview
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} /> 94% Fit
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-base">
                      SJ
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Shashank J.</h3>
                      <p className="text-xs text-slate-400">Full-Stack Engineer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-[#172338] p-3 text-xs">
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">Wants to learn</span>
                      <span className="font-bold text-white mt-0.5 block">React & Next.js</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400 uppercase">Can teach</span>
                      <span className="font-bold text-blue-400 mt-0.5 block">System Architecture</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                    <span>Available for 1-on-1 sessions</span>
                    <span className="text-blue-400 font-semibold">Verified User</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How SkillSetu Works */}
        <section className="how-it-works-section border-t border-slate-800 bg-[#111B2B]/60 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
                How SkillSetu Works
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Simple, transparent 3-step workflow designed for effective peer learning.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="home-card rounded-2xl border border-slate-800 bg-[#111B2B] p-6 shadow-md space-y-3"
                >
                  <span className="text-2xl font-black text-blue-500 font-mono">
                    {step.num}
                  </span>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="features-section py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl tracking-tight">
                Designed for Practical Growth
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Focus on real skill exchanges without visual distractions or complex overhead.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="home-card rounded-2xl border border-slate-800 bg-[#111B2B] p-6 shadow-md space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172338] border border-slate-700">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
