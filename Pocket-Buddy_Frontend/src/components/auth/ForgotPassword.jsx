import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordValidation } from "../validation/formValidation";
import { useNavigate, Link } from "react-router-dom";
import loginBg from "../../assets/img/login_bg.jpg";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/user/forgot-password", {
        email: data.email
      });

      toast.success("Password reset link sent to your email!");
      console.log("Reset Password Response:", response.data);
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 relative">
        {/* Back Arrow Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2 text-white text-2xl hover:text-gray-300 transition-all"
        >
          <FaArrowLeft />
        </button>

        <h3 className="text-2xl font-bold mb-4 text-center text-white">
          Forgot Password
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block font-medium text-white">Email</label>
          <input
            type="email"
            {...register("email", forgotPasswordValidation.email)}
            className="w-full border p-2 rounded mt-1 mb-2 bg-white/80"
            placeholder="Enter your registered email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <p className="mt-3 text-center text-sm text-white">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;