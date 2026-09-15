import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CustomButton = ({ children, className = "", ...props }: CustomButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full rounded-lg bg-[#103D5C] px-6 py-3 text-[14px] font-medium leading-[116%] text-white ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;