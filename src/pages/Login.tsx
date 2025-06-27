import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { TreePine } from "lucide-react";

import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import { useLogin } from "../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "mayank@example.com",
      password: "Abhi1708967@",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
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
              Welcome back
            </h2>
            <p className="mt-2 text-text-muted">
              Continue your journey to a greener planet
            </p>
          </div>

          {/* Form */}
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

              {/* Password Field */}
              <FormInput
                type="password"
                label="Password"
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-text-muted">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <FormButton
              type="button"
              isLoading={login.isPending}
              loadingText="Signing in..."
              fullWidth
              onClick={handleSubmit(onSubmit)}
            >
              Sign in
            </FormButton>

            {/* Sign up link */}
            <p className="text-center text-sm text-text-muted">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Hero Image (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-dark/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=1200&fit=crop"
          alt="Nature"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white max-w-md px-8">
            <h1 className="text-4xl font-heading font-bold mb-4">
              Plant Today, Breathe Tomorrow
            </h1>
            <p className="text-lg opacity-90">
              Join our community of environmental heroes making a real
              difference, one plant at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
