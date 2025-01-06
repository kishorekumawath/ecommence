import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Title } from "../components/Title";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Get the return URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get("returnTo") || "/";

  const validateForm = () => {
    let newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!phone.trim()) newErrors.phone = "Phone Number is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (minimum 6 characters)
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Phone number validation (only digits, length 10)
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    try {
      await signup(firstName, lastName, email, password, phone);
      // After successful signup, redirect to the return URL
      navigate(returnTo, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  return (
    <div className="h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <div className="text-center text-2xl flex flex-col justify-around items-center mb-5">
          <Title text1="SIGN" text2=" UP" />
        </div>

        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="text-red-600 text-sm text-center mb-3">
              {errors.form}
            </div>
          )}
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex gap-3">
              <div className="w-full">
                <input
                  className={`border rounded py-1.5 px-3.5 w-full ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div className="w-full">
                <input
                  className={`border rounded py-1.5 px-3.5 w-full ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

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

            <div>
              <input
                className={`border rounded py-1.5 px-3.5 w-full ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create account
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" className="text-gray-400">
            Already have an account?{" "}
            <span className="text-orange-400">Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
