import { useAuth } from "../../context/AuthContext";

import {
  Input,
  Label,
  Button,
} from "../../components/ui";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login({
      email,
      password,
    });

    if (result.success) {
      navigate("/organizations");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* ================= LEFT BRAND PANEL ================= */}
      <div className="relative hidden overflow-hidden bg-[#202522] px-12 py-12 text-white lg:flex lg:flex-col">
        {/* Decorative background shapes */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full border border-white/5" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
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
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
              Project management
            </p>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
              Plan clearly.
              <br />
              <span className="text-emerald-400">Ship together.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
              Bring your projects, tasks, and teams together in one focused
              workspace built for getting work done.
            </p>
          </div>

          {/* Project board illustration */}
          <div className="mt-14 max-w-lg">
            <div className="rounded-2xl border border-white/10 bg-white/4 p-4 shadow-2xl backdrop-blur-sm">
              {/* Window header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>

                <div className="h-2 w-20 rounded-full bg-white/10" />
              </div>

              {/* Board */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    title: "To do",
                    items: [
                      "Landing page",
                      "User research",
                      "Project setup",
                    ],
                  },
                  {
                    title: "In progress",
                    items: ["Dashboard", "API integration"],
                  },
                  {
                    title: "Done",
                    items: ["Design system", "Authentication"],
                  },
                ].map((column) => (
                  <div
                    key={column.title}
                    className="rounded-xl bg-black/20 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400">
                        {column.title}
                      </span>

                      <span className="text-[10px] text-slate-600">
                        {column.items.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {column.items.map((item, index) => (
                        <div
                          key={item}
                          className="rounded-lg border border-white/5 bg-white/6 p-2.5"
                        >
                          <div className="mb-2 h-1.5 w-3/4 rounded-full bg-white/10" />

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-500">
                              {item}
                            </span>

                            {index === 0 && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-slate-600">
          Simple tools for focused teams.
        </p>
      </div>

      {/* ================= RIGHT LOGIN PANEL ================= */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
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
          <div className="mb-10">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to continue to your workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm shadow-none transition focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>

                {/* <button
                  type="button"
                  className="text-xs font-medium text-slate-500 transition hover:text-emerald-600"
                >
                  Forgot password?
                </button> */}
              </div>

              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg border-slate-200 bg-white px-4 text-sm shadow-none transition focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Sign in"}
            </Button>
          </form>

          {/* Register */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-emerald-600 transition hover:text-emerald-700 hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Small divider/footer */}
          <div className="mt-12 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Secure workspace
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}