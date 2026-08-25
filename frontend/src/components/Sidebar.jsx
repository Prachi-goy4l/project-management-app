import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  ChevronDown,
  X,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Organizations",
      path: "/organizations",
      icon: Building2,
    },
  ];

  if (organizationId) {
    menuItems.push(
      {
        title: "Overview",
        path: `/organizations/${organizationId}/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        path: `/organizations/${organizationId}/projects`,
        icon: FolderKanban,
      },
      {
        title: "Members",
        path: `/organizations/${organizationId}/members`,
        icon: Users,
      },
    );
  }

  const organizationName = "Current workspace";

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          bg-[#202321]
          text-slate-300
          transition-transform duration-300
          md:static md:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <button
            onClick={() => navigate("/organizations")}
            className="flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-[#202321]">
              PM
            </div>

            <span className="text-sm font-semibold tracking-tight text-white">
              Project Manager
            </span>
          </button>

          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* ==================================================
            WORKSPACE SWITCHER
        ================================================== */}

        {organizationId && (
          <div className="px-3 pt-5">
            <button
              onClick={() => navigate("/organizations")}
              className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/4 p-3 text-left transition hover:bg-white/8"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-bold text-emerald-400">
                AC
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {organizationName}
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Workspace
                </p>
              </div>

              <ChevronDown
                size={15}
                className="text-slate-500 transition group-hover:text-slate-300"
              />
            </button>
          </div>
        )}

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <div className="px-3 pt-7">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3 rounded-lg
                    px-3 py-2.5 text-sm font-medium
                    transition
                    ${
                      isActive
                        ? "bg-emerald-500 text-[#17201b] shadow-sm"
                        : "text-slate-400 hover:bg-white/6 hover:text-white"
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                      />

                      <span>{item.title}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ==================================================
            BOTTOM
        ================================================== */}

        <div className="mt-auto border-t border-white/10 p-4">
          <button
            onClick={() => navigate("/organizations")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/6 hover:text-white"
          >
            <Building2 size={17} />

            <span>Switch workspace</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;