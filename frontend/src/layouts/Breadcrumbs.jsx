import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs() {
  const location = useLocation();
  const { organizationId, projectId } = useParams();

  const segments = location.pathname
    .split("/")
    .filter(Boolean);

  const getLabel = (segment) => {
    if (segment === "organizations") {
      return "Organizations";
    }

    if (segment === organizationId) {
      return "Acme Inc.";
    }

    if (segment === "dashboard") {
      return "Dashboard";
    }

    if (segment === "projects") {
      return "Projects";
    }

    if (segment === projectId) {
      return "Project";
    }

    if (segment === "members") {
      return "Members";
    }

    if (segment === "tasks") {
      return "Tasks";
    }

    if (segment === "analytics") {
      return "Analytics";
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      {segments.map((segment, index) => {
        const currentPath = `/${segments.slice(0, index + 1).join("/")}`;

        const isLast = index === segments.length - 1;

        return (
          <div
            key={`${segment}-${index}`}
            className="flex items-center gap-1.5"
          >
            {index > 0 && (
              <ChevronRight
                size={13}
                className="text-slate-300"
              />
            )}

            {isLast ? (
              <span className="font-medium text-slate-700">
                {getLabel(segment)}
              </span>
            ) : (
              <Link
                to={currentPath}
                className="transition hover:text-slate-700"
              >
                {getLabel(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}