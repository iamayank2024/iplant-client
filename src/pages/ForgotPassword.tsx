import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { TreePine, ArrowLeft } from "lucide-react";

import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { useForgotPassword } from "../hooks/useAuth";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const forgotPassword = useForgotPassword();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo and Title */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <TreePine className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-heading text-primary font-bold dark:text-white">
              {emailSent ? "Check your inbox" : "Forgot your password?"}
            </h2>
            <p className="mt-2 text-text-muted">
              {emailSent
                ? "We've sent you a link to reset your password"
                : "Enter your email and we'll send you a link to reset your password"}
            </p>
          </div>

          {emailSent ? (
            <div className="mt-8 space-y-6">
              <div className="bg-secondary dark:bg-gray-700 rounded-lg p-6">
                <p className="text-center text-text dark:text-white">
                  A password reset link has been sent to your email address.
                  Please check your inbox (and spam folder) and follow the
                  instructions.
                </p>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="space-y-5">
                {/* Email Field */}
                <FormInput
                  type="email"
                  label="Email address"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.email?.message}
                />
              </div>

              {/* Submit Button */}
              <FormButton
                type="button"
                isLoading={forgotPassword.isPending}
                loadingText="Sending link..."
                fullWidth
                onClick={handleSubmit(onSubmit)}
              >
                Send Reset Link
              </FormButton>

              {/* Back to login link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Hero Image (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-dark/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&h=1200&fit=crop"
          alt="Plants"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white max-w-md px-8">
            <h1 className="text-4xl font-heading font-bold mb-4">
              We've Got You Covered
            </h1>
            <p className="text-lg opacity-90">
              Don't worry, you'll be back to making the world greener in no
              time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
