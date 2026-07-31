import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  X,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const { organizationId } = useParams();

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
        title: "Dashboard",
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

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-screen
          w-64
          bg-white
          border-r
          z-50
          transition-transform
          duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 md:hidden">
          <h1 className="text-2xl font-bold">PM</h1>

          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block p-6">
          <h1 className="text-2xl font-bold">PM</h1>
        </div>

        <nav className="space-y-2 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100"
                  }`
                }
              >
              
                <Icon size={20} />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;