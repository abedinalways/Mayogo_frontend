
"use client";

import Image from "next/image";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import CustomButton from "../Reuasable/CustomButton";
import CustomInput from "../Reuasable/CustomInput";
import AuthSplitLayout from "./AuthSplitLayout";

export default function SetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword.trim()) {
      setError("Current password is required");
      return;
    }

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Confirm password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    console.log({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    // API call here
  };

  return (
    <AuthSplitLayout>
      <section className="w-full">

        <div className="flex justify-center">
          <Image
            src="/images/authlogo.png"
            alt="Napotech logo"
            width={56}
            height={56}
            priority
          />
        </div>

        <h1 className="mt-2 text-center text-[26px] font-semibold leading-[124%] text-[#103D5C]">
          Set New Password
        </h1>

        <p className="mt-1 text-center text-[16px] leading-[160%] text-[#5A5A5A]">
          Must be at least 8 character
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">

          {/* Current Password */}
          <div className="relative">
            <CustomInput
              name="currentPassword"
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setError("");
              }}
              className=" pl-10 pr-11 text-base"
            />

            <Lock
              className="absolute left-4 top-11 h-4 w-4 text-[#707070]"
              strokeWidth={1.5}
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-10.5 cursor-pointer p-1 text-[#707070]"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <CustomInput
              name="newPassword"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              className=" pl-10 pr-11 text-base"
            />

            <Lock
              className="absolute left-4 top-11 h-4 w-4 text-[#707070]"
              strokeWidth={1.5}
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-10.5 cursor-pointer p-1 text-[#707070]"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <CustomInput
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className=" pl-10 pr-11 text-base"
            />

            <Lock
              className="absolute left-4 top-11 h-4 w-4 text-[#707070]"
              strokeWidth={1.5}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10.5 cursor-pointer p-1 text-[#707070]"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <CustomButton
            type="submit"
            className="mt-3 h-11 cursor-pointer text-[14px]"
          >
            Update Password
          </CustomButton>

        </form>
      </section>
    </AuthSplitLayout>
  );
}

