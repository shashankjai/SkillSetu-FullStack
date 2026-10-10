// client/src/pages/RoadmapPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Background from "../components/background/Background";
import Footer from "../components/footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Compass,
  Sparkles,
  Clock,
  Target,
  BookOpen,
  CheckCircle2,
  Circle,
  Trash2,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  Code,
  GraduationCap,
  FileText,
  Zap,
  Check,
  ArrowRight,
  BookMarked,
  BrainCircuit,
  ListCheck,
  CheckSquare,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

const LOADING_TIPS = [
  "Analyzing prerequisite concepts and mental models...",
  "Sequencing curriculum phases by foundational dependency...",
  "Budgeting study hours across exercises and projects...",
  "Architecting real-world capstone project deliverables...",
  "Curating self-assessment criteria and recommended resources...",
];

const RoadmapPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form Inputs
  const initialSkill = searchParams.get("skill") || "";
  const [targetSkill, setTargetSkill] = useState(initialSkill);
  const [currentLevel, setCurrentLevel] = useState("beginner");
  const [studyTime, setStudyTime] = useState("5 hours/week");
  const [learningGoal, setLearningGoal] = useState("");
  const [existingKnowledge, setExistingKnowledge] = useState("");

  // Search Filter for Saved Roadmaps
  const [searchFilter, setSearchFilter] = useState("");

  // Loading & Data State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Accordion State for Phases
  const [expandedPhases, setExpandedPhases] = useState({});

  // Topic Checkmarks Tracking State: map of "phaseIdx-topicIdx" -> boolean
  const [completedTopics, setCompletedTopics] = useState({});

  const token = localStorage.getItem("token");

  // Tip cycle interval during loading
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Fetch saved roadmaps on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSavedRoadmaps();
  }, [token, navigate]);

  const fetchSavedRoadmaps = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await axios.get(`${API_URL}/api/roadmaps`, {
        headers: { "x-auth-token": token },
      });
      setSavedRoadmaps(res.data);
      if (res.data.length > 0 && !currentRoadmap && !initialSkill) {
        selectRoadmap(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load saved roadmaps:", err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const selectRoadmap = (roadmap) => {
    setCurrentRoadmap(roadmap);
    // Expand all phases by default for selected roadmap
    const expandAll = {};
    roadmap.phases?.forEach((_, i) => (expandAll[i] = true));
    setExpandedPhases(expandAll);
    setCompletedTopics({});
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetSkill.trim()) {
      toast.error("Please enter a target skill");
      return;
    }

    setIsGenerating(true);
    setLoadingTipIndex(0);

    try {
      const res = await axios.post(
        `${API_URL}/api/roadmaps/generate`,
        {
          targetSkill: targetSkill.trim(),
          currentLevel,
          studyTime,
          learningGoal: learningGoal.trim(),
          existingKnowledge: existingKnowledge.trim(),
        },
        {
          headers: { "x-auth-token": token },
        }
      );

      selectRoadmap(res.data);
      // Prepend to saved list
      setSavedRoadmaps((prev) => [res.data, ...prev]);

      toast.success("AI Learning Roadmap generated successfully!", {
        style: {
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          color: "#fff",
          borderRadius: "14px",
          fontWeight: 700,
        },
      });
    } catch (err) {
      console.error("Roadmap generation failed:", err);
      toast.error(
        err.response?.data?.msg || "Failed to generate roadmap. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteRoadmap = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saved roadmap?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/roadmaps/${id}`, {
        headers: { "x-auth-token": token },
      });

      const updated = savedRoadmaps.filter((r) => r._id !== id);
      setSavedRoadmaps(updated);

      if (currentRoadmap?._id === id) {
        if (updated.length > 0) {
          selectRoadmap(updated[0]);
        } else {
          setCurrentRoadmap(null);
        }
      }
      toast.info("Roadmap deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete roadmap");
    }
  };

  const togglePhase = (index) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAllPhases = (expand) => {
    if (!currentRoadmap?.phases) return;
    const newState = {};
    currentRoadmap.phases.forEach((_, i) => {
      newState[i] = expand;
    });
    setExpandedPhases(newState);
  };

  const toggleTopicCheck = (phaseIdx, topicIdx) => {
    const key = `${phaseIdx}-${topicIdx}`;
    setCompletedTopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtered saved roadmaps
  const filteredSaved = useMemo(() => {
    if (!searchFilter.trim()) return savedRoadmaps;
    const q = searchFilter.toLowerCase();
    return savedRoadmaps.filter(
      (r) =>
        r.targetSkill?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.currentLevel?.toLowerCase().includes(q)
    );
  }, [savedRoadmaps, searchFilter]);

  // Total topics count & completion percentage
  const { totalTopicsCount, completedTopicsCount, progressPercentage } =
    useMemo(() => {
      if (!currentRoadmap?.phases)
        return { totalTopicsCount: 0, completedTopicsCount: 0, progressPercentage: 0 };

      let total = 0;
      let completed = 0;

      currentRoadmap.phases.forEach((phase, pIdx) => {
        phase.topics?.forEach((_, tIdx) => {
          total++;
          if (completedTopics[`${pIdx}-${tIdx}`]) {
            completed++;
          }
        });
      });

      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { totalTopicsCount: total, completedTopicsCount: completed, progressPercentage: pct };
    }, [currentRoadmap, completedTopics]);

  return (
    <div className="min-h-screen relative bg-slate-950 text-white font-sans">
      <Background />
      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* Header Banner */}
          <div className="mb-8 rounded-[28px] border border-blue-500/20 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 shadow-[0_22px_50px_rgba(15,23,42,0.6)] backdrop-blur-xl md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Compass size={20} />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    AI Curriculum Architect
                  </p>
                </div>
                <h1 className="mt-3 text-3xl font-black text-white md:text-5xl tracking-tight">
                  Personalized Learning Roadmap
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base leading-relaxed">
                  Generate structured, prerequisite-ordered learning paths tailored to your experience level, available study hours, and specific goals.
                </p>
              </div>

              {currentRoadmap && (
                <div className="flex items-center gap-3 self-end">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 px-3.5 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10"
                  >
                    <FileText size={14} />
                    Export / Print
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Generator Form & Saved List */}
            <div className="space-y-6 lg:col-span-5">
              {/* Generator Card */}
              <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-sky-400" />
                    <h2 className="text-lg font-bold text-white">
                      Architect Your Roadmap
                    </h2>
                  </div>
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-400">
                    AI Powered
                  </span>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  {/* Target Skill */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Target Skill / Technology *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. React.js, Python, Docker, Machine Learning"
                        value={targetSkill}
                        onChange={(e) => setTargetSkill(e.target.value)}
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Current Level */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Current Experience Level *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["beginner", "intermediate", "advanced"].map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setCurrentLevel(lvl)}
                          className={`rounded-xl border py-2.5 text-xs font-bold capitalize transition ${
                            currentLevel === lvl
                              ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Study Time */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Weekly Study Commitment *
                    </label>
                    <select
                      value={studyTime}
                      onChange={(e) => setStudyTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="3-5 hours/week">3 - 5 hours / week (Casual pace)</option>
                      <option value="5-10 hours/week">5 - 10 hours / week (Standard pace)</option>
                      <option value="10-15 hours/week">10 - 15 hours / week (Focused learning)</option>
                      <option value="20+ hours/week">20+ hours / week (Intensive bootcamp)</option>
                    </select>
                  </div>

                  {/* Optional Goal */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Target Outcome / Goal (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pass technical SDE interview, build a SaaS MVP"
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Optional Existing Knowledge */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Known Prerequisites / Skills (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Basic HTML/CSS, Python syntax, Git basics"
                      value={existingKnowledge}
                      onChange={(e) => setExistingKnowledge(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Architecting Curriculum...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate AI Roadmap
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Saved Roadmaps List Card */}
              <div className="rounded-[24px] border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-sky-400" />
                    <h3 className="text-base font-bold text-white">
                      Saved Roadmaps ({savedRoadmaps.length})
                    </h3>
                  </div>
                  <button
                    onClick={fetchSavedRoadmaps}
                    title="Refresh saved roadmaps"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>

                {/* Filter Search Input */}
                {savedRoadmaps.length > 3 && (
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filter saved roadmaps..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                {isLoadingSaved ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Loading saved roadmaps...
                  </div>
                ) : filteredSaved.length > 0 ? (
                  <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                    {filteredSaved.map((r) => {
                      const isSelected = currentRoadmap?._id === r._id;
                      return (
                        <div
                          key={r._id}
                          onClick={() => selectRoadmap(r)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                            isSelected
                              ? "border-blue-500 bg-blue-950/40 text-white shadow-md shadow-blue-500/10"
                              : "border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="truncate text-sm font-bold text-white">
                                {r.targetSkill}
                              </h4>
                              <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-sky-300 uppercase">
                                {r.currentLevel}
                              </span>
                            </div>
                            <p className="truncate text-xs text-slate-400 mt-0.5">
                              {r.studyTime} {r.learningGoal ? `• ${r.learningGoal}` : ""}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteRoadmap(r._id, e)}
                            className="ml-2 shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition"
                            title="Delete roadmap"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-6 text-center text-xs text-slate-500">
                    {searchFilter ? "No roadmaps match your search." : "No saved roadmaps yet. Generate your first one above!"}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Active Roadmap Display */}
            <div className="lg:col-span-7">
              {isGenerating ? (
                /* Skeleton Loader State */
                <div className="space-y-6 rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 md:p-8 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-24 animate-pulse rounded-full bg-blue-600/30" />
                    <div className="h-6 w-32 animate-pulse rounded-full bg-slate-800" />
                  </div>
                  <div className="h-10 w-3/4 animate-pulse rounded-xl bg-slate-800" />
                  <div className="h-16 w-full animate-pulse rounded-xl bg-slate-800/60" />

                  <div className="rounded-2xl border border-blue-500/30 bg-blue-950/30 p-4 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      <BrainCircuit className="animate-spin" size={20} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      AI Architect in Progress
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {LOADING_TIPS[loadingTipIndex]}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-24 w-full animate-pulse rounded-2xl bg-slate-800/40 border border-slate-800"
                      />
                    ))}
                  </div>
                </div>
              ) : currentRoadmap ? (
                <div className="space-y-6">
                  {/* Roadmap Overview Card */}
                  <div className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md md:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                        {currentRoadmap.currentLevel} Level
                      </span>
                      <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                        <Clock size={12} className="mr-1 inline text-slate-400" />
                        {currentRoadmap.studyTime}
                      </span>
                      {currentRoadmap.learningGoal && (
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-300">
                          <Target size={12} className="mr-1 inline text-emerald-400" />
                          {currentRoadmap.learningGoal}
                        </span>
                      )}
                      {currentRoadmap.existingKnowledge && (
                        <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-3 py-1 text-xs font-medium text-sky-300">
                          <GraduationCap size={12} className="mr-1 inline text-sky-400" />
                          Prereqs: {currentRoadmap.existingKnowledge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-black text-white md:text-3xl tracking-tight">
                      {currentRoadmap.title}
                    </h2>

                    {currentRoadmap.summary && (
                      <p className="mt-3 text-sm text-slate-300 leading-relaxed border-l-2 border-blue-500 pl-3">
                        {currentRoadmap.summary}
                      </p>
                    )}

                    {/* Interactive Topic Progress Tracker */}
                    {totalTopicsCount > 0 && (
                      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ListCheck size={16} className="text-blue-400" />
                            <span className="text-xs font-bold text-slate-200">
                              Topic Mastery Tracker
                            </span>
                          </div>
                          <span className="text-xs font-bold text-blue-400">
                            {completedTopicsCount} / {totalTopicsCount} topics ({progressPercentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sequential Phases Header & Expand Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <Layers size={16} className="text-sky-400" />
                        Curriculum Phases ({currentRoadmap.phases?.length || 0})
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => toggleAllPhases(true)}
                          className="text-slate-400 hover:text-white"
                        >
                          Expand All
                        </button>
                        <span className="text-slate-700">•</span>
                        <button
                          type="button"
                          onClick={() => toggleAllPhases(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          Collapse All
                        </button>
                      </div>
                    </div>

                    {currentRoadmap.phases?.map((phase, pIdx) => {
                      const isExpanded = expandedPhases[pIdx] ?? true;

                      return (
                        <div
                          key={`phase-${pIdx}`}
                          className="overflow-hidden rounded-[24px] border border-slate-800 bg-slate-900/90 shadow-lg backdrop-blur-md transition hover:border-slate-700"
                        >
                          {/* Phase Header (Accordion Toggle) */}
                          <button
                            type="button"
                            onClick={() => togglePhase(pIdx)}
                            className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-800/40"
                          >
                            <div className="flex items-center gap-4">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-600/20 text-base font-black text-blue-300">
                                {phase.phaseNumber || pIdx + 1}
                              </span>
                              <div>
                                <h4 className="text-base font-extrabold text-white md:text-lg">
                                  {phase.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-medium text-sky-400">
                                    <Clock size={11} className="mr-1 inline" />
                                    {phase.duration}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp size={20} className="text-slate-400" />
                            ) : (
                              <ChevronDown size={20} className="text-slate-400" />
                            )}
                          </button>

                          {/* Phase Detail Content */}
                          {isExpanded && (
                            <div className="border-t border-slate-800/80 p-5 space-y-5 bg-slate-950/40">
                              {/* Learning Objectives */}
                              {phase.learningObjectives?.length > 0 && (
                                <div>
                                  <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Target size={14} className="text-blue-400" />
                                    Learning Objectives
                                  </h5>
                                  <ul className="space-y-1.5">
                                    {phase.learningObjectives.map((obj, oIdx) => (
                                      <li
                                        key={`obj-${oIdx}`}
                                        className="flex items-start gap-2 text-xs text-slate-200"
                                      >
                                        <ArrowRight size={12} className="mt-0.5 shrink-0 text-blue-400" />
                                        <span>{obj}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Core Topics with Checkboxes */}
                              {phase.topics?.length > 0 && (
                                <div>
                                  <h5 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <BookMarked size={14} className="text-sky-400" />
                                    Topics & Subtopics
                                  </h5>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {phase.topics.map((topic, tIdx) => {
                                      const isChecked = completedTopics[`${pIdx}-${tIdx}`];
                                      return (
                                        <div
                                          key={`topic-${tIdx}`}
                                          onClick={() => toggleTopicCheck(pIdx, tIdx)}
                                          className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-xs transition ${
                                            isChecked
                                              ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                                              : "border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700"
                                          }`}
                                        >
                                          <button type="button" className="mt-0.5 shrink-0">
                                            {isChecked ? (
                                              <CheckCircle2 size={15} className="text-emerald-400" />
                                            ) : (
                                              <Circle size={15} className="text-slate-500" />
                                            )}
                                          </button>
                                          <span className={isChecked ? "line-through text-slate-400" : ""}>
                                            {topic}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Practical Exercises & Coding Questions */}
                              {(phase.practicalExercises?.length > 0 || phase.codingQuestions?.length > 0) && (
                                <div>
                                  <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Zap size={14} className="text-amber-400" />
                                    Hands-On Exercises & Coding Challenges
                                  </h5>
                                  <div className="space-y-2">
                                    {phase.practicalExercises?.map((ex, eIdx) => (
                                      <div
                                        key={`ex-${eIdx}`}
                                        className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200"
                                      >
                                        <strong className="text-amber-300">⚡ Practice:</strong> {ex}
                                      </div>
                                    ))}
                                    {phase.codingQuestions?.map((q, qIdx) => (
                                      <div
                                        key={`cq-${qIdx}`}
                                        className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3 text-xs text-indigo-200"
                                      >
                                        <strong className="text-indigo-300">💻 Coding Question:</strong> {q}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Suggested Projects */}
                              {phase.suggestedProjects?.length > 0 && (
                                <div>
                                  <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Code size={14} className="text-blue-400" />
                                    Phase Project
                                  </h5>
                                  {phase.suggestedProjects.map((proj, prIdx) => (
                                    <div
                                      key={`proj-${prIdx}`}
                                      className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-3.5 text-xs font-medium text-blue-200"
                                    >
                                      🚀 <strong className="text-white">Project Idea:</strong> {proj}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Checkpoint Criteria */}
                              {phase.checkpointCriteria?.length > 0 && (
                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-3.5">
                                  <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                    <CheckSquare size={14} />
                                    Phase Checkpoint (Readiness Criteria)
                                  </h5>
                                  <ul className="space-y-1">
                                    {phase.checkpointCriteria.map((chk, cIdx) => (
                                      <li key={`chk-${cIdx}`} className="flex items-center gap-2 text-xs text-emerald-200">
                                        <Check size={12} className="text-emerald-400 shrink-0" />
                                        <span>{chk}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Recommended Resources */}
                              {phase.recommendedResources?.length > 0 && (
                                <div>
                                  <h5 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Recommended Learning Resources
                                  </h5>
                                  <ul className="space-y-1">
                                    {phase.recommendedResources.map((res, rIdx) => (
                                      <li key={`res-${rIdx}`} className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <BookOpen size={12} className="text-sky-400 shrink-0" />
                                        <span>{res}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Comprehensive Capstone Project & Mastery Section */}
                  {currentRoadmap.capstoneProject?.title || currentRoadmap.finalMilestone ? (
                    <div className="rounded-[28px] border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 p-6 shadow-xl backdrop-blur-md md:p-8 space-y-6">
                      <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
                        <Award size={32} className="shrink-0 text-amber-400" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Capstone & Mastery Strategy
                          </p>
                          <h3 className="text-xl font-black text-white">
                            {currentRoadmap.capstoneProject?.title || "Real-World Capstone Milestone"}
                          </h3>
                        </div>
                      </div>

                      {currentRoadmap.capstoneProject?.description && (
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {currentRoadmap.capstoneProject.description}
                        </p>
                      )}

                      {/* Capstone Deliverables */}
                      {currentRoadmap.capstoneProject?.deliverables?.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                            Capstone Deliverables
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {currentRoadmap.capstoneProject.deliverables.map((del, dIdx) => (
                              <div
                                key={`del-${dIdx}`}
                                className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 text-xs text-amber-100"
                              >
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-amber-400" />
                                <span>{del}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Self-Assessment & Revision Plan */}
                      <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-800">
                        {currentRoadmap.selfAssessmentChecklist?.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                              Self-Assessment Checklist
                            </h4>
                            <ul className="space-y-1.5">
                              {currentRoadmap.selfAssessmentChecklist.map((item, iIdx) => (
                                <li key={`sa-${iIdx}`} className="flex items-start gap-2 text-xs text-slate-300">
                                  <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {currentRoadmap.revisionPlan?.length > 0 && (
                          <div>
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                              Revision & Retention Strategy
                            </h4>
                            <ul className="space-y-1.5">
                              {currentRoadmap.revisionPlan.map((rev, rIdx) => (
                                <li key={`rev-${rIdx}`} className="flex items-start gap-2 text-xs text-slate-300">
                                  <RotateCcw size={13} className="mt-0.5 shrink-0 text-sky-400" />
                                  <span>{rev}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Next Recommended Step */}
                      {currentRoadmap.nextRecommendedStep && (
                        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/40 p-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Next Recommended Action
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-200">
                            {currentRoadmap.nextRecommendedStep}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : (
                /* Empty Selection State */
                <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-md">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Compass size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Roadmap Selected</h3>
                  <p className="mt-2 max-w-md text-sm text-slate-400 leading-relaxed">
                    Fill out the parameters on the left to design a customized, AI-driven learning curriculum matching your exact goals and experience level.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default RoadmapPage;
