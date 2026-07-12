import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">
        Welcome 👋
      </h2>

      <div className="flex items-center gap-4">
        <Bell className="cursor-pointer" />

        <span className="font-medium">
          {user?.name}
        </span>

        <LogOut className="cursor-pointer text-red-500" />
      </div>
    </header>
  );
};

export default Navbar;