import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Activity, TrendingUp, Calendar, AlertCircle, FileText, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { roles } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { queue, prescriptions, medicines, medicalRecords, patients } = useData();

  // --- PATIENT VIEW ---
  if (user?.role === roles.PATIENT) {
    // Find patient data based on logged in user's name (Mock logic)
    const patientData = patients.find(p => p.name.toLowerCase() === user.name.toLowerCase());
    const myQueueItem = patientData ? queue.find(q => q.patientId === patientData.id && (q.status === 'waiting' || q.status === 'in-progress')) : null;
    const myRecords = patientData ? medicalRecords.filter(r => r.patientId === patientData.id) : [];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Pasien</h1>
          <p className="text-muted-foreground">
            Halo, <span className="font-medium text-foreground">{user.name}</span>. Selamat datang di Sentosa Health Hub.
          </p>
        </div>

        {/* Queue Status Card */}
        <Card className={myQueueItem ? "border-primary/50 bg-primary/5" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Status Antrian Anda
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myQueueItem ? (
              <div className="text-center py-6">
                <p className="text-lg font-medium">Nomor Antrian</p>
                <div className="text-4xl font-bold text-primary my-2">{myQueueItem.id}</div>
                <p className="text-muted-foreground mb-4">
                  Status: <span className="font-semibold text-foreground">
                    {myQueueItem.status === 'waiting' ? 'Menunggu' : 'Sedang Diperiksa'}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Dokter: {myQueueItem.doctor} • Estimasi: {myQueueItem.time}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Anda tidak sedang dalam antrian.</p>
                <p className="text-sm mt-2">Silahkan datang ke resepsionis untuk mendaftar.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              Riwayat Pemeriksaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Belum ada riwayat pemeriksaan.</p>
              ) : (
                myRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{record.date}</p>
                        <p className="text-sm text-muted-foreground">Dr. {record.doctorName}</p>
                      </div>
                      <div className="px-2 py-1 bg-accent/10 rounded text-xs font-medium text-accent">
                        Selesai
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Keluhan:</span> {record.complaint}</p>
                      <p><span className="font-medium">Diagnosis:</span> {record.diagnosis}</p>
                      <p><span className="font-medium">Tindakan:</span> {record.treatment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- STAFF/ADMIN VIEW ---

  // Calculate stats
  const waitingCount = queue.filter(q => q.status === 'waiting').length;
  const inProgressCount = queue.filter(q => q.status === 'in-progress').length;
  const completedTodayCount = queue.filter(q => q.status === 'completed').length;

  // Calculate revenue from processed prescriptions today
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = prescriptions
    .filter(p => p.status === 'processed' && p.date === today)
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const stats = [
    { title: 'Pasien Selesai Hari Ini', value: completedTodayCount.toString(), icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Antrian Menunggu', value: waitingCount.toString(), icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'Sedang Diperiksa', value: inProgressCount.toString(), icon: Activity, color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Pendapatan Hari Ini', value: `Rp ${(todayRevenue / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-medical-green', bg: 'bg-medical-green/10' },
  ];

  // Get recent patients from queue (last 5)
  const recentPatients = [...queue].reverse().slice(0, 5);

  const todaySchedule = [
    { time: '08:00 - 12:00', doctor: 'Dr. Sarah', specialty: 'Umum' },
    { time: '13:00 - 17:00', doctor: 'Dr. Ahmad', specialty: 'Gigi' },
    { time: '14:00 - 18:00', doctor: 'Dr. Linda', specialty: 'Anak' },
  ];

  const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, <span className="font-medium text-foreground">{user?.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Patients */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Antrian Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPatients.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Belum ada antrian hari ini.</p>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                        {patient.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{patient.patientName}</p>
                        <p className="text-sm text-muted-foreground">{patient.id} • {patient.time}</p>
                      </div>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${patient.status === 'completed' ? 'bg-secondary/20 text-secondary' : ''}
                      ${patient.status === 'in-progress' ? 'bg-primary/20 text-primary' : ''}
                      ${patient.status === 'waiting' ? 'bg-muted text-muted-foreground' : ''}
                      ${patient.status === 'cancelled' ? 'bg-destructive/20 text-destructive' : ''}
                    `}>
                      {patient.status === 'completed' ? 'Selesai' :
                        patient.status === 'in-progress' ? 'Diperiksa' :
                          patient.status === 'waiting' ? 'Menunggu' : 'Batal'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Jadwal Dokter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((schedule, index) => (
                <div key={index} className="space-y-1 pb-4 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-primary">{schedule.time}</p>
                  <p className="text-sm font-semibold text-foreground">{schedule.doctor}</p>
                  <p className="text-xs text-muted-foreground">{schedule.specialty}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-medical-teal" />
            Perhatian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lowStockMedicines.length > 0 ? (
              lowStockMedicines.map(med => (
                <div key={med.id} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Stok {med.name} menipis</p>
                    <p className="text-xs text-muted-foreground mt-1">Sisa {med.stock} {med.unit}. Segera lakukan pemesanan ulang.</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <AlertCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Semua stok obat aman</p>
                </div>
              </div>
            )}

            {waitingCount > 5 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <Activity className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{waitingCount} pasien sedang menunggu</p>
                  <p className="text-xs text-muted-foreground mt-1">Antrian cukup panjang, mohon percepat pemeriksaan.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
