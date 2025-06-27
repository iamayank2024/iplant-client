import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface FormButtonProps {
  type?: "submit" | "button" | "reset";
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  icon?: ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({
  type = "button",
  children,
  onClick,
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  variant = "primary",
  fullWidth = false,
  icon,
}) => {
  const baseStyles =
    "flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary",
    secondary:
      "bg-secondary text-text-muted hover:bg-primary-light focus:ring-2 focus:ring-offset-2 focus:ring-secondary",
    outline:
      "bg-transparent border border-border text-text-muted hover:bg-secondary focus:ring-2 focus:ring-offset-2 focus:ring-border",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default FormButton;
