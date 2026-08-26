"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2, MoreVertical, X, Loader2, Plus } from "lucide-react";
import ReminderTimeline from "./ReminderTimeline";
import type { ReminderStage, Invoice } from "@/types";
import { fetchAPI } from "@/utils/api";

interface InvoicesViewProps {
  onNewSequence?: () => void;
}

const previewReminderStages: ReminderStage[] = [
  { day: 0, tone: "gentle", subject: "Invoice sent via Stripe", body: "", status: "sent" },
  { day: 3, tone: "gentle", subject: "Reminder email sent", body: "", status: "sent" },
  { day: 7, tone: "firm", subject: "Escalation scheduled", body: "", status: "scheduled" },
];

export default function InvoicesView({ onNewSequence }: InvoicesViewProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  useEffect(() => {
    fetchAPI('/api/v1/invoices')
      .then(res => {
        setInvoices(res.data || []);
        if (res.data?.length > 0) setActiveInvoiceId(res.data[0].id);
      })
      .catch(err => console.error("Failed to fetch invoices", err))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedInvoice = invoices.find(i => i.id === activeInvoiceId) || invoices[0];

  const handleMarkAsPaid = async () => {
    if (!selectedInvoice || selectedInvoice.status === "Paid") return;
    setIsMarkingPaid(true);
    try {
      const res = await fetchAPI(`/api/v1/invoices/${selectedInvoice.id}`, {
        method: "PATCH",
      });
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === selectedInvoice.id ? { ...invoice, status: res.data?.status || "Paid" } : invoice
        )
      );
    } catch (err) {
      console.error("Failed to mark invoice as paid", err);
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleCreateManualInvoice = async () => {
    const clientName = window.prompt("Client name");
    if (!clientName) return;

    const clientEmail = window.prompt("Client email", "");
    if (clientEmail === null) return;

    const amountInput = window.prompt("Invoice amount", "2500");
    if (!amountInput) return;

    const dueDate = window.prompt("Due date (YYYY-MM-DD)", new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
    if (!dueDate) return;

    const amount = Number(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert("Enter valid amount.");
      return;
    }

    setIsCreatingInvoice(true);
    try {
      const res = await fetchAPI("/api/v1/invoices", {
        method: "POST",
        body: JSON.stringify({ clientName, clientEmail, amount, dueDate }),
      });

      const refreshed = await fetchAPI("/api/v1/invoices");
      setInvoices(refreshed.data || []);
      if (res.data?.id) {
        setActiveInvoiceId(res.data.id);
      }
    } catch (err) {
      console.error("Failed to create invoice", err);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 w-full bg-white text-[#111827]">
      {/* ===== LEFT COLUMN: Invoice List ===== */}
      <div className="flex-1 flex flex-col pt-6 pl-8 pr-6 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none mb-1.5">My Invoices</h2>
            <p className="text-[12px] text-gray-500 font-medium">Manage and track all your invoices.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateManualInvoice}
              disabled={isCreatingInvoice}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
            >
              {isCreatingInvoice ? "Creating..." : "Add Manual Invoice"}
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNewSequence}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full transition-colors"
            >
              New Reminder Sequence
              <span className="text-[16px] leading-none mb-0.5 font-normal">+</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <button className="flex items-center justify-between w-[110px] text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              All Time <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center justify-between w-[120px] text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              All People <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center justify-between w-[120px] text-[12px] font-medium text-gray-700 bg-white px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
              All Status <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices by people or ID..."
              className="pl-10 pr-4 py-2 text-[12px] bg-white border border-gray-200 rounded-full w-[280px] focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 text-gray-700 placeholder:text-gray-400 font-medium transition-all"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-gray-200 rounded-2xl flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto no-scrollbar relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400">
                  <th className="py-3 px-5 w-12 font-medium">
                    <div className="w-4 h-4 border border-gray-200 rounded flex items-center justify-center bg-gray-50"></div>
                  </th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Invoice ID</th>
                  <th className="py-3 px-4 font-medium">People</th>
                  <th className="py-3 px-3 text-center font-medium">Status</th>
                  <th className="py-3 px-3 font-medium">Reminder</th>
                  <th className="py-3 px-4 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                      No invoices found. Click &ldquo;Sync&rdquo; to pull from Stripe.
                    </td>
                  </tr>
                ) : (
                  invoices.map((row) => {
                    const amountStr = row.amount ? row.amount.toFixed(2) : "0.00";
                    const [amountInt, amountDec] = amountStr.split('.');
                    const statusStr = row.status || 'Draft';
                    return (
                    <tr 
                      key={row.id} 
                      onClick={() => setActiveInvoiceId(row.id)}
                      className={`text-[12px] transition-colors cursor-pointer ${activeInvoiceId === row.id ? "bg-[#F3F4F6]" : "hover:bg-gray-50"}`}
                    >
                      <td className="py-3 px-5 w-12">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${activeInvoiceId === row.id ? "border-gray-400 bg-white" : "border-gray-200 bg-white"}`}>
                          {activeInvoiceId === row.id && <div className="w-2 h-2 rounded-sm bg-gray-600"></div>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{row.id.substring(0, 15)}...</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          <img src={`https://i.pravatar.cc/100?img=${row.clientAvatarImg || 1}`} alt={row.clientName || 'Unknown'} className="w-full h-full object-cover grayscale opacity-80" />
                        </div>
                        <span className="font-medium text-gray-700">{row.clientName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex justify-center">
                        <span className={`text-[11px] font-medium px-3 py-1 rounded-full border
                          ${statusStr === "Paid" ? "border-gray-200 text-gray-500 bg-white" : 
                            statusStr === "Pending" ? "border-gray-200 text-gray-600 bg-gray-50" :
                            statusStr === "Overdue" ? "border-red-200 text-red-700 bg-red-50" :
                            statusStr === "Draft" ? "border-gray-200 text-gray-800 bg-white shadow-sm" :
                            statusStr === "Cancelled" ? "border-gray-200 text-gray-500 bg-white" : ""
                          }`}>
                          {statusStr}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-medium">
                      {statusStr === "Overdue" ? "Escalating" : "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700 text-right">
                      ${amountInt}<span className="text-gray-400">.{amountDec}</span>
                    </td>
                  </tr>
                )
              }))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
              Showing
              <button className="flex items-center gap-1 font-semibold text-gray-700 px-2 py-1 rounded bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                15 <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              of 100
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium text-gray-500">
              <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-6 h-6 flex items-center justify-center font-semibold text-gray-900 bg-gray-100 rounded">1</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">2</button>
              <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900">3</button>
              <span className="px-1 tracking-widest text-gray-400">...</span>
              <button className="w-6 h-6 flex items-center justify-center hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT COLUMN: Invoice Preview Panel ===== */}
      <div className="w-[400px] flex flex-col shrink-0 m-6 ml-0 border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden">
        {selectedInvoice ? (
          <>
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[14px] font-bold text-gray-900">Invoice Preview</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMarkAsPaid}
                  disabled={isMarkingPaid || selectedInvoice.status === "Paid"}
                  className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  {isMarkingPaid ? "Saving..." : "Mark as Paid"} <CheckCircle2 className="w-4 h-4 text-gray-400" />
                </button>
                <div className="flex items-center gap-2 text-gray-400">
                  <button className="hover:text-gray-700 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  <button className="hover:text-gray-700 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Panel Content (Scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-[18px] font-bold text-gray-900 tracking-tight leading-none truncate max-w-[200px]" title={selectedInvoice.id}>
                    {selectedInvoice.id}
                  </h2>
                  <span className={`text-[11px] font-medium px-3 py-1 rounded-full border bg-white shadow-sm
                    ${selectedInvoice.status === "Paid" ? "border-gray-200 text-gray-500" :
                      selectedInvoice.status === "Overdue" ? "border-red-200 text-red-700 bg-red-50" :
                      "border-gray-200 text-gray-600 bg-gray-50"}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium mb-1.5">Issued on:</p>
                  <p className="text-[13px] font-semibold text-gray-900">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium mb-1.5">Due on:</p>
                  <p className="text-[13px] font-semibold text-gray-900">
                    {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>

              {/* Bill from / Bill to */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium mb-2.5">Bill from</p>
                  <div className="w-9 h-9 rounded-full bg-gray-200 mb-2 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=5`} alt="Jamil" className="w-full h-full object-cover grayscale opacity-90" />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-900 mb-1">Jamil Suta</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[140px]">553, Park Avenue, East Side New York</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-medium mb-2.5">Bill to</p>
                  <div className="w-9 h-9 rounded-full bg-gray-200 mb-2 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${selectedInvoice.clientAvatarImg || 1}`} alt={selectedInvoice.clientName || 'Unknown'} className="w-full h-full object-cover grayscale opacity-90" />
                  </div>
                  <p className="text-[13px] font-semibold text-gray-900 mb-1">{selectedInvoice.clientName || 'Unknown Client'}</p>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[140px]">Customer via Stripe Connect</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-5">
                <p className="text-[11px] text-gray-400 font-medium mb-2.5">Items</p>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-medium text-gray-400">
                      <th className="py-2.5 w-1/2">Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Price</th>
                      <th className="py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="text-[12px] text-gray-700 font-medium">
                      <td className="py-2.5 flex gap-2">
                        <span className="text-gray-400">1.</span>
                        <span className="truncate max-w-[130px]">Invoice Balance</span>
                      </td>
                      <td className="py-2.5 text-center text-gray-500">1</td>
                      <td className="py-2.5 text-right text-gray-500">${selectedInvoice.amount?.toLocaleString()}.00</td>
                      <td className="py-2.5 text-right text-gray-900">${selectedInvoice.amount?.toLocaleString()}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-6 border-t border-gray-100 pt-4 pl-4">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-semibold">${selectedInvoice.amount?.toLocaleString()}.00</span>
                </div>
                <div className="flex items-center justify-between text-[13px] pt-2.5 mt-1 border-t border-dashed border-gray-200">
                  <span className="text-gray-800 font-semibold">Grand total</span>
                  <span className="text-gray-900 font-bold">${selectedInvoice.amount?.toLocaleString()}.00</span>
                </div>
              </div>

              <div className="mb-4">
                <ReminderTimeline stages={previewReminderStages} />
              </div>

              {/* Footer Text */}
              <p className="text-[11px] text-gray-400 font-medium text-center pb-1">
                Connected read-only via <span className="text-gray-700 font-semibold">Stripe</span>. Payment issues? Email <a href="#" className="text-gray-900 font-semibold underline decoration-gray-300 underline-offset-2">billing@mlforge.com</a>
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            Select an invoice to preview
          </div>
        )}
      </div>
    </div>
  );
}
