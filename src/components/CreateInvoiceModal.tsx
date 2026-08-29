"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"

interface Client {
  id: string
  name: string
  email?: string
}

interface CreateInvoiceModalProps {
  clients: Client[]
  onInvoiceCreated?: () => void
}

export function CreateInvoiceModal({ clients, onInvoiceCreated }: CreateInvoiceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showNewClient, setShowNewClient] = useState(false)
  const [clientId, setClientId] = useState("")
  const [newClientName, setNewClientName] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Draft")
  const [error, setError] = useState("")

  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      setError("Client name required")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/v1/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName,
          email: newClientEmail || null,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const newClient = await res.json()
      setClientId(newClient.id)
      setNewClientName("")
      setNewClientEmail("")
      setShowNewClient(false)
      setError("")
    } catch (e) {
      setError(`Failed to create client: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async () => {
    if (!clientId || !amount) {
      setError("Client and amount required")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/v1/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          dueDate: dueDate || undefined,
          amount: parseFloat(amount),
          status,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setClientId("")
      setDueDate("")
      setAmount("")
      setDescription("")
      setStatus("Draft")
      setError("")
      setOpen(false)
      onInvoiceCreated?.()
    } catch (e) {
      setError(`Failed to create invoice: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        New Invoice
      </Button>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

          {!showNewClient ? (
            <div>
              <Label htmlFor="client">Client</Label>
              <div className="flex gap-2 mt-2">
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client" className="flex-1">
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewClient(true)}
                  className="px-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-3 bg-gray-50 rounded">
              <h4 className="font-semibold text-sm">New Client</h4>
              <div>
                <Label htmlFor="new-client-name">Name</Label>
                <Input
                  id="new-client-name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Client name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-client-email">Email (optional)</Label>
                <Input
                  id="new-client-email"
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateClient}
                  disabled={loading || !newClientName.trim()}
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add Client"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewClient(false)
                    setNewClientName("")
                    setNewClientEmail("")
                    setError("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="due-date">Due Date (optional)</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Invoice details..."
              className="mt-1 h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreateInvoice} disabled={loading || !clientId || !amount}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
