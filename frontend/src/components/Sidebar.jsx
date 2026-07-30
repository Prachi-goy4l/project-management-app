import { NavLink, useParams } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  // CheckSquare,
  Users,
  // Settings,
} from "lucide-react";



const Sidebar = () => {
  const { organizationId,} = useParams();

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
    <aside className="w-64 bg-white border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          PM
        </h1>
      </div>

      <nav className="space-y-2 px-3">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
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
  );
};

export default Sidebar;