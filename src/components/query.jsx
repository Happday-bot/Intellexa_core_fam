import React, { useState } from "react";
import { baseurl } from "../data/url";

export default function Query() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔹 New state

  const descriptions = {
    query: "Use this to point out mistakes or address a specific concern politely.",
    help: "Use this to request assistance or report an issue you’re facing.",
    suggestion: "Use this to propose ideas or improvements for our processes or events.",
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
      body: form, // 🔹 Send FormData instead of JSON
    });

    if (!response.ok) throw new Error("Failed to submit query");
    setSubmitted(true);
  }finally {
    setIsSubmitting(false);
  }
};


  const handleReset = () => {
    setFormData({ name: "", category: "", message: "" });
    setSubmitted(false);
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-6">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Raise a Query / Help / Suggestion
          </h1>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="query">Query</option>
                  <option value="help">Help</option>
                  <option value="suggestion">Suggestion</option>
                </select>

                {formData.category && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    {descriptions[formData.category]}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your concern, issue, or suggestion"
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting} // 🔹 Disabled when submitting
                className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-3">
                Thank You!
              </h2>
              <p className="text-gray-700">
                Your {formData.category} has been submitted successfully.
                We’ll get back to you shortly.
              </p>
              <button
                onClick={handleReset}
                className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                Submit Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
