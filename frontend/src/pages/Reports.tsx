import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const Reports = () => {
  const { patients, prescriptions, medicalRecords, medicines } = useData();

  // Calculate stats
  const totalPatients = patients.length;
  const totalRevenue = prescriptions
    .filter(p => p.status === 'processed')
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const totalMedicinesSold = prescriptions
    .filter(p => p.status === 'processed')
    .reduce((sum, p) => sum + p.items.reduce((itemSum, item) => itemSum + item.amount, 0), 0);

  const totalVisits = medicalRecords.length;

  // Calculate top selling medicines
  const medicineSales: Record<string, { name: string, sold: number, revenue: number }> = {};

  prescriptions
    .filter(p => p.status === 'processed')
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan & Analitik</h1>
        <p className="text-muted-foreground">Ringkasan performa dan statistik klinik</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-secondary mt-1">Terdaftar di sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {(totalRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-secondary mt-1">Dari resep yang diproses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obat Terjual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedicinesSold}</div>
            <p className="text-xs text-muted-foreground mt-1">Unit obat keluar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-secondary mt-1">Rekam medis tersimpan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Obat Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMedicines.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Belum ada data penjualan obat.</p>
              ) : (
                topMedicines.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sold} terjual</p>
                    </div>
                    <p className="font-semibold text-primary">Rp {item.revenue.toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Laporan Bulanan
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Laporan Tahunan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
