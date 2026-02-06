import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginBg from "../../assets/img/login_bg.jpg";
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

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/user/login", data);
      if (res.status === 200) {
        toast.success("Login Successful!");
        const userData = res.data.data;
        localStorage.setItem("id", userData._id);
        localStorage.setItem("role", userData.roleId.name);

        if (userData.roleId.name === "User") {
          navigate("/user/dashboard");
        } else if (userData.roleId.name === "Restaurant") {
          navigate("/restaurant/dashboard");
        } else if (userData.roleId.name === "Admin") {
          navigate("/admin/dashboard");
        }
      } else {
        toast.error("Login Failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${loginBg})`
      }}
    >
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 relative border border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white hover:text-yellow-400 transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <FaUtensils className="text-yellow-400 text-3xl mr-2" />
            <h2 className="text-3xl font-bold text-white">
              <span className="text-yellow-400">Pocket</span>Buddy
            </h2>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Welcome Back Foodie!
          </h3>
          <p className="text-sm text-white/80">
            Sign in to access your foodie dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="foodie@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-2 rounded-lg bg-white/90 border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-600 hover:text-yellow-500 transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-white/90">
              <input
                type="checkbox"
                className="rounded border-white/50 bg-white/90 text-yellow-500 focus:ring-yellow-400 mr-2"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-yellow-300 hover:text-yellow-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-yellow-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-300 hover:text-yellow-400 font-medium underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>

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
              aria-label="Sign in with Google"
            >
              <FaGoogle className="text-red-500 text-lg" />
            </button>
            <button
              type="button"
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              aria-label="Sign in with Facebook"
            >
              <FaFacebook className="text-blue-600 text-lg" />
            </button>
            <button
              type="button"
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all hover:-translate-y-0.5"
              aria-label="Sign in with Twitter"
            >
              <FaTwitter className="text-blue-400 text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;