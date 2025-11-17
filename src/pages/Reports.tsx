import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, DollarSign } from 'lucide-react';

const Reports = () => {
  const monthlyStats = {
    patients: { total: 324, growth: '+12%' },
    revenue: { total: 'Rp 48.5jt', growth: '+8%' },
    medicines: { total: 156, growth: '-3%' },
    appointments: { total: 278, growth: '+15%' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laporan & Analitik</h1>
        <p className="text-muted-foreground">Ringkasan performa dan statistik klinik</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien (Bulan Ini)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.patients.total}</div>
            <p className="text-xs text-secondary mt-1">{monthlyStats.patients.growth} dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.revenue.total}</div>
            <p className="text-xs text-secondary mt-1">{monthlyStats.revenue.growth} dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obat Terjual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.medicines.total}</div>
            <p className="text-xs text-destructive mt-1">{monthlyStats.medicines.growth} dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kunjungan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyStats.appointments.total}</div>
            <p className="text-xs text-secondary mt-1">{monthlyStats.appointments.growth} dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grafik Kunjungan Pasien</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-dashed">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Grafik kunjungan pasien akan ditampilkan di sini</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Obat Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Paracetamol 500mg', sold: 145, revenue: 'Rp 72,500' },
                { name: 'Amoxicillin 500mg', sold: 89, revenue: 'Rp 178,000' },
                { name: 'Vitamin C 1000mg', sold: 67, revenue: 'Rp 100,500' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sold} terjual</p>
                  </div>
                  <p className="font-semibold text-primary">{item.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokter Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Dr. Sarah Wijaya', patients: 78, specialty: 'Umum' },
                { name: 'Dr. Ahmad Fauzi', patients: 65, specialty: 'Gigi' },
                { name: 'Dr. Linda Kusuma', patients: 54, specialty: 'Anak' },
              ].map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium text-foreground">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                  </div>
                  <p className="font-semibold text-secondary">{doctor.patients} pasien</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
  );
};

export default Reports;
