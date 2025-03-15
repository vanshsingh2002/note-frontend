import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api"; // ✅ Import API function
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toast Styles

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!"); // ❌ Show error toast
      return;
    }

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Account created successfully! Redirecting..."); // ✅ Success toast
      setTimeout(() => navigate("/"), 2000); // ✅ Redirect after delay
    } catch (error) {
      toast.error("Signup failed. Try again."); // ❌ Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar /> {/* ✅ Toast Container */}

      <div className="bg-gray-950 bg-opacity-90 p-8 rounded-xl shadow-xl backdrop-blur-md w-[400px]">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create an <span className="text-blue-400">Account</span>
        </h1>
        <p className="text-gray-400 text-center mb-6">Sign up to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 outline-none bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 outline-none bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 outline-none bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg mb-4 outline-none bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
