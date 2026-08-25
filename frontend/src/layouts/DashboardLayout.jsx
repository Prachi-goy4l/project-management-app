import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/layouts/Navbar";
import Breadcrumbs from "@/layouts/Breadcrumbs";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f7f8f5]">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar setOpen={setSidebarOpen} />

        <main className="min-w-0 flex-1">
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Breadcrumbs />
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}