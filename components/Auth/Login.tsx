"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import CustomInput from "../Reuasable/CustomInput";
import CustomButton from "../Reuasable/CustomButton";
import { useAdminLoginMutation } from "@/lib/redux/api/authApi";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/dashboard";

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (apiError) setApiError("");

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      setApiError("");
      await adminLogin({
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();

      router.push(redirectUrl);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      setApiError(
        errorObj?.data?.message || "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#EDF2F6] rounded-2xl min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] flex flex-col justify-center overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full min-h-full flex-1">
          {/* Form Column - Centered horizontally and vertically on all screen sizes */}
          <div className="flex w-full items-center justify-center px-4 py-8 sm:px-6 md:px-10 lg:px-12">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 md:p-10 rounded-2xl w-full max-w-[480px] shadow-sm">
              <div className="flex justify-center items-center">
                <Image
                  src="/images/authlogo.png"
                  alt="logo"
                  width={58}
                  height={58}
                  priority
                />
              </div>

              <h1 className="text-[#103D5C] text-center text-[22px] sm:text-[24px] font-semibold leading-[124%] py-1">
                Welcome Back
              </h1>

              <p className="text-[#5A5A5A] text-center text-[14px] sm:text-[16px] font-normal leading-[160%]">
                Enter your username and password to continue.
              </p>

              {apiError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="py-5 sm:py-6">
                  <div className="space-y-4">
                    <CustomInput
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      disabled={isLoading}
                      leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                    />

                    <CustomInput
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      placeholder="enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      disabled={isLoading}
                      leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      }
                    />
                  </div>

                  <Link
                    href="/forget-password"
                    className="flex justify-end mt-2 text-[#103D5C] text-right text-[13px] sm:text-[14px] font-normal leading-[100%] underline hover:text-[#0c2e46]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-4 w-4 rounded accent-[#103D5C] cursor-pointer"
                  />

                  <label
                    htmlFor="remember"
                    className="text-[#5A5A5A] text-[13px] sm:text-[14px] font-normal leading-[100%] cursor-pointer"
                  >
                    Remember the device
                  </label>
                </div>

                <div className="mt-6 mb-3">
                  <CustomButton
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer flex items-center justify-center gap-2 py-3.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </CustomButton>
                </div>
              </form>

              <div className="flex justify-center mt-2">
                <span className="text-[#5A5A5A] text-[13px] sm:text-[14px] font-normal leading-[100%]">
                  Don’t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-[#103D5C] text-[13px] sm:text-[14px] font-medium leading-[100%] underline hover:text-[#0c2e46]"
                  >
                    Sign Up Here
                  </Link>
                </span>
              </div>
            </div>
          </div>

          {/* Image Column - Hidden on md and below, visible on lg screens */}
          <div className="hidden lg:relative lg:block h-full min-h-[550px] overflow-hidden">
            <Image
              src="/images/leftimage2.png"
              alt="Mayogo login illustration"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}