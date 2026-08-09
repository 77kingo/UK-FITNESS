import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Upload, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Copy, Check } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import { Button } from '../common/Button';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipTier: string;
  amount: number;
  initialName?: string;
  initialEmail?: string;
}

export const QRPaymentModal: React.FC<QRPaymentModalProps> = ({
  isOpen,
  onClose,
  membershipTier,
  amount,
  initialName = '',
  initialEmail = '',
}) => {
  const { qrConfig, submitPayment } = usePaymentStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [memberName, setMemberName] = useState(initialName);
  const [memberEmail, setMemberEmail] = useState(initialEmail);
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberEmail.trim()) {
      setError('Please enter your name and email address.');
      return;
    }
    if (!receiptBase64) {
      setError('Please upload a screenshot or photo of your payment receipt.');
      return;
    }

    submitPayment({
      memberName: memberName.trim(),
      memberEmail: memberEmail.trim(),
      membershipTier,
      amountPaid: amount,
      receiptImageBase64: receiptBase64,
    });

    setLastSubmittedId(`PAY-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep(3);
  };

  const handleCopyAcc = () => {
    if (!qrConfig.accountNumber) return;
    navigator.clipboard.writeText(qrConfig.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep(1);
    setError(null);
    setReceiptBase64('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-xl rounded-3xl border border-gray-800 p-6 md:p-8 relative overflow-hidden bg-brand-dark/95 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center text-brand-neon">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white uppercase tracking-tight">QR Code Payment</h3>
                <p className="text-xs text-gray-400">Step {step} of 3 • {membershipTier}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Amount Badge */}
          <div className="bg-brand-neon/10 border border-brand-neon/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Membership Plan</span>
              <span className="text-white font-extrabold text-lg">{membershipTier}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Amount</span>
              <span className="text-brand-neon font-black text-2xl">Rs. {amount.toLocaleString()}</span>
            </div>
          </div>

          {/* STEP 1: SCAN QR CODE */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center bg-gray-900/80 border border-gray-800 rounded-2xl p-6 text-center">
                {qrConfig.qrImageBase64 ? (
                  <img
                    src={qrConfig.qrImageBase64}
                    alt="Payment QR Code"
                    className="w-56 h-56 object-contain rounded-xl border border-gray-700 bg-white p-2 mb-4 shadow-lg"
                  />
                ) : (
                  <div className="w-56 h-56 rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-4 mb-4 text-gray-500 bg-black/40">
                    <QrCode className="h-16 w-16 mb-2 text-gray-600 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-center">Gym QR Code</span>
                    <span className="text-[10px] text-gray-600 mt-1">Admin will upload QR code</span>
                  </div>
                )}

                <div className="w-full space-y-2 text-sm text-left border-t border-gray-800 pt-4 mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">Payment Gateway / Bank:</span>
                    <span className="text-white font-bold">{qrConfig.bankName || 'eSewa / FonePay / Khalti'}</span>
                  </div>
                  {qrConfig.accountNumber && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Account / Mobile ID:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-neon font-mono font-bold">{qrConfig.accountNumber}</span>
                        <button
                          onClick={handleCopyAcc}
                          className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors"
                          title="Copy Account Number"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-brand-neon" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 text-xs text-gray-400 leading-relaxed">
                <span className="font-bold text-white block mb-1">💡 Instructions:</span>
                {qrConfig.instructions || 'Scan the QR code with your mobile banking or wallet app, transfer Rs. ' + amount + ', then click next to upload your payment receipt.'}
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wider"
              >
                <span>I Have Completed Payment</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* STEP 2: UPLOAD RECEIPT */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Upload Payment Receipt Screenshot *
                  </label>
                  <div className="relative border-2 border-dashed border-gray-700 hover:border-brand-neon/50 bg-gray-900/50 rounded-xl p-4 text-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {receiptBase64 ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={receiptBase64}
                          alt="Receipt Preview"
                          className="h-16 w-16 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-brand-neon block">Receipt Uploaded!</span>
                          <span className="text-[10px] text-gray-400">Click or drag to replace image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-xs font-bold text-white">Click to upload receipt photo</span>
                        <span className="text-[10px] text-gray-500">PNG, JPG or WEBP up to 5MB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <Button
                  type="submit"
                  className="flex-[2] justify-center py-3 text-xs font-bold uppercase tracking-wider"
                >
                  Submit Payment Verification
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS & RECEIPT CONFIRMATION */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-neon/10 border border-brand-neon/30 text-brand-neon flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-white uppercase tracking-tight">Payment Submitted!</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Your receipt has been submitted for admin verification. Our staff will review your payment shortly.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase block">Receipt Reference</span>
                    <span className="text-xs font-mono font-bold text-brand-neon">{lastSubmittedId}</span>
                  </div>
                  <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    Pending Review
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 text-[10px] block">Member Name</span>
                    <span className="text-white font-bold">{memberName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Membership Plan</span>
                    <span className="text-white font-bold">{membershipTier}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Amount Paid</span>
                    <span className="text-white font-bold">Rs. {amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Submission Date</span>
                    <span className="text-white font-bold">{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full justify-center py-3 text-xs font-bold uppercase tracking-wider"
              >
                Done
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
