import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Activity, TrendingUp, Calendar, AlertCircle, FileText, User, Bell, ArrowRight, CheckCircle2, Pill, DollarSign, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { roles } from '@/contexts/AuthContext';
import { QueueStatusCard } from '@/components/patient/QueueStatusCard';
import { MedicalRecordsCard } from '@/components/patient/MedicalRecordsCard';
import { PrescriptionCard } from '@/components/patient/PrescriptionCard';
import { PrescriptionPaymentTracker } from '@/components/patient/PrescriptionPaymentTracker';
import { queueAPI, medicalRecordsAPI, prescriptionsAPI } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentTracking } from '@/hooks/usePaymentTracking';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const { queue, prescriptions, medicines, medicalRecords, patients, addToQueue, payPrescription } = useData();
  const navigate = useNavigate();

  // State for patient-specific data from API
  const [patientQueue, setPatientQueue] = useState<any[]>([]);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State for Queue Dialog
  const [showQueueDialog, setShowQueueDialog] = useState(false);
  const [queueDoctor, setQueueDoctor] = useState('');
  const [queueComplaint, setQueueComplaint] = useState('');

  // State for Contact Dialog
  const [showContactDialog, setShowContactDialog] = useState(false);

  // Find patient data (works for both patient and staff views)
  const patientData = user?.role === roles.PATIENT
    ? patients.find(p => p.name.toLowerCase() === user.name.toLowerCase())
    : null;

  // Fetch patient-specific data from API (only for patient role)
  useEffect(() => {
    if (user?.role !== roles.PATIENT || !patientData) return;

    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const [queueData, recordsData, prescriptionsData] = await Promise.all([
          queueAPI.getByPatient(patientData.id),
          medicalRecordsAPI.getAll(patientData.id),
          prescriptionsAPI.getByPatient(patientData.id),
        ]);

        setPatientQueue(queueData);
        setPatientRecords(recordsData);
        setPatientPrescriptions(prescriptionsData);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        // Fallback to local data if API fails
        setPatientQueue(queue.filter(q => q.patientId === patientData.id));
        setPatientRecords(medicalRecords.filter(r => r.patientId === patientData.id));
        setPatientPrescriptions(prescriptions.filter(p => p.patientId === patientData.id));
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, patientData?.id]);


  // Handle Queue Registration
  const handleRegisterQueue = () => {
    if (!patientData) {
      toast.error('Data pasien tidak ditemukan');
      return;
    }

    if (!queueDoctor || !queueComplaint) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    addToQueue(patientData.id, queueDoctor, queueComplaint);

    toast.success('Berhasil mendaftar antrian!');
    setShowQueueDialog(false);
    setQueueDoctor('');
    setQueueComplaint('');

    // Refresh queue data
    setTimeout(() => {
      if (patientData) {
        setPatientQueue(queue.filter(q => q.patientId === patientData.id));
      }
    }, 500);
  };

  // Handle View Medical History
  const handleViewHistory = () => {
    if (patientData) {
      navigate(`/patients/${patientData.id}`);
    }
  };

  // Handle Pay Prescription
  const handlePayPrescription = (prescriptionId: string) => {
    payPrescription(prescriptionId);
    toast.success('Pembayaran berhasil!');

    // Refresh prescription data
    setTimeout(() => {
      if (patientData) {
        setPatientPrescriptions(prescriptions.filter(p => p.patientId === patientData.id));
      }
    }, 500);
  };

  // --- PATIENT VIEW ---
  if (user?.role === roles.PATIENT) {
    // Calculate patient statistics
    const totalVisits = patientRecords.length;
    const activeQueue = patientQueue.find(q => q.status === 'waiting' || q.status === 'in-progress');
    const pendingPrescriptions = patientPrescriptions.filter(p => p.status === 'pending' || p.status === 'processed').length;
    const totalSpent = patientPrescriptions
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.totalPrice, 0);

    // Patient Journey Timeline
    const journeySteps = [
      {
        id: 1,
        label: 'Registrasi',
        icon: User,
        completed: true,
        description: 'Terdaftar sebagai pasien'
      },
      {
        id: 2,
        label: 'Antrian',
        icon: Clock,
        completed: activeQueue !== undefined,
        active: activeQueue?.status === 'waiting',
        description: activeQueue ? `Nomor antrian: ${activeQueue.id}` : 'Belum dalam antrian'
      },
      {
        id: 3,
        label: 'Pemeriksaan',
        icon: Activity,
        completed: activeQueue?.status === 'completed',
        active: activeQueue?.status === 'in-progress',
        description: activeQueue?.status === 'in-progress' ? 'Sedang diperiksa' : 'Menunggu pemeriksaan'
      },
      {
        id: 4,
        label: 'Resep',
        icon: Pill,
        completed: patientPrescriptions.length > 0,
        description: `${patientPrescriptions.length} resep`
      },
      {
        id: 5,
        label: 'Pembayaran',
        icon: DollarSign,
        completed: patientPrescriptions.some(p => p.status === 'paid'),
        description: pendingPrescriptions > 0 ? `${pendingPrescriptions} pending` : 'Selesai'
      },
    ];

    return (
      <div className="space-y-6">
        {/* Header with Welcome Message */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Selamat Datang, {user.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Pantau perjalanan kesehatan Anda di Sentosa Health Hub
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
              {pendingPrescriptions > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingPrescriptions}</Badge>
              )}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <>
            {/* Patient Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Kunjungan
                  </CardTitle>
                  <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVisits}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Riwayat pemeriksaan
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status Antrian
                  </CardTitle>
                  <Clock className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeQueue ? activeQueue.id : '-'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeQueue ? `${activeQueue.status === 'waiting' ? 'Menunggu' : 'Sedang diperiksa'}` : 'Tidak dalam antrian'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resep Aktif
                  </CardTitle>
                  <Pill className="h-4 w-4 text-medical-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingPrescriptions}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Menunggu pembayaran
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Biaya
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rp {(totalSpent / 1000).toFixed(0)}k
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total yang dibayar
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Patient Journey Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Perjalanan Anda Hari Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {journeySteps.map((step, index) => {
                      const Icon = step.icon;
                      const isLast = index === journeySteps.length - 1;

                      return (
                        <div key={step.id} className="flex items-center flex-1">
                          <div className="flex flex-col items-center">
                            <div className={`
                              relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                              ${step.completed ? 'bg-primary border-primary text-primary-foreground' :
                                step.active ? 'bg-accent border-accent text-accent-foreground animate-pulse' :
                                  'bg-muted border-muted-foreground/20 text-muted-foreground'}
                            `}>
                              {step.completed ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                <Icon className="h-6 w-6" />
                              )}
                            </div>
                            <div className="mt-2 text-center">
                              <p className={`text-sm font-medium ${step.active ? 'text-accent' : step.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                                {step.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {step.description}
                              </p>
                            </div>
                          </div>
                          {!isLast && (
                            <div className={`flex-1 h-0.5 mx-2 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Queue Status Card */}
              <QueueStatusCard queueData={patientQueue} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Aksi Cepat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Register Queue Dialog */}
                  <Dialog open={showQueueDialog} onOpenChange={setShowQueueDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-between" variant="outline" disabled={!!activeQueue}>
                        <span>Daftar Antrian Baru</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Daftar Antrian Baru</DialogTitle>
                        <DialogDescription>
                          Silakan pilih dokter dan masukkan keluhan Anda
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="doctor">Pilih Dokter</Label>
                          <Select value={queueDoctor} onValueChange={setQueueDoctor}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih dokter" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dr. Sarah">Dr. Sarah - Umum</SelectItem>
                              <SelectItem value="Dr. Ahmad">Dr. Ahmad - Gigi</SelectItem>
                              <SelectItem value="Dr. Linda">Dr. Linda - Anak</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complaint">Keluhan</Label>
                          <Textarea
                            id="complaint"
                            placeholder="Jelaskan keluhan Anda..."
                            value={queueComplaint}
                            onChange={(e) => setQueueComplaint(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowQueueDialog(false)}>
                          Batal
                        </Button>
                        <Button className="flex-1" onClick={handleRegisterQueue}>
                          Daftar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="w-full justify-between"
                    variant="outline"
                    onClick={handleViewHistory}
                  >
                    <span>Lihat Riwayat Lengkap</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Pay Prescription Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full justify-between"
                        variant="outline"
                        disabled={pendingPrescriptions === 0}
                      >
                        <span>Bayar Resep</span>
                        {pendingPrescriptions > 0 && (
                          <Badge variant="destructive">{pendingPrescriptions}</Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pembayaran Resep</DialogTitle>
                        <DialogDescription>
                          Pilih resep yang ingin dibayar
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
                        {patientPrescriptions
                          .filter(p => p.status === 'pending' || p.status === 'processed')
                          .map(prescription => (
                            <div key={prescription.id} className="border rounded-lg p-4 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{prescription.id}</p>
                                  <p className="text-sm text-muted-foreground">{prescription.date}</p>
                                </div>
                                <Badge variant={prescription.status === 'processed' ? 'default' : 'secondary'}>
                                  {prescription.status === 'processed' ? 'Siap Diambil' : 'Pending'}
                                </Badge>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium">Obat:</p>
                                <ul className="list-disc list-inside">
                                  {prescription.items.map((item: any, idx: number) => (
                                    <li key={idx}>{item.medicineName} x{item.amount}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-bold">Total: Rp {prescription.totalPrice.toLocaleString('id-ID')}</span>
                                <Button size="sm" onClick={() => handlePayPrescription(prescription.id)}>
                                  Bayar
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Contact Clinic Dialog */}
                  <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-between" variant="outline">
                        <span>Hubungi Klinik</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Hubungi Kami</DialogTitle>
                        <DialogDescription>
                          Informasi kontak Sentosa Health Hub
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Telepon</p>
                            <p className="text-sm text-muted-foreground">+62 21 1234 5678</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">info@sentosahealth.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Clock className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">Jam Operasional</p>
                            <p className="text-sm text-muted-foreground">Senin - Sabtu: 08:00 - 20:00</p>
                            <p className="text-sm text-muted-foreground">Minggu: 09:00 - 15:00</p>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => setShowContactDialog(false)}>
                        Tutup
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Medical Records and Prescriptions */}
            <div className="grid gap-6 lg:grid-cols-2">
              <MedicalRecordsCard records={patientRecords} />
              <PrescriptionCard prescriptions={patientPrescriptions} />
            </div>
          </>
        )}
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
