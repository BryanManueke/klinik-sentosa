import { useCallback, useState } from 'react';
import { prescriptionsAPI } from '@/api/client';
import { toast } from 'sonner';

export interface PaymentTracking {
  prescriptionId: string;
  status: 'pending' | 'processed' | 'paid';
  lastUpdated: Date;
  amount: number;
}

/**
 * Hook untuk manage payment tracking
 * Menangani proses pembayaran dan update status secara real-time
 */
export const usePaymentTracking = () => {
  const [payments, setPayments] = useState<PaymentTracking[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = useCallback(async (prescriptionId: string) => {
    try {
      setIsProcessing(true);
      await prescriptionsAPI.pay(prescriptionId);
      
      // Update local state
      setPayments((prev) =>
        prev.map((p) =>
          p.prescriptionId === prescriptionId
            ? { ...p, status: 'paid', lastUpdated: new Date() }
            : p
        )
      );

      toast.success('✅ Pembayaran berhasil dikonfirmasi');
      return true;
    } catch (error) {
      toast.error('❌ Gagal memproses pembayaran');
      console.error('Payment error:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const trackPayment = useCallback(
    (prescriptionId: string, status: 'pending' | 'processed' | 'paid', amount: number) => {
      setPayments((prev) => {
        const existing = prev.find((p) => p.prescriptionId === prescriptionId);
        if (existing) {
          return prev.map((p) =>
            p.prescriptionId === prescriptionId
              ? { ...p, status, lastUpdated: new Date() }
              : p
          );
        }
        return [...prev, { prescriptionId, status, lastUpdated: new Date(), amount }];
      });
    },
    []
  );

  const getPaymentStatus = useCallback(
    (prescriptionId: string) => {
      return payments.find((p) => p.prescriptionId === prescriptionId)?.status || 'unknown';
    },
    [payments]
  );

  return {
    payments,
    isProcessing,
    processPayment,
    trackPayment,
    getPaymentStatus,
  };
};
