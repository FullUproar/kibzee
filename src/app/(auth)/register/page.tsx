"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["STUDENT", "TEACHER"]),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TEACHER">("STUDENT")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Registration failed")
      } else {
        // Auto sign in after successful registration
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (signInResult?.ok) {
          router.push("/onboarding")
          router.refresh()
        } else {
          router.push("/login")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role: "STUDENT" | "TEACHER") => {
    setSelectedRole(role)
    setValue("role", role)
  }

  return (
    <div className="animate-in">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block mb-8">
          <h1 className="text-3xl font-serif text-ink">
            kibzee<span className="text-clay ml-1">•</span>
          </h1>
        </Link>
        <h2 className="text-2xl font-serif mb-2">Create your account</h2>
        <p className="text-gray-600">Join our community of music lovers</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-subtle">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-3">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("STUDENT")}
                className={`p-4 border rounded-subtle transition-all ${
                  selectedRole === "STUDENT"
                    ? "border-sage bg-sage/10 text-sage"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="font-medium">Learn Music</div>
                <div className="text-xs mt-1 text-gray-600">Find teachers near me</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("TEACHER")}
                className={`p-4 border rounded-subtle transition-all ${
                  selectedRole === "TEACHER"
                    ? "border-sage bg-sage/10 text-sage"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="font-medium">Teach Music</div>
                <div className="text-xs mt-1 text-gray-600">Share my expertise</div>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              className={`input ${errors.name ? "input-error" : ""}`}
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className={`input ${errors.password ? "input-error" : ""}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className={`input ${errors.confirmPassword ? "input-error" : ""}`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-start">
              <input
                {...register("termsAccepted")}
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-sage focus:ring-sage"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-sage hover:text-primary-600">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-sage hover:text-primary-600">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
              disabled={isLoading}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-subtle hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="sr-only">Google</span>
            </button>

            <button
              onClick={() => signIn("facebook", { callbackUrl: "/onboarding" })}
              disabled={isLoading}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-subtle hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="sr-only">Facebook</span>
            </button>

            <button
              onClick={() => signIn("apple", { callbackUrl: "/onboarding" })}
              disabled={isLoading}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-subtle hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="sr-only">Apple</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-sage hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}