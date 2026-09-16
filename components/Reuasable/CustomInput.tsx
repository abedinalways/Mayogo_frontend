import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      required,
      helperText,
      className = "",
      containerClassName = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className=" text-[#103D5C] text-[16px] font-medium leading-[160%]"
          >
            {label}
            {required && <span className=" ml-0.5">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-lg border border-[#E8E8E8] mt-1.5  px-3.5 py-4 text-sm  text-gray-900
            placeholder:text-gray-400
            focus:outline-none  focus:border-gray-500
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
          {...props}
        />

        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  },
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
