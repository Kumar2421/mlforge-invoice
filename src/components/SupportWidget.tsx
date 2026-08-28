"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAPI } from "@/utils/api";

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetchAPI("/api/v1/support", {
        method: "POST",
        body: JSON.stringify({ subject, description, priority }),
      });
      if (res.error) throw new Error(res.error);
      setMessage({ type: "success", text: "Ticket submitted successfully!" });
      setSubject("");
      setDescription("");
      setPriority("Normal");
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to submit ticket" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#074E5B] text-white shadow-lg hover:bg-[#053E48] flex items-center justify-center transition-colors z-50"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Popover Form */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white border border-[#ECECEC] rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col">
          <div className="bg-[#074E5B] px-4 py-3 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">Raise a Complaint</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject" className="text-xs">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief title..."
                className="h-8 text-xs"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priority" className="text-xs">Priority</Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {message && (
              <div className={`text-xs p-2 rounded ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full bg-[#074E5B] hover:bg-[#053E48] h-8 text-xs font-semibold text-white">
              {isSubmitting ? "Submitting..." : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Submit Ticket
                </span>
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
