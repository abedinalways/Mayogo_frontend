"use client";

import Image from "next/image";
import { Mail } from "lucide-react";
import { useState } from "react";
import CustomButton from "../Reuasable/CustomButton";
import CustomInput from "../Reuasable/CustomInput";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    router.push("/otp");
  };

  return (
    <>
      <div className="flex justify-center">
        <Image
          src="/images/authlogo.png"
          alt="Napotech logo"
          width={72}
          height={72}
          priority
        />
      </div>

      <h1 className="mt-2 text-center text-[1.625rem] font-semibold leading-[124%] text-[#103D5C]">
        Forgot Password?
      </h1>

      <p className="mt-1 text-center text-base leading-[160%] text-[#5A5A5A]">
        Enter your email to reset your password
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <CustomInput
          name="email"
          type="email"
          label="Email"
          placeholder="daniel.green@gmail.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          error={error}
          className="text-base"
          leftIcon={
            <Mail
              className="h-4 w-4 text-[#707070]"
              strokeWidth={1.5}
            />
          }
        />

        <CustomButton
          type="submit"
          className="cursor-pointer text-[14px]"
        >
          Send Code
        </CustomButton>

        <div className="flex justify-center">
          <span className="text-[#5A5A5A] text-[14px] font-normal leading-[100%]">
            Don’t have an account?{" "}
            <Link
              href="/login"
              className="text-[#103D5C] text-[14px] font-medium leading-[100%]"
            >
              Back to login
            </Link>
          </span>
        </div>
      </form>
    </>
  );
}