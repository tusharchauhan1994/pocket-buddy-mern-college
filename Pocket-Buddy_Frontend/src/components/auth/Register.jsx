import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signUpValidation } from "../validation/formValidation";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import signupBg from "../../assets/img/signup_bg.jpg"; // Replace with food-themed image
import {
  FaGoogle,
  FaFacebook,
  FaTwitter,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUtensils
} from "react-icons/fa";
import { Loader } from "../common/Loader";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/roles");
        setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
      setIsLoading(false);
    };
    fetchRoles();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/user", data);
      if (res.status === 201) {
        toast.success("Account created successfully! Welcome to PocketBuddy!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${signupBg})`
      }}
    >
      {/* Full-Screen Loader Overlay */}
      {(isLoading || isSubmitting) && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
          <Loader />
          {/* <span className="ml-2 text-white">Preparing your foodie account...</span> */}
        </div>
      )}

      {/* Form Container with Food Theme */}
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 relative border border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white hover:text-yellow-400 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        
        {/* Food-themed header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <FaUtensils className="text-yellow-400 text-3xl mr-2" />
            <h2 className="text-3xl font-bold text-white">
              <span className="text-yellow-400">Pocket</span>Buddy
            </h2>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Join Our Foodie Community
          </h3>
          <p className="text-sm text-white/80">
            Sign up to unlock exclusive food offers!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName", signUpValidation.name)}
                className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-300">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName", signUpValidation.name)}
                className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-300">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", signUpValidation.email)}
              className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="foodie@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              I'm signing up as a
            </label>
            <select
              {...register("roleId", { required: "Please select your role" })}
              className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-800"
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="mt-1 text-xs text-red-300">
                {errors.roleId.message}
              </p>
            )}
          </div>

          {/* Password with strength meter */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", signUpValidation.password)}
                className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-10"
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-600 hover:text-yellow-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${i < getPasswordStrength() ? strengthColors[i] : "bg-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white">
                  Strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][getPasswordStrength() - 1] || ""}
                </p>
              </div>
            )}
            
            {errors.password && (
              <p className="mt-1 text-xs text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-yellow-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                {/* <Loader size="small" className="mr-2" /> */}
                Creating Account...
              </span>
            ) : (
              "Join Pocket-Buddy!"
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 hover:text-yellow-400 font-medium underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>

        {/* Social Signup */}
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-white/30"></div>
            <span className="px-3 text-sm text-white/80">or continue with</span>
            <div className="flex-1 border-t border-white/30"></div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              aria-label="Sign up with Google"
            >
              <FaGoogle className="text-red-500 text-lg" />
            </button>
            <button
              type="button"
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              aria-label="Sign up with Facebook"
            >
              <FaFacebook className="text-blue-600 text-lg" />
            </button>
            <button
              type="button"
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              aria-label="Sign up with Twitter"
            >
              <FaTwitter className="text-blue-400 text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;