import { CheckCircle2, Clock, AlertCircle, Pill, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Prescription } from '@/contexts/DataContext';
import { prescriptionsAPI } from '@/api/client';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useState } from 'react';

interface PrescriptionPaymentTrackerProps {
  patientId: string;
  onPaymentComplete?: (prescriptionId: string) => void;
}

export const PrescriptionPaymentTracker = ({
  patientId,
  onPaymentComplete,
}: PrescriptionPaymentTrackerProps) => {
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time fetch prescriptions
  const { data: prescriptions, loading, refetch } = useRealTimeData<Prescription[]>(
    () => prescriptionsAPI.getByPatient(patientId),
    5000, // polling setiap 5 detik
    autoRefresh
  );

  const getStatusIcon = (status: Prescription['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-5 w-5 text-medical-green" />;
      case 'processed':
        return <Pill className="h-5 w-5 text-accent" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-secondary" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Prescription['status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-medical-green">Sudah Dibayar</Badge>;
      case 'processed':
        return <Badge className="bg-accent">Siap Ambil</Badge>;
      case 'pending':
        return <Badge className="bg-secondary">Menunggu Proses</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusTimeline = (status: Prescription['status']) => {
    const steps = [
      { key: 'pending', label: 'Resep Diterima', icon: Clock },
      { key: 'processed', label: 'Obat Siap', icon: Pill },
      { key: 'paid', label: 'Pembayaran Selesai', icon: DollarSign },
    ];

    const currentIndex = steps.findIndex((s) => s.key === status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading && !prescriptions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Status Pembayaran Resep (Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const paidCount = prescriptions?.filter((p) => p.status === 'paid').length || 0;
  const processedCount = prescriptions?.filter((p) => p.status === 'processed').length || 0;
  const pendingCount = prescriptions?.filter((p) => p.status === 'pending').length || 0;
  const totalSpent = prescriptions
    ?.filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.totalPrice, 0) || 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-3 md:grid-cols-4">
        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground mb-1">Total Resep</div>
            <div className="text-2xl font-bold">{prescriptions?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground mb-1">Menunggu</div>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground mb-1">Siap Ambil</div>
            <div className="text-2xl font-bold text-accent">{processedCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-medical-green/10 border-medical-green/20">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground mb-1">Sudah Bayar</div>
            <div className="text-2xl font-bold text-medical-green">{paidCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Total Spent */}
      {totalSpent > 0 && (
        <Card className="bg-gradient-to-r from-medical-green/10 to-accent/10">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
                <div className="text-3xl font-bold">Rp {(totalSpent / 1000).toFixed(0)}k</div>
              </div>
              <DollarSign className="h-12 w-12 text-medical-green opacity-20" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescriptions List with Status Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Detail Resep
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-primary/10' : ''}
              >
                {autoRefresh ? '🔄 Live' : '⏸ Paused'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => refetch()}>
                🔄 Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!prescriptions || prescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada resep
            </div>
          ) : (
            prescriptions.map((prescription) => {
              const timeline = getStatusTimeline(prescription.status);
              return (
                <div
                  key={prescription.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Resep #{prescription.id}</div>
                      <div className="text-sm text-muted-foreground">
                        Dr. {prescription.doctorName} • {prescription.date}
                      </div>
                    </div>
                    {getStatusBadge(prescription.status)}
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between gap-2 py-2">
                    {timeline.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`rounded-full p-2 ${
                              step.completed ? 'bg-primary/20' : 'bg-muted'
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                step.active
                                  ? 'text-primary'
                                  : step.completed
                                    ? 'text-primary/60'
                                    : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <div className="text-xs text-center text-muted-foreground">
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Items */}
                  <div className="bg-muted/50 rounded p-2 space-y-1">
                    {prescription.items.map((item) => (
                      <div
                        key={item.medicineId}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-muted-foreground">{item.medicineName}</span>
                        <span className="font-medium">{item.amount}x</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Price and Action */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Harga</div>
                      <div className="text-lg font-bold">Rp {(prescription.totalPrice / 1000).toFixed(0)}k</div>
                    </div>
                    {prescription.status === 'processed' && (
                      <Button
                        className="gap-2"
                        onClick={() => onPaymentComplete?.(prescription.id)}
                      >
                        <DollarSign className="h-4 w-4" />
                        Bayar Sekarang
                      </Button>
                    )}
                    {prescription.status === 'paid' && (
                      <div className="flex items-center gap-2 text-medical-green">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Sudah Dibayar</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Auto-refresh Info */}
      <div className="text-xs text-muted-foreground text-center p-2 bg-muted rounded">
        {autoRefresh ? '🔄 Data diperbarui otomatis setiap 5 detik' : '⏸ Auto-refresh dimatikan'}
      </div>
    </div>
  );
};
