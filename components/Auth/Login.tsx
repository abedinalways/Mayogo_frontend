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
    <div>
      <div className="bg-[#EDF2F6] rounded-2xl flex h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <div className="flex justify-center items-center">
            <div className="bg-[#FFFFFF] p-12 rounded-xl w-full max-w-135 min-w-90 shrink-0">
              <div className="flex justify-center items-center">
                <Image
                  src="/images/authlogo.png"
                  alt="logo"
                  width={58}
                  height={58}
                />
              </div>

              <p className="text-[#103D5C] text-center text-[24px] font-semibold leading-[124%] py-1">
                Welcome Back
              </p>

              <p className="text-[#5A5A5A] text-center text-[16px] font-normal leading-[160%]">
                Enter your username and password to continue.
              </p>

              {apiError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="py-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <CustomInput
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        disabled={isLoading}
                        className="pl-10"
                      />

                      <Mail className="absolute left-3 top-11.5 h-4 w-4 text-gray-400" />
                    </div>

                    <div className="relative">
                      <CustomInput
                        name="password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        disabled={isLoading}
                        className="pl-10"
                      />

                      <Lock className="absolute left-3 top-10.5 h-4 w-4 text-gray-400" />

                      {showPassword ? (
                        <Eye
                          className="absolute right-3 top-11.25 h-4 w-4 cursor-pointer text-gray-400"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-3 top-11.25 h-4 w-4 cursor-pointer text-gray-400"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>

                  <Link
                    href="/forget-password"
                    className="flex justify-end mt-1.5 text-[#103D5C] text-right text-[14px] font-normal leading-[100%] underline"
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
                    className="h-4 w-4 accent-[#103D5C]"
                  />

                  <label
                    htmlFor="remember"
                    className="text-[#5A5A5A] text-[14px] font-normal leading-[100%]"
                  >
                    Remember the device
                  </label>
                </div>

                <div className="mt-6 mb-3">
                  <CustomButton
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer flex items-center justify-center gap-2"
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

              <div className="flex justify-center">
                <span className="text-[#5A5A5A] text-[14px] font-normal leading-[100%]">
                  Don’t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-[#103D5C] text-[14px] font-medium leading-[100%]"
                  >
                    Sign Up Here
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pb-4 lg:mt-0 lg:pb-0">
            <div className="relative min-h-180 overflow-hidden rounded-2xl lg:min-h-full lg:rounded-none">
              <Image
                src="/images/leftimage2.png"
                alt="logo"
                fill
                priority
                className="rounded-2xl object-center lg:rounded-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}