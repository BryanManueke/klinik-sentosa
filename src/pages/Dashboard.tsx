import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Activity, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Pasien Hari Ini', value: '24', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Antrian Menunggu', value: '8', icon: Clock, color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'Pasien Ditangani', value: '16', icon: Activity, color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Pendapatan Hari Ini', value: 'Rp 4.5jt', icon: TrendingUp, color: 'text-medical-green', bg: 'bg-medical-green/10' },
  ];

  const recentPatients = [
    { id: 'P001', name: 'Budi Santoso', time: '09:30', status: 'Selesai' },
    { id: 'P002', name: 'Siti Nurhaliza', time: '10:15', status: 'Pemeriksaan' },
    { id: 'P003', name: 'Ahmad Fauzi', time: '10:45', status: 'Menunggu' },
    { id: 'P004', name: 'Dewi Lestari', time: '11:00', status: 'Menunggu' },
  ];

  const todaySchedule = [
    { time: '08:00 - 12:00', doctor: 'Dr. Sarah', specialty: 'Umum' },
    { time: '13:00 - 17:00', doctor: 'Dr. Ahmad', specialty: 'Gigi' },
    { time: '14:00 - 18:00', doctor: 'Dr. Linda', specialty: 'Anak' },
  ];

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
              Pasien Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.id} • {patient.time}</p>
                    </div>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${patient.status === 'Selesai' ? 'bg-secondary/20 text-secondary' : ''}
                    ${patient.status === 'Pemeriksaan' ? 'bg-primary/20 text-primary' : ''}
                    ${patient.status === 'Menunggu' ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {patient.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Jadwal Hari Ini
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-medical-teal" />
            Perhatian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Stok obat Paracetamol menipis</p>
                <p className="text-xs text-muted-foreground mt-1">Sisa 50 tablet. Segera lakukan pemesanan ulang.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <Activity className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">8 pasien sedang menunggu</p>
                <p className="text-xs text-muted-foreground mt-1">Perkiraan waktu tunggu: 45 menit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
