import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  RefreshCw,
  AlertCircle,
  X,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Payment, Order } from '../types';
import { paymentAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface KHQRPaymentModalProps {
  order: Order;
  payment: Payment;
  onClose: () => void;
  onPaymentSuccess: (paidOrder: Order) => void;
}

export const KHQRPaymentModal: React.FC<KHQRPaymentModalProps> = ({
  order,
  payment: initialPayment,
  onClose,
  onPaymentSuccess,
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<Payment>(initialPayment);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const diff = Math.floor((new Date(initialPayment.expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff > 0 ? diff : 900); // 15 mins default
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('Listening for payment...');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Expiration Countdown Timer
  useEffect(() => {
    if (isPaid) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVerifying(false);
          setStatusMessage('Payment time expired. Please generate a new QR code.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid]);

  // Polling backend verification API every 3 seconds
  useEffect(() => {
    if (isPaid || secondsLeft <= 0) return;

    const interval = setInterval(async () => {
      try {
        const res = await paymentAPI.checkStatus(payment._id);
        if (res.success && res.paid) {
          setIsPaid(true);
          setIsVerifying(false);
          clearInterval(interval);

          // Confetti celebration
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          setTimeout(() => {
            onPaymentSuccess({
              ...order,
              paymentStatus: 'paid',
              orderStatus: 'completed',
              transactionRef: payment.transactionId,
            });
          }, 1200);
        } else if (res.message) {
          setStatusMessage(res.message);
        }
      } catch (err) {
        console.warn('Polling check error:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [payment._id, isPaid, secondsLeft, order, onPaymentSuccess]);

  // Handle Sandbox Simulation Trigger
  const handleSimulatePayment = async () => {
    try {
      setSimulating(true);
      const res = await paymentAPI.simulatePayment(payment._id);
      if (res.success) {
        setIsPaid(true);
        setIsVerifying(false);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
        setTimeout(() => {
          onPaymentSuccess({
            ...order,
            paymentStatus: 'paid',
            orderStatus: 'completed',
            transactionRef: payment.transactionId,
          });
        }, 1200);
      }
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Header Ribbon - Official KHQR Red */}
        <div className="bg-[#e11d48] text-white p-4 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-1.5 font-extrabold text-lg tracking-wider">
            <span>KHQR</span>
            <span className="text-[10px] bg-white text-[#e11d48] px-1.5 py-0.5 rounded font-black tracking-normal">
              BAKONG
            </span>
          </div>
          <p className="text-xs text-rose-100 mt-0.5">
            National Bank of Cambodia Standard
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Success Overlay if already paid */}
          {isPaid ? (
            <div className="py-12 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900">{t('orderSuccessTitle')}</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">{t('orderSuccessSubtitle')}</p>
              <div className="mt-4 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                Transaction ID: {payment.transactionId}
              </div>
            </div>
          ) : (
            <>
              {/* Merchant Details & Amount */}
              <div className="text-center mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('merchant')}
                </p>
                <h4 className="text-base font-bold text-gray-800">NAVASEAL STORE</h4>
                <div className="mt-1 flex items-baseline justify-center gap-2">
                  <span className="text-2xl font-black text-gray-900">${payment.amount.toFixed(2)} USD</span>
                  <span className="text-xs font-semibold text-gray-400">
                    ({(payment.amount * 4100).toLocaleString()} ៛)
                  </span>
                </div>
              </div>

              {/* Official KHQR Frame */}
              <div className="relative p-3.5 rounded-2xl bg-white border-2 border-[#e11d48] shadow-md flex flex-col items-center">
                {/* Top KHQR Tag Header */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gray-100 px-1">
                  <span className="text-[11px] font-black text-[#e11d48] tracking-widest">KHQR</span>
                  <span className="text-[10px] text-gray-400 font-medium">Bakong NBC</span>
                </div>

                {/* QR Code Image */}
                <div className="relative w-56 h-56 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={payment.qrCode}
                    alt="Bakong KHQR Payment Code"
                    className="w-full h-full object-contain"
                  />
                  {/* Center Bakong Logo watermark */}
                  <div className="absolute w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#e11d48] font-black text-xs">
                    KH
                  </div>
                </div>

                {/* Order & Transaction tags */}
                <div className="w-full pt-2 mt-2 border-t border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-mono truncate">
                    Order: {order.orderNumber}
                  </p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('timeRemaining')}:</span>
                <span className="font-mono text-gray-900 font-bold">{formatTime(secondsLeft)}</span>
              </div>

              {/* Polling Status message */}
              <div className="mt-3 flex items-center gap-2 text-xs text-brand-600 font-medium animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{statusMessage}</span>
              </div>

              {/* Supported Banking Apps icons */}
              <div className="mt-4 pt-3 border-t border-gray-100 w-full text-center">
                <p className="text-[11px] text-gray-400 mb-2">{t('openBankingApp')}</p>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-600 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">ABA Mobile</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Acleda toUS</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700">Wing Bank</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700">Bakong App</span>
                </div>
              </div>

              {/* Sandbox Simulation Trigger */}
              <div className="mt-5 w-full bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-center">
                <p className="text-[11px] text-amber-800 font-semibold mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t('sandboxNotice')}</span>
                </p>
                <button
                  onClick={handleSimulatePayment}
                  disabled={simulating}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {simulating ? 'Verifying with Bakong...' : t('simulatePaymentBtn')}
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={onClose}
                className="mt-3 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                {t('cancelPayment')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

