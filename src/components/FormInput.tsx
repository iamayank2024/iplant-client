import { useState } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  type: "text" | "email" | "password";
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  type: initialType,
  label,
  register,
  error,
  placeholder = " ",
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const type =
    initialType === "password" && showPassword ? "text" : initialType;

  return (
    <div className="relative">
      <input
        {...register}
        type={type}
        id={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="peer w-full px-4 py-3 pt-6 bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        placeholder={placeholder}
        required={required}
      />

      <label
        htmlFor={`input-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className="absolute left-4 top-1 text-xs text-text-muted peer-placeholder-shown:text-base peer-placeholder-shown:top-4 transition-all duration-200"
      >
        {label}
      </label>

      {initialType === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-4 text-text-muted hover:text-text transition-colors"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default FormInput;
