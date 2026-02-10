"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Password reset request error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send password reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 dark:from-zinc-900 dark:to-zinc-800">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-800">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Check your email
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                We've sent a password reset link to{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {email}
                </span>
              </p>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Please check your inbox and click on the link to reset your password. If you don't see the email, check your spam folder.
              </p>

              {/* Back to Login Button */}
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                  Back to Login
                </Link>
              </div>

              {/* Resend Link */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Didn't receive the email? Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 dark:from-zinc-900 dark:to-zinc-800">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className={`block w-full rounded-lg border px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:focus:border-red-500"
                      : "border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600 dark:focus:border-zinc-500"
                  }`}
                  placeholder="you@example.com"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending reset link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800/50">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
