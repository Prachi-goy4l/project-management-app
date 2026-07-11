import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">
        Project Management
      </h1>

      <div className="flex items-center gap-4">
        <span>
          Welcome, {user?.name}
        </span>

        <Button
          variant="destructive"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}