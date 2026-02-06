import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { Loader } from "../common/Loader";
import { toast } from "react-toastify";
import resetPasswordBg from "../../assets/img/login_bg.jpg"; // Add appropriate background image

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const password = watch("password", "");

  // Password strength indicator (matching Register page)
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

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    
    if (!tokenFromUrl) {
      toast.error("Invalid or missing reset token");
      navigate("/forgot-password");
      return;
    }

    // Basic token validation
    if (tokenFromUrl && tokenFromUrl.length > 30) {
      setToken(tokenFromUrl);
      setIsValidToken(true);
    } else {
      toast.error("Invalid reset token format");
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        "http://localhost:3000/user/reset-password",
        {
          token: token,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password reset successfully! You can now login with your new password.");
      navigate("/login");
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
      if (error.response?.status === 401) {
        navigate("/forgot-password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${resetPasswordBg})`
        }}
      >
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 relative border border-white/10">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Invalid Link</h2>
          <p className="text-white/80 mb-6">The password reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${resetPasswordBg})`
      }}
    >
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
          <Loader />
          {/* <span className="ml-2 text-white">Updating your password...</span> */}
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 relative border border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white hover:text-blue-300 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <FaLock className="text-blue-400 text-3xl mr-2" />
            <h2 className="text-3xl font-bold text-white">
              <span className="text-blue-400">Reset</span> Password
            </h2>
          </div>
          <p className="text-sm text-white/80">
            Create a new password for your Pocket-Buddy account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-600 hover:text-blue-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password strength indicator (matching Register page) */}
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-10"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-600 hover:text-blue-500 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-300">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader size="small" className="mr-2" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
            
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-blue-300 hover:text-blue-400 font-medium underline underline-offset-2"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;