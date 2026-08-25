import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOrganizations,
  deleteOrganization,
} from "@/services/organization.service";

import OrganizationDialog from "@/components/organizations/OrganizationDialog";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setOpenMenu(null);

    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?",
    );

    if (!confirmed) return;

    try {
      await deleteOrganization(id);

      await loadOrganizations();

      toast.success("Workspace deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete workspace");
    }
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name = "") => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-emerald-100 text-emerald-700",
      "bg-violet-100 text-violet-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
      "bg-cyan-100 text-cyan-700",
    ];

    const index =
      name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      colors.length;

    return colors[index];
  };

  const getLastActivity = (organization) => {
    // Replace with organization.lastActivityAt when your API provides it.
    return organization.updatedAt || organization.createdAt;
  };

  const formatDate = (date) => {
    if (!date) return "No activity";

    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-52 rounded-lg bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-100" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl border border-slate-100 bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-600">
            Workspace
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Your workspaces
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select a workspace to continue working with your team and
            projects.
          </p>
        </div>

        <OrganizationDialog
          mode="create"
          onSuccess={loadOrganizations}
        />
      </div>

      {/* =====================================================
          WORKSPACE LIST
      ====================================================== */}
      {organizations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            No workspaces yet
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Create your first workspace to start organizing projects and
            collaborating with your team.
          </p>

          <div className="mt-6">
            <OrganizationDialog
              mode="create"
              onSuccess={loadOrganizations}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* List header */}
          <div className="hidden border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:grid md:grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr_auto] md:gap-6">
            <span>Workspace</span>
            <span>Industry</span>
            <span>Owner</span>
            <span>Last activity</span>
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {organizations.map((organization) => (
              <div
                key={organization._id}
                className="group px-5 py-5 transition hover:bg-slate-50/70 sm:px-6"
              >
                <div className="grid items-center gap-5 md:grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr_auto] md:gap-6">
                  {/* Workspace */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getAvatarColor(
                        organization.name,
                      )}`}
                    >
                      {getInitials(organization.name)}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-slate-900">
                        {organization.name}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Workspace
                      </p>
                    </div>
                  </div>

                  {/* Mobile metadata */}
                  <div className="grid grid-cols-2 gap-4 md:contents">
                    {/* Industry */}
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:hidden">
                        Industry
                      </p>

                      <p className="truncate text-sm text-slate-600">
                        {organization.industry || "Not specified"}
                      </p>
                    </div>

                    {/* Owner */}
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:hidden">
                        Owner
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[9px] font-semibold text-slate-500">
                          {getInitials(organization.owner?.name)}
                        </div>

                        <span className="truncate text-sm text-slate-600">
                          {organization.owner?.name || "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Last activity */}
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:hidden">
                        Last activity
                      </p>

                      <p className="text-sm text-slate-500">
                        {formatDate(getLastActivity(organization))}
                      </p>
                    </div>
                  </div>

                  {/* Open workspace */}
                  <div className="flex items-center gap-2 md:justify-end">
                    <Button
                      onClick={() =>
                        navigate(
                          `/organizations/${organization._id}/dashboard`,
                        )
                      }
                      className="h-9 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      Open workspace

                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="ml-1.5"
                      >
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </Button>

                    {/* Three-dot menu */}
                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`Actions for ${organization.name}`}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === organization._id
                              ? null
                              : organization._id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="5" cy="12" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="19" cy="12" r="1.5" />
                        </svg>
                      </button>

                      {openMenu === organization._id && (
                        <div className="absolute right-0 top-11 z-30 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                          <OrganizationDialog
                            mode="edit"
                            organization={organization}
                            onSuccess={() => {
                              setOpenMenu(null);
                              loadOrganizations();
                            }}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(organization._id)
                            }
                            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              className="mr-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                            </svg>

                            Delete workspace
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer hint */}
      {organizations.length > 0 && (
        <p className="text-center text-xs text-slate-400">
          Choose a workspace to view its projects, tasks, and team.
        </p>
      )}
    </div>
  );
}