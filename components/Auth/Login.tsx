"use client";

import React, { useState } from "react";
import CustomInput from "../Reuasable/CustomInput";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Inbox, Lock, Mail } from "lucide-react";
import CustomButton from "../Reuasable/CustomButton";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
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

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            email: "",
            password: "",

        };

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        if (newErrors.email || newErrors.password) {
            return;
        }

        console.log(formData);

        // Later API call here
    };

    return (
        <div>
            <div className="bg-[#EDF2F6]  rounded-2xl flex h-screen ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">

                    <div className="flex justify-center items-center">
                        <div className="bg-[#FFFFFF] p-12 rounded-xl  w-full max-w-135 min-w-90 shrink-0">

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
                                                className="pl-10"
                                            />

                                            <Mail className="absolute left-3 top-11.5 h-4 w-4" />
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
                                                className="pl-10"
                                            />

                                            <Lock className="absolute left-3 top-10.5 h-4 w-4" />

                                            {showPassword ? (
                                                <Eye
                                                    className="absolute right-3 top-11.25 h-4 w-4 cursor-pointer"
                                                    onClick={() => setShowPassword(false)}
                                                />
                                            ) : (
                                                <EyeOff
                                                    className="absolute right-3 top-11.25 h-4 w-4 cursor-pointer"
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
                                    <CustomButton type="submit" className=" cursor-pointer">
                                        Sign In
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
                                className="rounded-2xl  object-center lg:rounded-none"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}