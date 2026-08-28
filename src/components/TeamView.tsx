"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Loader2, Plus, UserPlus, Users } from "lucide-react";

type Organization = { id: string; name: string; role: "owner" | "admin" | "member"; created_at: string };
type Member = { id: string; name: string; email: string; role: "owner" | "admin" | "member"; joinedAt: string };
type Invitation = { id: string; email: string; role: "admin" | "member"; token: string; expires_at: string };

export default function TeamView() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadOrganizations = async () => {
    const response = await fetch("/api/v1/organizations");
    const body = await response.json();
    if (!response.ok) throw new Error(body.error ?? "Unable to load organizations");
    const data = body.data as Organization[];
    setOrganizations(data);
    setSelectedId((current) => current || data[0]?.id || "");
  };

  useEffect(() => {
    loadOrganizations().catch((error: Error) => setMessage(error.message)).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMembers([]);
      setInvitations([]);
      return;
    }
    fetch(`/api/v1/organizations/${selectedId}/members`)
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!response.ok) throw new Error(body.error ?? "Unable to load team members");
        setMembers(body.data.members ?? []);
        setInvitations(body.data.invitations ?? []);
      })
      .catch((error: Error) => setMessage(error.message));
  }, [selectedId]);

  const createOrganization = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/v1/organizations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: organizationName }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to create organization");
      setOrganizations((current) => [...current, body.data]);
      setSelectedId(body.data.id);
      setOrganizationName("");
      setMessage("Workspace created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create organization");
    } finally {
      setIsSaving(false);
    }
  };

  const inviteMember = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId) return;
    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/v1/organizations/${selectedId}/members`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: inviteEmail, role: inviteRole }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to create invitation");
      setInvitations((current) => [body.data, ...current.filter((invite) => invite.email !== body.data.email)]);
      setInviteEmail("");
      setMessage("Invitation created. Share the invite link from the pending list.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create invitation");
    } finally {
      setIsSaving(false);
    }
  };

  const copyInvite = async (token: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/invite/${token}`);
    setMessage("Invite link copied.");
  };

  const selectedOrganization = organizations.find((organization) => organization.id === selectedId);
  const canInvite = selectedOrganization?.role === "owner" || selectedOrganization?.role === "admin";

  if (isLoading) return <main className="flex flex-1 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></main>;

  return <main className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-6 space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="text-[18px] font-black text-gray-900 tracking-tight">Team</h2><p className="mt-0.5 text-[11px] font-medium text-gray-400">Share your reminder workspace with the people who help you collect.</p></div></div>
    {message && <div className="rounded-xl border border-[#D8E9E3] bg-[#F1F8F5] px-3 py-2 text-[11px] font-semibold text-[#0F5A68]">{message}</div>}
    <div className="grid gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-[#ECECEC] bg-white p-5 xl:col-span-2">
        <div className="flex items-center justify-between"><div><h3 className="text-[14px] font-black text-gray-900">Workspace members</h3><p className="mt-0.5 text-[10px] text-gray-400">Each workspace has its own member roles and invitation list.</p></div><Users className="h-5 w-5 text-[#074E5B]" /></div>
        {organizations.length ? <><div className="mt-4 flex flex-wrap gap-2">{organizations.map((organization) => <button key={organization.id} onClick={() => setSelectedId(organization.id)} className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${selectedId === organization.id ? "border-[#074E5B] bg-[#074E5B] text-white" : "border-gray-200 text-gray-500"}`}>{organization.name}</button>)}</div><div className="mt-4 overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-[#F0F0F0] text-[9px] font-bold uppercase tracking-wider text-gray-400"><th className="px-2 py-3">Member</th><th className="px-2 py-3">Role</th><th className="px-2 py-3">Joined</th></tr></thead><tbody>{members.map((member) => <tr className="border-b border-[#F6F6F6] text-[11px]" key={member.id}><td className="px-2 py-3"><p className="font-bold text-gray-800">{member.name}</p><p className="text-[9px] text-gray-400">{member.email}</p></td><td className="px-2 py-3"><span className="rounded-full bg-[#EEF6F4] px-2 py-0.5 text-[9px] font-bold capitalize text-[#0F5A68]">{member.role}</span></td><td className="px-2 py-3 text-gray-400">{new Date(member.joinedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></> : <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-6 text-center"><p className="text-[12px] font-bold text-gray-700">Create your first workspace</p><p className="mt-1 text-[10px] text-gray-400">It gives your business a shared home for reminders and team access.</p></div>}
      </section>
      <div className="space-y-4"><section className="rounded-2xl border border-[#ECECEC] bg-white p-5"><h3 className="text-[13px] font-black text-gray-900">Create workspace</h3><form className="mt-3 space-y-2" onSubmit={createOrganization}><input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder="e.g. Acme Finance" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px] outline-none focus:border-[#074E5B]" /><button disabled={isSaving} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#074E5B] py-2 text-[10px] font-bold text-white disabled:opacity-60"><Plus className="h-3.5 w-3.5" />Create workspace</button></form></section>
        {selectedOrganization && <section className="rounded-2xl border border-[#ECECEC] bg-white p-5"><h3 className="text-[13px] font-black text-gray-900">Invite teammate</h3><p className="mt-1 text-[10px] text-gray-400">{canInvite ? "Invite links expire after seven days." : "Only workspace owners and admins can invite people."}</p><form className="mt-3 space-y-2" onSubmit={inviteMember}><input disabled={!canInvite} value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} type="email" placeholder="teammate@company.com" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px] outline-none focus:border-[#074E5B] disabled:bg-gray-50" /><select disabled={!canInvite} value={inviteRole} onChange={(event) => setInviteRole(event.target.value as "admin" | "member")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-semibold text-gray-600 outline-none"><option value="member">Member</option><option value="admin">Admin</option></select><button disabled={!canInvite || isSaving} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#074E5B] py-2 text-[10px] font-bold text-[#074E5B] disabled:opacity-50"><UserPlus className="h-3.5 w-3.5" />Create invite</button></form></section>}</div>
    </div>
    {invitations.length > 0 && <section className="rounded-2xl border border-[#ECECEC] bg-white p-5"><h3 className="text-[13px] font-black text-gray-900">Pending invitations</h3><div className="mt-3 space-y-2">{invitations.map((invite) => <div key={invite.id} className="flex items-center justify-between rounded-xl bg-[#FAFAFA] px-3 py-2.5"><div><p className="text-[11px] font-bold text-gray-700">{invite.email}</p><p className="text-[9px] text-gray-400">{invite.role} · expires {new Date(invite.expires_at).toLocaleDateString()}</p></div><button onClick={() => copyInvite(invite.token)} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[9px] font-bold text-gray-500"><Copy className="h-3 w-3" />Copy link</button></div>)}</div></section>}
    <div className="flex items-center gap-2 text-[10px] text-gray-400"><Check className="h-3.5 w-3.5 text-emerald-500" />Owners and admins control invitations. Billing data remains personal until the organization-scoping migration lands.</div>
  </main>;
}
