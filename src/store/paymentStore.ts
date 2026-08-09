import { create } from 'zustand';

// ── Types ─────────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentSubmission {
  id: string;
  memberName: string;
  memberEmail: string;
  membershipTier: string;
  amountPaid: number;
  receiptImageBase64: string; // data URL
  submittedAt: string;        // ISO string
  status: PaymentStatus;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface QRConfig {
  qrImageBase64: string;      // data URL of the QR image
  bankName: string;
  accountNumber: string;
  instructions: string;
}

interface PaymentState {
  submissions: PaymentSubmission[];
  qrConfig: QRConfig;

  // Member actions
  submitPayment: (data: Omit<PaymentSubmission, 'id' | 'submittedAt' | 'status'>) => void;

  // Admin actions
  updateQRConfig: (config: Partial<QRConfig>) => void;
  approvePayment: (id: string, note?: string) => void;
  rejectPayment: (id: string, note?: string) => void;
}

// ── LocalStorage helpers ───────────────────────────────────────────────────────
const SUBMISSIONS_KEY = 'uk_fitness_payments';
const QR_CONFIG_KEY   = 'uk_fitness_qr_config';

const DEFAULT_QR_CONFIG: QRConfig = {
  qrImageBase64: '',
  bankName: 'eSewa / Khalti',
  accountNumber: '9800000000',
  instructions: 'Scan the QR code, pay the exact membership amount, then upload your receipt screenshot below.',
};

const loadSubmissions = (): PaymentSubmission[] => {
  try { return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]'); }
  catch { return []; }
};

const loadQRConfig = (): QRConfig => {
  try { return JSON.parse(localStorage.getItem(QR_CONFIG_KEY) || 'null') ?? DEFAULT_QR_CONFIG; }
  catch { return DEFAULT_QR_CONFIG; }
};

const saveSubmissions = (subs: PaymentSubmission[]) =>
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
const saveQRConfig = (cfg: QRConfig) =>
  localStorage.setItem(QR_CONFIG_KEY, JSON.stringify(cfg));

// ── Store ──────────────────────────────────────────────────────────────────────
export const usePaymentStore = create<PaymentState>((set, get) => ({
  submissions: loadSubmissions(),
  qrConfig:    loadQRConfig(),

  submitPayment: (data) => {
    const newSub: PaymentSubmission = {
      ...data,
      id: `pay_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newSub, ...get().submissions];
    set({ submissions: updated });
    saveSubmissions(updated);
  },

  updateQRConfig: (partial) => {
    const updated = { ...get().qrConfig, ...partial };
    set({ qrConfig: updated });
    saveQRConfig(updated);
  },

  approvePayment: (id, note) => {
    const updated = get().submissions.map(s =>
      s.id === id ? { ...s, status: 'approved' as PaymentStatus, reviewedAt: new Date().toISOString(), reviewNote: note } : s
    );
    set({ submissions: updated });
    saveSubmissions(updated);
  },

  rejectPayment: (id, note) => {
    const updated = get().submissions.map(s =>
      s.id === id ? { ...s, status: 'rejected' as PaymentStatus, reviewedAt: new Date().toISOString(), reviewNote: note } : s
    );
    set({ submissions: updated });
    saveSubmissions(updated);
  },
}));
