import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { register } from "@/services/auth.service";
import {
  Input,
  Label,
  Button,
} from "@/components/ui";

import { toast } from "sonner";

export function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await register(form);

      toast.success("Account created successfully");

      navigate("/login");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* =====================================================
          LEFT BRAND / ONBOARDING PANEL
      ====================================================== */}
      <div className="relative hidden overflow-hidden bg-[#edf8f1] px-12 py-12 text-slate-900 lg:flex lg:flex-col">
        {/* Decorative shapes */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-200/40" />

        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-emerald-200/60" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>

          <span className="text-lg font-semibold tracking-tight">
            ProjectFlow
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center">
          <div className="max-w-xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Get started
            </p>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
              Build better
              <br />
              <span className="text-emerald-700">
                projects together.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
              Create your workspace, bring your team together, and keep every
              project moving forward.
            </p>
          </div>

          {/* Progress visual */}
          <div className="mt-14 max-w-xl">
            <div className="rounded-2xl border border-emerald-200/70 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Your journey
                </span>

                <span className="text-xs font-medium text-emerald-700">
                  Step 1 of 3
                </span>
              </div>

              {/* Progress line */}
              <div className="relative">
                <div className="absolute left-0 right-0 top-4 h-px bg-emerald-100" />

                <div className="absolute left-0 top-4 h-px w-1/3 bg-emerald-500" />

                <div className="relative grid grid-cols-3">
                  {/* Step 1 */}
                  <div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white ring-4 ring-emerald-50">
                      1
                    </div>

                    <p className="mt-4 text-xs font-semibold text-slate-800">
                      Create account
                    </p>

                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      Start your workspace
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-xs font-medium text-slate-400">
                      2
                    </div>

                    <p className="mt-4 text-xs font-medium text-slate-500">
                      Join workspace
                    </p>

                    <p className="mt-1 text-center text-[11px] leading-4 text-slate-400">
                      Bring your team in
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-end">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-white text-xs font-medium text-slate-400">
                      3
                    </div>

                    <p className="mt-4 text-right text-xs font-medium text-slate-500">
                      Manage projects
                    </p>

                    <p className="mt-1 text-right text-[11px] leading-4 text-slate-400">
                      Plan and ship together
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-slate-500">
          Simple tools for focused teams.
        </p>
      </div>

      {/* =====================================================
          RIGHT REGISTER FORM
      ====================================================== */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>

            <span className="text-lg font-semibold text-slate-900">
              ProjectFlow
            </span>
          </div>

          {/* Heading */}
          <div className="mb-9">
            <p className="mb-3 text-sm font-medium text-emerald-600">
              Step 1 of 3
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Set up your account and start organizing your projects.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full name
              </Label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="h-12 rounded-lg border-slate-200 bg-slate-50/50 px-4 text-sm shadow-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email address
              </Label>

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="h-12 rounded-lg border-slate-200 bg-slate-50/50 px-4 text-sm shadow-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </Label>

              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Create a secure password"
                value={form.password}
                onChange={handleChange}
                className="h-12 rounded-lg border-slate-200 bg-slate-50/50 px-4 text-sm shadow-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
                required
              />

              <p className="text-xs leading-5 text-slate-400">
                Use a strong password to keep your workspace secure.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Login */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />

            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Takes less than a minute
            </span>

            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}