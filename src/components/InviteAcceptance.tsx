"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Users } from "lucide-react";

export default function InviteAcceptance({ token }: { token: string }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);

  const acceptInvite = async () => {
    setIsAccepting(true);
    setMessage("");
    try {
      const response = await fetch(`/api/v1/invitations/${token}/accept`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) {
        if (response.status === 401) throw new Error("Please sign in with the invited email address before accepting this invitation.");
        throw new Error(body.error ?? "Unable to accept invitation.");
      }
      setAccepted(true);
      setMessage("You have joined the workspace.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to accept invitation.");
    } finally {
      setIsAccepting(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4"><section className="w-full max-w-md rounded-3xl border border-[#E6ECEA] bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F0] text-[#0F5A68]"><Users className="h-6 w-6" /></div><h1 className="mt-5 text-xl font-black tracking-tight text-gray-900">Join a workspace</h1><p className="mt-2 text-[12px] leading-relaxed text-gray-500">You&apos;ve been invited to collaborate on payment reminders. Sign in with the email address that received this invitation, then join the team.</p>{message && <p className={`mt-5 rounded-xl px-3 py-2 text-[11px] font-semibold ${accepted ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{message}</p>}{accepted ? <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#074E5B] px-4 py-2 text-[11px] font-bold text-white"><CheckCircle2 className="h-4 w-4" />Open dashboard</Link> : <><button disabled={isAccepting} onClick={acceptInvite} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#074E5B] px-4 py-2 text-[11px] font-bold text-white disabled:opacity-60">{isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}Accept invitation</button><p className="mt-4 text-[10px] text-gray-400">Need to sign in first? <Link href="/login" className="font-bold text-[#074E5B]">Go to login</Link></p></>}</section></main>;
}
