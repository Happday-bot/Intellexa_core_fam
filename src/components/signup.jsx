import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../data/url";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    linkedin: "",
    github: "",
    instagram: "",
    department: "",
    year: "",
    registerNumber: "",
    profilePhoto: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics and Communication",
    "Electrical and Electronics",
    "Mechanical",
    "Civil",
    "AI & DS",
    "Cyber Security",
  ];

  const navigate = useNavigate();

  const years = ["I", "II", "III", "IV","Faculty Coordinator"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess(false);

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    setLoading(false);
    return;
  }

  const form = new FormData();
  for (const key in formData) {
    if (formData[key]) form.append(key, formData[key]);
  }

  try {
    const res = await fetch(`${baseurl}/createaccount`, {
      method: "POST",
      body: form, // FormData automatically sets multipart/form-data
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Signup failed");

    setSuccess(true);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: "",
      linkedin: "",
      github: "",
      instagram: "",
      department: "",
      year: "",
      registerNumber: "",
      profilePhoto: null,
    });

    setTimeout(() => {
      navigate("/signin");
    }, 2500);


  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-6 flex justify-center items-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create an Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email *</label>
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

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Password *</label>
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

              <div>
                <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Register No.</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={formData.registerNumber}
                  onChange={handleChange}
                  placeholder="e.g., 21CS001"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn Profile"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="GitHub Profile"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Instagram Profile"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Birthdate & Profile Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Profile Photo</label>
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                required
                />
              </div>
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
          {success && (
            <p className="text-green-600 text-center mb-4 font-medium">
              Signup successful! Redirecting to sign in...
            </p>
          )}
          {/* Footer */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
