import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { TreePine } from "lucide-react";

import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { useSignup } from "../hooks/useAuth";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    signup.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-dark/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&h=1200&fit=crop"
          alt="Planting"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white max-w-md px-8">
            <h1 className="text-4xl font-heading font-bold mb-4">
              Start Your Green Journey
            </h1>
            <p className="text-lg opacity-90">
              Every plant counts. Join thousands making our planet greener, one
              seed at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
            <h2 className="text-3xl font-heading font-bold text-primary dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-text-muted">
              Join the green revolution today
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-6">
            <div className="space-y-5">
              {/* Name Field */}
              <FormInput
                type="text"
                label="Full name"
                register={register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={errors.name?.message}
              />

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

              {/* Password Field */}
              <FormInput
                type="password"
                label="Password"
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain uppercase, lowercase, and number",
                  },
                })}
                error={errors.password?.message}
              />

              {/* Confirm Password Field */}
              <FormInput
                type="password"
                label="Confirm password"
                register={register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Terms and Privacy */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
              />
              <label className="ml-2 text-sm text-text-muted">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:text-primary-dark"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary hover:text-primary-dark"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <FormButton
              type="button"
              isLoading={signup.isPending}
              loadingText="Creating account..."
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              Create Account
            </FormButton>

            {/* Sign in link */}
            <p className="text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
