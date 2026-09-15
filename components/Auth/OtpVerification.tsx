"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../Reuasable/CustomButton";
import CustomInput from "../Reuasable/CustomInput";
import AuthSplitLayout from "./AuthSplitLayout";

export default function OtpVerification() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);
    setError("");

    if (digit && index < nextCode.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedCode) return;
    event.preventDefault();
    setCode(pastedCode.padEnd(6, "").split(""));
    inputsRef.current[Math.min(pastedCode.length, 5)]?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.some((digit) => !digit)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    // Add the code verification API request here.
    router.push("/set-password");
  };

  return (
    <AuthSplitLayout>
      <section className="w-full">
        <div className="flex justify-center">
          <Image src="/images/authlogo.png" alt="Napotech logo" width={56} height={56} priority />
        </div>
        <h1 className="mt-2 text-center text-[26px] font-semibold leading-[124%] text-[#103D5C]">
          Enter Your Code
        </h1>
        <p className="mt-1 text-center text-[16px] leading-[160%] text-[#5A5A5A]">
          We sent a 6-digit code to your email
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="mb-2 block text-[18px] font-medium leading-[160%] text-[#103D5C]">
            Verification code
          </label>
          <div className="grid grid-cols-6 gap-2">
            {code.map((digit, index) => (
              <CustomInput
                key={index}
                ref={(element) => { inputsRef.current[index] = element; }}
                name={`code-${index + 1}`}
                value={digit}
                type="text"
                inputMode="numeric"
                maxLength={1}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                aria-label={`Verification digit ${index + 1}`}
                containerClassName="min-w-0"
                className="h-[54px] w-full rounded border-[#E8E8E8] bg-[#FBFDFF] px-1 text-center text-xl text-[#5A5A5A] outline-none focus:border-[#103D5C]"
              />
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <CustomButton type="submit" className="mt-6 h-11 cursor-pointer text-[14px]">
            Verify
          </CustomButton>
        </form>
<div className="flex justify-center mt-3">
                                <span className="text-[#5A5A5A] text-[14px] font-normal leading-[100%]">
                                    Don’t receive code?{" "}
                                    <Link
                                        href="/forget-password"
                                        className="text-[#103D5C] text-[14px] font-medium leading-[100%]"
                                    >
                                        Resend Again
                                    </Link>
                                </span>
                            </div>

      </section>
    </AuthSplitLayout>
  );
}