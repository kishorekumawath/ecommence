import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Title } from "../components/Title";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth(); // 🔥 Use `login` instead of `signup`
  const navigate = useNavigate();
  const location = useLocation();
  // Get the return URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/";
  const validateForm = () => {
    let newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(email, password); // 🔥 Use `login` method
      // After successful login, redirect to the return URL
      navigate(returnTo, { replace: true });
    } catch (err) {
      setErrors({ form: "Failed to log in. Please check your credentials." });
    }
  };

  return (
    <div className="h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <div className="text-center text-2xl flex flex-col justify-around items-center mb-5">
          <Title text1="SIGN" text2=" IN" />
        </div>

        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="text-red-600 text-sm text-center mb-3">
              {errors.form}
            </div>
          )}
          <div className="flex flex-col gap-3 mb-5">
            <div>
              <input
                className={`border rounded py-1.5 px-3.5 w-full ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                className={`border rounded py-1.5 px-3.5 w-full ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/signup" className="text-gray-400">
            Create a new account?{" "}
            <span className="text-orange-400">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
