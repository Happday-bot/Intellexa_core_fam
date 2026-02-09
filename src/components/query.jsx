import React, { useState } from "react";
import { baseurl } from "../data/url";
import { motion, AnimatePresence } from "framer-motion";

export default function Query() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptions = {
    query: "Address a specific concern or report a mistake politely.",
    help: "Request assistance or report a technical issue.",
    suggestion: "Propose new ideas to improve our events and processes.",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.message || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("message", formData.message);

      const response = await fetch(`${baseurl}/submit_query`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) throw new Error("Failed to submit query");
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", category: "", message: "" });
    setSubmitted(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display text-gradient">
            Connect With Us
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Have a question or suggestion? We're here to listen and help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto glass-effect rounded-[2.5rem] p-10 md:p-12 shadow-premium border border-white/40"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-white/50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="query">General Query</option>
                      <option value="help">Technical Help</option>
                      <option value="suggestion">New Suggestion</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.category && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-slate-400 mt-3 italic font-medium"
                      >
                        ✨ {descriptions[formData.category]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you today?"
                    rows="5"
                    className="w-full bg-white/50 border border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300 resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${isSubmitting
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "premium-gradient text-white hover:scale-[1.02] active:scale-[0.98] shadow-indigo-200"
                    }`}
                >
                  {isSubmitting ? "Sending..." : "Submit Message"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-8 ring-emerald-50">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4 font-display">
                  Message Sent!
                </h2>
                <p className="text-slate-500 text-lg font-medium mb-10 max-w-sm mx-auto">
                  Your {formData.category} has been received. Our team will get back to you soon.
                </p>
                <button
                  onClick={handleReset}
                  className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Send Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
