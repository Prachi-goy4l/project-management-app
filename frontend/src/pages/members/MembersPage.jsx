import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import InviteDialog from "@/components/members/InviteDialog";

import {
  getOrganizationInvites,
  deleteInvite,
} from "@/services/invite.service";

import { getOrganizationMembers } from "@/services/member.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export default function MembersPage() {
  const { organizationId } = useParams();

  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");

  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [membersData, invitesData] = await Promise.all([
        getOrganizationMembers(organizationId),
        getOrganizationInvites(organizationId),
      ]);

      setMembers(membersData.data);
      setInvites(invitesData.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load team information");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    queueMicrotask(loadData);
  }, [loadData]);

  const handleDelete = async (inviteId) => {
    if (!window.confirm("Delete this invitation?")) return;

    try {
      await deleteInvite(inviteId);

      toast.success("Invitation deleted");

      loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete invitation");
    }
  };

  const filteredMembers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return members;

    return members.filter((member) => {
      const name =
        member.userId?.name?.toLowerCase() || "";

      const email =
        member.userId?.email?.toLowerCase() || "";

      const role =
        member.role?.toLowerCase() || "";

      return (
        name.includes(value) ||
        email.includes(value) ||
        role.includes(value)
      );
    });
  }, [members, search]);

  const filteredInvites = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return invites;

    return invites.filter((invite) => {
      const email =
        invite.email?.toLowerCase() || "";

      const role =
        invite.role?.toLowerCase() || "";

      return (
        email.includes(value) ||
        role.includes(value)
      );
    });
  }, [invites, search]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-20 rounded bg-slate-200" />
          <div className="h-8 w-56 rounded-lg bg-slate-200" />
          <div className="h-4 w-96 rounded bg-slate-100" />
        </div>

        <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />

        <div className="h-80 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Team members
            </h1>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {members.length}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage your workspace members and invitations.
          </p>
        </div>

        <InviteDialog
          onSuccess={loadData}
          trigger={
            <Button className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700">
              <PlusIcon />
              Invite member
            </Button>
          }
        />
      </div>

      {/* =====================================================
          TABS
      ====================================================== */}

      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <TabButton
            active={activeTab === "members"}
            onClick={() => {
              setActiveTab("members");
              setSearch("");
            }}
          >
            Members
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "members"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {members.length}
            </span>
          </TabButton>

          <TabButton
            active={activeTab === "invites"}
            onClick={() => {
              setActiveTab("invites");
              setSearch("");
            }}
          >
            Pending invitations
            <span
              className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700"
            >
              {invites.length}
            </span>
          </TabButton>
        </div>
      </div>

      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "members"
                ? "Search members..."
                : "Search invitations..."
            }
            className="h-10 border-slate-200 bg-white pl-10 shadow-none"
          />
        </div>

        <p className="text-xs text-slate-400">
          {activeTab === "members"
            ? `${filteredMembers.length} members`
            : `${filteredInvites.length} pending invitations`}
        </p>
      </div>

      {/* =====================================================
          MEMBERS
      ====================================================== */}

      {activeTab === "members" && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {filteredMembers.length === 0 ? (
            <EmptyState
              icon={<UsersIcon />}
              title="No members found"
              description={
                search
                  ? "Try changing your search."
                  : "Invite someone to start building your workspace team."
              }
            />
          ) : (
            <>
              {/* Desktop heading */}
              <div className="hidden grid-cols-[minmax(240px,2fr)_1fr_140px_50px] gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 md:grid">
                <span>Member</span>
                <span>Role</span>
                <span>Joined</span>
                <span />
              </div>

              <div>
                {filteredMembers.map((member) => (
                  <MemberRow
                    key={member._id}
                    member={member}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* =====================================================
          PENDING INVITATIONS
      ====================================================== */}

      {activeTab === "invites" && (
        <section className="overflow-hidden rounded-xl border border-amber-200/70 bg-white shadow-sm">
          {filteredInvites.length === 0 ? (
            <EmptyState
              icon={<MailIcon />}
              title="No pending invitations"
              description="There are no outstanding invitations for this workspace."
            />
          ) : (
            <>
              <div className="border-b border-amber-100 bg-amber-50/40 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                    <MailIcon />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Pending invitations
                    </p>

                    <p className="text-xs text-slate-500">
                      These people have not joined the workspace yet.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {filteredInvites.map((invite) => (
                  <InviteRow
                    key={invite._id}
                    invite={invite}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

/* ============================================================
   MEMBER ROW
============================================================ */

function MemberRow({ member }) {
  const name = member.userId?.name || "Unknown member";
  const email = member.userId?.email || "";

  return (
    <div className="group border-b border-slate-100 px-6 py-4 transition last:border-b-0 hover:bg-slate-50/70">
      <div className="grid gap-4 md:grid-cols-[minmax(240px,2fr)_1fr_140px_50px] md:items-center">
        {/* Member */}
        <div className="flex items-center gap-3">
          <Avatar name={name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {email}
            </p>
          </div>
        </div>

        {/* Role */}
        <div>
          <RoleBadge role={member.role} />
        </div>

        {/* Joined */}
        <div>
          <p className="text-xs font-medium text-slate-500">
            {formatDate(
              member.joinedAt || member.createdAt
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <ActionMenu />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INVITE ROW
============================================================ */

function InviteRow({ invite, onDelete }) {
  return (
    <div className="group border-b border-slate-100 bg-slate-50/30 px-6 py-4 transition last:border-b-0 hover:bg-amber-50/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700">
            <MailIcon />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {invite.email}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <RoleBadge role={invite.role} />

              <span className="text-xs text-slate-400">
                Invited{" "}
                {formatDate(
                  invite.createdAt ||
                    invite.sentAt
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {invite.status || "Pending"}
          </span>

          <button
            type="button"
            onClick={() => onDelete(invite._id)}
            title="Delete invitation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB
============================================================ */

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center pb-3 text-sm font-medium transition ${
        active
          ? "text-slate-900"
          : "text-slate-400 hover:text-slate-700"
      }`}
    >
      {children}

      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-600" />
      )}
    </button>
  );
}

/* ============================================================
   ROLE BADGE
============================================================ */

function RoleBadge({ role }) {
  const normalized = role?.toLowerCase();

  const styles =
    normalized === "owner"
      ? "bg-purple-50 text-purple-700 ring-purple-600/10"
      : normalized === "admin"
        ? "bg-blue-50 text-blue-700 ring-blue-600/10"
        : "bg-slate-100 text-slate-600 ring-slate-500/10";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${styles}`}
    >
      {role || "Member"}
    </span>
  );
}

/* ============================================================
   AVATAR
============================================================ */

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 ring-2 ring-white">
      {initials || "?"}
    </div>
  );
}

/* ============================================================
   ACTION MENU
============================================================ */

function ActionMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Member actions"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <MoreIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            View profile
          </button>

          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Change role
          </button>

          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
            onClick={() => setOpen(false)}
          >
            Remove member
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  icon,
  title,
  description,
}) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <h2 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   DATE
============================================================ */

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ============================================================
   ICONS
============================================================ */

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}