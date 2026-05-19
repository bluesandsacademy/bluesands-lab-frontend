"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
  label?: string;
}

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "Enter password",
  required = false,
  minLength,
  className = "",
  label,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
      {label && (
        <label
          htmlFor={id}
          className="font-medium text-gray-700 text-sm md:text-md"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base pr-10 ${className}`}
          id={id}
          value={value}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}