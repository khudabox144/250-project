"use client";
import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

// Reusable Input Component with Icon (included for self-contained file)
const FormInput = ({
  Icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  focusColor = "purple",
}) => (
  <div className="relative">
    <label htmlFor={name} className="sr-only">
      {placeholder}
    </label>
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <input
      id={name}
      name={name}
      type={type}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`appearance-none block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-${focusColor}-500 focus:border-${focusColor}-500 text-sm transition duration-150 ease-in-out`}
    />
  </div>
);

// Login Form Component
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setMessage("Email and password are required for login.");
        return;
      }
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/auth/login`,
        formData
      );
      const user = res.data?.data?.user;
      const token = res.data?.data?.token;

      if (user && token){
        localStorage.setItem("user",JSON.stringify(user));
        localStorage.setItem("accessToken",token);
        console.log("user and token saved",user,token);
        //role based access 
        if(user.role=="admin"){
          router.push('/admin');
        }else{
          router.push('/');
        }
      }else{
        console.error("Login responsse missing user/token ",res.data);
        setMessage("login failed : Invalid response from server. ");
      }

      
    } catch (error) {
      console.error("Login Error:", error);
      // Prefer server-provided message when available
      const serverMsg = error?.response?.data?.message || error?.response?.data?.message || error?.message;
      setMessage(`Login failed: ${serverMsg || "Please check your credentials."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-3xl rounded-xl overflow-hidden transform transition-all duration-700 hover:shadow-4xl hover:scale-[1.005]">
      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <LogIn className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
        </div>

        {/* Form */}
        <form className="space-y-6 text-black" onSubmit={handleLogin}>
          {/* Email */}
          <FormInput
            Icon={Mail}
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          {/* Password */}
          <FormInput
            Icon={Lock}
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Message Area */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium ${
                message.includes("Success")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] active:shadow-inner"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Placeholder for link to Registration */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <Link
              href="/auth/register" // Replace with Next.js <Link href>
              className="ml-2 font-medium text-purple-600 hover:text-purple-500 transition duration-150 ease-in-out focus:outline-none"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
