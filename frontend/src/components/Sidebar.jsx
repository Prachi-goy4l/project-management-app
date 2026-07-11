import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-[calc(100vh-64px)] bg-white border-r p-4">
      <nav className="flex flex-col gap-4">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/projects">
          Projects
        </Link>

        <Link to="/tasks">
          Tasks
        </Link>

        <Link to="/members">
          Members
        </Link>

      </nav>
    </aside>
  );
}