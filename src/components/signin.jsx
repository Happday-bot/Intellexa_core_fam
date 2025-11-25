 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { __setCred } from "./auth/auth";
import { refetchEvents } from "../data/bootstrapStore";
import { baseurl } from "../data/url";


export default function SignIn({ setAuth }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    setError("Both fields are required.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess(false);

  try {
    const res = await fetch(`${baseurl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Login failed");
    }

    const data = await res.json();
sessionStorage.setItem("user", JSON.stringify(data.user));
__setCred(data.user);
setAuth(data.user);
refetchEvents();
setSuccess(true);
setFormData({ email: "", password: "" });

setTimeout(() => {
  if (data.user.role === "Technical Lead" && data.user.team === "Intellexa") {
    navigate("/techlead");
  } 
  else if (
    ((data.user.role === "Faculty Coordinator" || data.user.role === "Vice President" || data.user.role === "President") && data.user.team === "Intellexa") ||
    ((data.user.role === "Lead" || data.user.role === "Co-Lead" || data.user.role === "Core Member") && data.user.team === "Event")
  ) {
    navigate("/admin");
  } 
  else if (
    (data.user.role === "Lead" || data.user.role === "Co-Lead" || data.user.role === "Core Member") &&
    data.user.team === "Media"
  ) {
    navigate("/mediateam");
  } 
  else if (
    (data.user.role === "Lead" || data.user.role === "Co-Lead" || data.user.role === "Core Member") &&
    data.user.team === "Design"
  ) {
    navigate("/designteam");
  } 
  else if (
    (data.user.role === "Lead" || data.user.role === "Co-Lead" || data.user.role === "Core Member") &&
    ["AI", "App", "Web", "Backend", "Info Sec", "IOT"].includes(data.user.team)
  ) {
    navigate("/techteams");
  } 
  else {
    setSuccess(false);
    setError("Access denied: Mismatch in role or team. Contact admin.");
  }
}, 1500);

    
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-6 flex justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sign In
          </h1>

          {error && (
            <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center mb-4 font-medium">
              Login successful! Redirecting...
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
              } text-white py-2 rounded-lg font-semibold transition-all duration-300`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
