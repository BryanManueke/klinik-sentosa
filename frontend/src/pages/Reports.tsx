import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, TrendingUp, Users, DollarSign, BarChart3, PieChart, Calendar, FileSpreadsheet } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const Reports = () => {
  const { patients, prescriptions, medicalRecords, medicines, queue } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Calculate stats
  const totalPatients = patients.length;
  const totalRevenue = prescriptions
    .filter(p => p.status === 'dispensed')
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const totalMedicinesSold = prescriptions
    .filter(p => p.status === 'dispensed')
    .reduce((sum, p) => sum + p.items.reduce((itemSum, item) => itemSum + item.amount, 0), 0);

  const totalVisits = medicalRecords.length;
  const completedQueue = queue.filter(q => q.status === 'completed').length;

  // Calculate top selling medicines
  const medicineSales: Record<string, { name: string, sold: number, revenue: number }> = {};

  prescriptions
    .filter(p => p.status === 'dispensed')
    .forEach(p => {
      p.items.forEach(item => {
        if (!medicineSales[item.medicineId]) {
          medicineSales[item.medicineId] = { name: item.medicineName, sold: 0, revenue: 0 };
        }
        const med = medicines.find(m => m.id === item.medicineId);
        const price = med ? med.price : 0;

        medicineSales[item.medicineId].sold += item.amount;
        medicineSales[item.medicineId].revenue += item.amount * price;
      });
    });

  const topMedicines = Object.values(medicineSales)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const handleExport = (type: string) => {
    toast.success(`Laporan ${type} sedang diproses...`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Laporan & Analitik</h1>
              </div>
              <p className="text-white/90 text-lg">Ringkasan performa dan statistik klinik</p>
            </div>
            <div className="hidden md:block">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-white/90 shadow-xl"
                onClick={() => handleExport('PDF')}
              >
                <Download className="h-5 w-5 mr-2" />
                Export Laporan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-2 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pasien</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-600">{totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Terdaftar di sistem</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-600">Rp {(totalRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground mt-1">Dari resep yang diproses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-2 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Obat Terjual</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-purple-600">{totalMedicinesSold}</div>
            <p className="text-xs text-muted-foreground mt-1">Unit obat keluar</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kunjungan</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-orange-600">{totalVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">Rekam medis tersimpan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Medicines */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PieChart className="h-5 w-5 text-purple-600" />
              Obat Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMedicines.length === 0 ? (
                <div className="text-center py-8">
                  <PieChart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">Belum ada data penjualan obat</p>
                </div>
              ) : (
                topMedicines.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10 hover:border-primary transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.sold} unit terjual</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">Rp {item.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Download className="h-5 w-5 text-green-600" />
              Export Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button
                className="w-full justify-start h-14 text-left bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                onClick={() => handleExport('PDF')}
              >
                <FileText className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-semibold">Export ke PDF</p>
                  <p className="text-xs opacity-90">Laporan lengkap dalam format PDF</p>
                </div>
              </Button>

              <Button
                className="w-full justify-start h-14 text-left bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                onClick={() => handleExport('Excel')}
              >
                <FileSpreadsheet className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-semibold">Export ke Excel</p>
                  <p className="text-xs opacity-90">Data dalam spreadsheet Excel</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-14 text-left border-2"
                onClick={() => handleExport('Bulanan')}
              >
                <Calendar className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-semibold">Laporan Bulanan</p>
                  <p className="text-xs text-muted-foreground">Ringkasan performa bulan ini</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-14 text-left border-2"
                onClick={() => handleExport('Tahunan')}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-semibold">Laporan Tahunan</p>
                  <p className="text-xs text-muted-foreground">Analisis kinerja tahunan</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Statistik Tambahan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-muted-foreground mb-1">Pasien Selesai Hari Ini</p>
              <p className="text-3xl font-bold text-blue-600">{completedQueue}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-2 border-green-200">
              <p className="text-sm text-muted-foreground mb-1">Rata-rata Pendapatan/Resep</p>
              <p className="text-3xl font-bold text-green-600">
                Rp {prescriptions.length > 0 ? Math.round(totalRevenue / prescriptions.filter(p => p.status === 'dispensed').length).toLocaleString() : 0}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border-2 border-purple-200">
              <p className="text-sm text-muted-foreground mb-1">Jenis Obat Tersedia</p>
              <p className="text-3xl font-bold text-purple-600">{medicines.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
