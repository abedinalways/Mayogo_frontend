"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../Reuasable/CustomButton";
import CustomInput from "../Reuasable/CustomInput";
import { CiUser } from "react-icons/ci";

type PasswordField = "password" | "confirmPassword";

const initialForm = { fullName: "", email: "", password: "", confirmPassword: "", terms: false };

export default function Regestration() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialForm);
  const [visibleFields, setVisibleFields] = useState<Record<PasswordField, boolean>>({ password: false, confirmPassword: false });
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Please complete all fields.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.terms) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }

    // Add the registration API request here, then navigate after success.
    router.push("/verify-account");
  };

  const toggleVisibility = (field: PasswordField) => {
    setVisibleFields((current) => ({ ...current, [field]: !current[field] }));
  };

  return (
    <main className="min-h-screen bg-[#EDF2F6] p-0 lg:p-4">
      <div className="grid min-h-screen grid-cols-1 overflow-hidden rounded-2xl lg:min-h-[calc(100vh-2rem)] lg:grid-cols-2">
        <div className="flex min-h-screen items-center justify-center px-5 py-8 lg:min-h-0 lg:px-12">
          <section className="w-full max-w-[540px] rounded-xl bg-white px-10 py-8 sm:px-12">
            <div className="flex justify-center">
              <Image src="/images/authlogo.png" alt="Napotech logo" width={56} height={56} priority />
            </div>
            <h1 className="mt-2 text-center text-[24px] font-semibold leading-[124%] text-[#103D5C]">Sign Up to Get Started</h1>
            <p className="mt-1 text-center text-[14px] leading-[160%] text-[#5A5A5A]">Please register by filling your data</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className="relative">
                <CustomInput name="fullName"
                 label="Full Name"
                  placeholder="Enter your full name"
                   value={formData.fullName}
                    onChange={handleChange} 
                    className=" py-2 pl-9" />

                <CiUser className="absolute left-3 top-11 h-4 w-4 text-[#707070]" strokeWidth={1.5} />

              </div>

              <div className="relative">
                <CustomInput name="email" 
                type="email" label="Email"
                placeholder="Enter your email"
                 value={formData.email} onChange={handleChange} 
                 className=" py-2 pl-9" />
                <Mail className="absolute left-3 top-11 h-4 w-4 text-[#707070]" strokeWidth={1.5} />
              </div>

             {/* Password + Confirm Password - Side by Side */}
<div className="">
  {/* Password Field */}
  <div className="relative">
    <CustomInput
      name="password"
      type={visibleFields.password ? "text" : "password"}
      label="Password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      className="py-2 pl-9 pr-10"
    />
    <Lock
      className="absolute left-3 top-11 h-4 w-4 text-[#707070]"
      strokeWidth={1.5}
    />
    <button
      type="button"
      aria-label={visibleFields.password ? "Hide password" : "Show password"}
      onClick={() => toggleVisibility("password")}
      className="absolute right-3 -mt-9.5 cursor-pointer p-1 text-[#707070]"
    >
      {visibleFields.password ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  </div>

  {/* Confirm Password Field */}
  <div className="relative mt-4">
    <CustomInput
      name="confirmPassword"
      type={visibleFields.confirmPassword ? "text" : "password"}
      label="Confirm Password"
      placeholder="Enter your confirmed password"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="py-2 pl-9 pr-10"
    />
    <Lock
      className="absolute left-3 top-11 h-4 w-4 text-[#707070]"
      strokeWidth={1.5}
    />
    <button
      type="button"
      aria-label={
        visibleFields.confirmPassword
          ? "Hide confirm password"
          : "Show confirm password"
      }
      onClick={() => toggleVisibility("confirmPassword")}
      className="absolute right-3 -mt-9.5 cursor-pointer p-1 text-[#707070]"
    >
      {visibleFields.confirmPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  </div>
</div>

              <label className="flex items-start gap-1.5 pt-1 text-[12px] leading-[160%] text-[#5A5A5A]">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="mt-0.5 h-3 w-3 accent-[#103D5C]" />
                <span>By creating an account, you agree to our <span className="text-[#103D5C]">Terms &amp; Conditions</span></span>
              </label>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <CustomButton type="submit" className="h-9 cursor-pointer text-[12px]">Create Account</CustomButton>
            </form>

            <p className="mt-4 text-center text-[12px] leading-[160%] text-[#6A6A6A]">Already have an account? <Link href="/login" className="text-[#103D5C]">Sign In Here</Link></p>
          </section>
        </div>
        <div className="relative hidden min-h-[340px] lg:block">
          <Image src="/images/authleftimage.png" alt="Napotech dashboard" fill priority className="h-full w-full object-center" />
        </div>
      </div>
    </main>
  );
}
