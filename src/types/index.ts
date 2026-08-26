export type InvoiceStatus = "Paid" | "Pending" | "Unpaid" | "Overdue" | "Cancelled" | "Draft";
export type PaymentMethod = "Stripe" | "PayPal";
export type PaymentStatus = "Succeeded" | "Refunded" | "Failed" | "Pending";
export type ReminderTone = "gentle" | "firm" | "final";
export type ReminderStageStatus = "sent" | "scheduled" | "pending" | "skipped";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  avatarImg: number;
  totalInvoiced: number;
  outstandingBalance: number;
  onTimeRate: number;
  remindersMuted: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAvatarImg: number;
  amount: number;
  status: InvoiceStatus;
}

export interface Payment {
  id: string;
  date: string;
  invoiceId: string;
  clientName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
}

export interface ReminderStage {
  day: number;
  tone: ReminderTone;
  subject: string;
  body: string;
  status: ReminderStageStatus;
}

export interface ReminderSequence {
  id: string;
  invoiceId: string;
  clientName: string;
  clientAvatarImg: number;
  amount: number;
  currentStageDay: number;
  paused: boolean;
  stages: ReminderStage[];
}

export interface UserSettings {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  reminderCadenceDays: number[];
  planSlug: "solo" | "pro";
}
