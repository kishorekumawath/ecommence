// import React, { useState } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Title } from "../components/Title";

// export default function Signup() {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [errors, setErrors] = useState({});
//   const { signup } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   // Get the return URL from query parameters
//   const searchParams = new URLSearchParams(location.search);
//   const returnTo = searchParams.get("returnTo") || "/";

//   const validateForm = () => {
//     let newErrors = {};

//     if (!firstName.trim()) newErrors.firstName = "First Name is required";
//     if (!lastName.trim()) newErrors.lastName = "Last Name is required";
//     if (!email.trim()) newErrors.email = "Email is required";
//     if (!password.trim()) newErrors.password = "Password is required";
//     if (!phone.trim()) newErrors.phone = "Phone Number is required";

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email && !emailRegex.test(email)) {
//       newErrors.email = "Invalid email format";
//     }

//     // Password validation (minimum 6 characters)
//     if (password && password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     // Phone number validation (only digits, length 10)
//     const phoneRegex = /^[0-9]{10}$/;
//     if (phone && !phoneRegex.test(phone)) {
//       newErrors.phone = "Phone number must be 10 digits";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return; // Stop submission if validation fails

//     try {
//       await signup(firstName, lastName, email, password, phone);
//       // After successful signup, redirect to the return URL
//       navigate(returnTo, { replace: true });
//     } catch (err) {
//       setErrors({ form: err.message });
//     }
//   };

//   return (
//     <div className="h-[70vh] flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
//         <div className="text-center text-2xl flex flex-col justify-around items-center mb-5">
//           <Title text1="SIGN" text2=" UP" />
//         </div>

//         <form onSubmit={handleSubmit}>
//           {errors.form && (
//             <div className="text-red-600 text-sm text-center mb-3">
//               {errors.form}
//             </div>
//           )}
//           <div className="flex flex-col gap-3 mb-5">
//             <div className="flex gap-3">
//               <div className="w-full">
//                 <input
//                   className={`border rounded py-1.5 px-3.5 w-full ${
//                     errors.firstName ? "border-red-500" : "border-gray-300"
//                   }`}
//                   type="text"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   placeholder="First Name"
//                 />
//                 {errors.firstName && (
//                   <p className="text-red-500 text-xs">{errors.firstName}</p>
//                 )}
//               </div>
//               <div className="w-full">
//                 <input
//                   className={`border rounded py-1.5 px-3.5 w-full ${
//                     errors.lastName ? "border-red-500" : "border-gray-300"
//                   }`}
//                   type="text"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   placeholder="Last Name"
//                 />
//                 {errors.lastName && (
//                   <p className="text-red-500 text-xs">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <input
//                 className={`border rounded py-1.5 px-3.5 w-full ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email Address"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs">{errors.email}</p>
//               )}
//             </div>

//             <div>
//               <input
//                 className={`border rounded py-1.5 px-3.5 w-full ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 }`}
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs">{errors.password}</p>
//               )}
//             </div>

//             <div>
//               <input
//                 className={`border rounded py-1.5 px-3.5 w-full ${
//                   errors.phone ? "border-red-500" : "border-gray-300"
//                 }`}
//                 type="text"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 placeholder="Phone Number"
//               />
//               {errors.phone && (
//                 <p className="text-red-500 text-xs">{errors.phone}</p>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Create account
//           </button>
//         </form>

//         <div className="text-center mt-2">
//           <Link to="/login" className="text-gray-400">
//             Already have an account?{" "}
//             <span className="text-orange-400">Sign in</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/NewAuthContext";
import { Title } from "../components/Title";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = new URLSearchParams(location.search).get("returnTo") || "/";

  // Debounced password strength checker
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.password) {
        checkPasswordStrength(formData.password);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.password]);

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 3) feedback.push("Add uppercase, numbers, or symbols");
    if (password.length < 8) feedback.push("Make it longer");

    setPasswordStrength({
      score,
      feedback: feedback.join(", "),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[\d\s\-+()]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";

    if (!formData.email.trim()) {
      newErrors.email = "Required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Required";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password not strong enough";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.phone
      );
      navigate(returnTo, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || "Signup failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Title text1="SIGN" text2=" UP" />
          <p className="mt-2 text-sm text-gray-600">
            Join us to get started with your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.form && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.form}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formData.password && (
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded">
                    <div
                      className={`h-1 rounded transition-all ${getPasswordStrengthColor()}`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>
                  {passwordStrength.feedback && (
                    <p className="mt-1 text-xs text-gray-500">
                      {passwordStrength.feedback}
                    </p>
                  )}
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-orange-300 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create account"
            )}
          </button>

          <div className="text-center text-sm">
            <Link
              to="/login"
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Already have an account?{" "}
              <span className="text-orange-400 hover:text-orange-500">
                Sign in
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
