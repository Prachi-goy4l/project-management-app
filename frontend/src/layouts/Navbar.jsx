import { Menu } from "lucide-react";

export default function Navbar({ setOpen }) {
  return (
    <header className="h-16 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Mobile menu */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-800">
              Workspace
            </p>

            <p className="text-[11px] text-slate-400">
              Project Manager
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            U
          </div>
        </div>
      </div>
    </header>
  );
}