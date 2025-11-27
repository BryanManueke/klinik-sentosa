import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Clock, Activity, TrendingUp, Calendar, AlertCircle, FileText, User, Bell, ArrowRight, CheckCircle2, Pill, DollarSign, Phone, Mail, Stethoscope, ClipboardPlus, History, CreditCard, Sparkles, Heart, Eye, Baby, Scissors, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { roles } from '@/contexts/AuthContext';
import { queueAPI, medicalRecordsAPI, prescriptionsAPI } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const { queue, prescriptions, medicines, medicalRecords, patients, staff, addToQueue, dispensePrescription, addPatient } = useData();
  const navigate = useNavigate();

  // State for patient-specific data from API
  const [patientQueue, setPatientQueue] = useState<any[]>([]);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // State for Queue Dialog
  const [showQueueDialog, setShowQueueDialog] = useState(false);
  const [queueForm, setQueueForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    doctor: '',
    complaint: ''
  });

  // State for Medical History Dialog
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  // State for Prescriptions Dialog
  const [showPrescriptionsDialog, setShowPrescriptionsDialog] = useState(false);

  // State for Registration Success Dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newQueueNumber, setNewQueueNumber] = useState('');

  // Find patient data
  const patientData = user?.role === roles.PATIENT
    ? patients.find(p =>
      p.name.toLowerCase() === user.name.toLowerCase() ||
      user.name.toLowerCase().includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(user.name.toLowerCase())
    )
    : null;

  // Get active doctors only
  const activeDoctors = staff.filter(s =>
    s.status === 'active' &&
    s.role.toLowerCase().includes('dokter')
  );

  // Fetch patient-specific data from API
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
        setPatientQueue(queue.filter(q => q.patientId === patientData.id));
        setPatientRecords(medicalRecords.filter(r => r.patientId === patientData.id));
        setPatientPrescriptions(prescriptions.filter(p => p.patientId === patientData.id));
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user?.role, patientData?.id]);

  // Handle Queue Registration
  const handleRegisterQueue = async () => {
    // Validate all required fields
    if (!queueForm.name || !queueForm.age || !queueForm.gender ||
      !queueForm.phone || !queueForm.address || !queueForm.doctor || !queueForm.complaint) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Validate age
    const age = parseInt(queueForm.age);
    if (isNaN(age) || age < 1 || age > 120) {
      toast.error('Usia tidak valid');
      return;
    }

    // Validate phone
    if (!/^08\d{8,11}$/.test(queueForm.phone)) {
      toast.error('Nomor telepon harus dimulai dengan 08 dan 10-13 digit');
      return;
    }

    try {
      // Check if patient exists or create new one
      let currentPatientId = patientData?.id;

      // If the name entered is different from the logged-in user's name, treat it as a new patient
      const isNewPatient = patientData && queueForm.name.toLowerCase() !== patientData.name.toLowerCase();

      if (!currentPatientId || isNewPatient) {
        // Create new patient
        const newPatientData = {
          name: queueForm.name,
          age: age,
          gender: queueForm.gender as 'Laki-laki' | 'Perempuan',
          phone: queueForm.phone,
          address: queueForm.address
        };

        // Add patient to database
        const savedPatient = await addPatient(newPatientData);

        if (savedPatient) {
          currentPatientId = savedPatient.id;
        } else {
          throw new Error('Gagal menyimpan data pasien');
        }
      }

      // Add to queue
      const newItem = await addToQueue(currentPatientId, queueForm.doctor, queueForm.complaint);

      if (newItem) {
        setNewQueueNumber(newItem.id);
        setShowSuccessDialog(true);
        setShowQueueDialog(false);
      }

      // Reset form
      setQueueForm({
        name: '',
        age: '',
        gender: '',
        phone: '',
        address: '',
        doctor: '',
        complaint: ''
      });

      setTimeout(() => {
        if (currentPatientId) {
          setPatientQueue(queue.filter(q => q.patientId === currentPatientId));
        }
      }, 500);
    } catch (error) {
      console.error('Error registering queue:', error);
      toast.error(`Gagal mendaftar antrian: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle View Medical History
  const handleViewHistory = () => {
    if (patientData) {
      navigate(`/patients/${patientData.id}`);
    }
  };

  // Handle Pay Prescription
  const handlePayPrescription = (prescriptionId: string) => {
    dispensePrescription(prescriptionId);
    toast.success('Pembayaran berhasil!');

    setTimeout(() => {
      if (patientData) {
        setPatientPrescriptions(prescriptions.filter(p => p.patientId === patientData.id));
      }
    }, 500);
  };

  // --- PATIENT VIEW ---
  if (user?.role === roles.PATIENT) {
    const activeQueue = patientQueue.find(q => q.status === 'waiting' || q.status === 'in-progress');
    const pendingPrescriptions = patientPrescriptions.filter(p =>
      p.status === 'pending' || p.status === 'processing' || p.status === 'ready'
    ).length;

    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Premium Welcome Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-8 w-8" />
                  <h1 className="text-4xl font-bold">
                    Selamat Datang, {user.name}!
                  </h1>
                </div>
                <p className="text-white/90 text-lg">
                  Kesehatan Anda adalah prioritas kami
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-white/70">ID Pasien</p>
                  <p className="text-xl font-bold">{patientData?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <>
            {/* Active Queue Status - Premium Design */}
            {activeQueue && (
              <Card className="border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 via-white to-accent/5 dark:from-primary/10 dark:via-background dark:to-accent/10">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                        <Clock className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <Badge className={`mb-3 text-base px-4 py-1 ${activeQueue.status === 'in-progress' ? 'bg-green-600' : 'bg-orange-500'}`}>
                        {activeQueue.status === 'in-progress' ? '🩺 Sedang Diperiksa' : '⏳ Menunggu Giliran'}
                      </Badge>
                      <h2 className="text-3xl font-bold mb-2">Nomor Antrian Anda</h2>
                      <p className="text-6xl font-black text-primary mb-3">{activeQueue.id}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge variant="outline" className="text-sm">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          {activeQueue.doctor}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          {activeQueue.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pending Prescriptions Alert */}
            {pendingPrescriptions > 0 && (
              <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-background shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                        <Pill className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">Resep Menunggu Pembayaran</h3>
                      <p className="text-muted-foreground mb-4">
                        Anda memiliki <span className="font-bold text-orange-600">{pendingPrescriptions} resep</span> yang perlu segera dibayar
                      </p>
                      <Button onClick={() => navigate('/prescriptions')} className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Bayar Sekarang
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Action Cards - Premium Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Daftar Antrian - Elegant Card */}
              <Dialog open={showQueueDialog} onOpenChange={setShowQueueDialog}>
                <DialogTrigger asChild>
                  <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary bg-gradient-to-br from-white to-primary/5 dark:from-background dark:to-primary/10">
                    <CardContent className="pt-8 pb-8">
                      <div className="text-center space-y-4">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:shadow-xl transition-all">
                            <ClipboardPlus className="h-10 w-10 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">Daftar Antrian Baru</h3>
                          <p className="text-muted-foreground">
                            {activeQueue ? 'Anda sudah dalam antrian' : 'Klik untuk mendaftar pemeriksaan'}
                          </p>
                        </div>
                        {activeQueue && (
                          <Badge variant="secondary" className="mt-2">Sudah Terdaftar</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Daftar Antrian Baru</DialogTitle>
                    <DialogDescription className="text-base">
                      Lengkapi data diri untuk pendaftaran pemeriksaan
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-6">
                    {/* Data Diri Pasien */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Data Diri Pasien</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-base font-semibold">
                            Nama Lengkap <span className="text-red-500">*</span>
                          </Label>
                          <input
                            id="name"
                            placeholder="Masukkan nama lengkap"
                            value={queueForm.name}
                            onChange={(e) => setQueueForm({ ...queueForm, name: e.target.value })}
                            className="h-12 text-base border-2 w-full px-3 rounded-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-base font-semibold">
                            Usia <span className="text-red-500">*</span>
                          </Label>
                          <input
                            id="age"
                            type="number"
                            placeholder="Usia"
                            value={queueForm.age}
                            onChange={(e) => setQueueForm({ ...queueForm, age: e.target.value })}
                            className="h-12 text-base border-2 w-full px-3 rounded-md"
                            min="1"
                            max="120"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-base font-semibold">
                            Gender <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={queueForm.gender}
                            onValueChange={(value) => setQueueForm({ ...queueForm, gender: value })}
                          >
                            <SelectTrigger className="h-12 text-base border-2">
                              <SelectValue placeholder="Pilih gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                              <SelectItem value="Perempuan">Perempuan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-base font-semibold">
                            Nomor Telepon <span className="text-red-500">*</span>
                          </Label>
                          <input
                            id="phone"
                            placeholder="08xxxxxxxxxx"
                            value={queueForm.phone}
                            onChange={(e) => setQueueForm({ ...queueForm, phone: e.target.value })}
                            className="h-12 text-base border-2 w-full px-3 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-base font-semibold">
                          Alamat Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Masukkan alamat lengkap..."
                          value={queueForm.address}
                          onChange={(e) => setQueueForm({ ...queueForm, address: e.target.value })}
                          rows={3}
                          className="resize-none text-base border-2"
                        />
                      </div>
                    </div>

                    {/* Informasi Pemeriksaan */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg border-b pb-2">Informasi Pemeriksaan</h3>

                      <div className="space-y-2">
                        <Label htmlFor="doctor" className="text-base font-semibold">
                          Pilih Dokter Spesialis <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={queueForm.doctor}
                          onValueChange={(value) => setQueueForm({ ...queueForm, doctor: value })}
                        >
                          <SelectTrigger className="h-14 text-base border-2 focus:border-primary">
                            <SelectValue placeholder="Pilih dokter yang sesuai" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeDoctors.map((doctor) => (
                              <SelectItem key={doctor.id} value={doctor.name} className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {doctor.name.charAt(0)}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-semibold text-base">{doctor.name}</p>
                                    <p className="text-sm text-muted-foreground">{doctor.specialty || doctor.role}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complaint" className="text-base font-semibold">
                          Keluhan Anda <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="complaint"
                          placeholder="Jelaskan keluhan atau gejala yang Anda rasakan..."
                          value={queueForm.complaint}
                          onChange={(e) => setQueueForm({ ...queueForm, complaint: e.target.value })}
                          rows={4}
                          className="resize-none text-base border-2 focus:border-primary"
                        />
                        <p className="text-sm text-muted-foreground">
                          Informasi ini akan membantu dokter mempersiapkan pemeriksaan Anda
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 text-base font-semibold"
                      onClick={() => setShowQueueDialog(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
                      onClick={handleRegisterQueue}
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Daftar Sekarang
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Lihat Riwayat - Elegant Card */}
              <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-accent bg-gradient-to-br from-white to-accent/5 dark:from-background dark:to-accent/10" onClick={handleViewHistory}>
                <CardContent className="pt-8 pb-8">
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-secondary shadow-lg group-hover:shadow-xl transition-all">
                        <History className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Riwayat Medis</h3>
                      <p className="text-muted-foreground">
                        Lihat semua riwayat pemeriksaan Anda
                      </p>
                    </div>
                    <Badge variant="outline" className="text-base px-4 py-1">
                      <FileText className="h-4 w-4 mr-2" />
                      {patientRecords.length} Kunjungan
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics Cards - Premium Design with Click Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Medical History Card - Clickable */}
              <Card
                className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
                onClick={() => setShowHistoryDialog(true)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Riwayat Medis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-blue-600">{patientRecords.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Klik untuk lihat detail</p>
                </CardContent>
              </Card>

              {/* Prescriptions Card - Clickable */}
              <Card
                className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:scale-105"
                onClick={() => setShowPrescriptionsDialog(true)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Pill className="h-4 w-4 text-purple-600" />
                    Resep Aktif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black text-purple-600">{pendingPrescriptions}</div>
                  <p className="text-xs text-muted-foreground mt-2">Klik untuk lihat detail</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    Status Kesehatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {activeQueue ? 'Dalam Perawatan' : 'Baik'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {activeQueue ? 'Sedang dalam pemeriksaan' : 'Tidak ada keluhan aktif'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Medical History Modal */}
            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    Riwayat Medis: {patientData?.name}
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-base">
                    <Badge variant="outline" className="px-2 py-0.5">{patientData?.id}</Badge>
                    <span>{patientData?.gender}, {patientData?.age} Tahun</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {patientRecords.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Belum ada riwayat medis</p>
                    </div>
                  ) : (
                    patientRecords.map((record, index) => (
                      <Card key={record.id} className="border-2 hover:border-blue-500 transition-colors group">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Badge variant="outline">{record.id}</Badge>
                                <span>{record.date}</span>
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Dokter: <span className="font-medium text-foreground">{record.doctorName}</span>
                              </CardDescription>
                            </div>
                            <Badge className="bg-blue-600">Kunjungan #{patientRecords.length - index}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              <p className="text-xs font-semibold text-orange-800 dark:text-orange-200 mb-1">Keluhan</p>
                              <p className="text-sm font-medium">{record.complaint}</p>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                              <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-1">Diagnosis</p>
                              <p className="text-sm font-medium">{record.diagnosis}</p>
                            </div>
                          </div>
                          {record.treatment && (
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              <p className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">Tindakan/Pengobatan</p>
                              <p className="text-sm font-medium">{record.treatment}</p>
                            </div>
                          )}

                          {/* Integrated Prescription Data */}
                          {(() => {
                            const prescription = patientPrescriptions.find(p => p.date === record.date);
                            if (prescription) {
                              return (
                                <div className="mt-4 border-t pt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold flex items-center gap-2">
                                      <Pill className="h-4 w-4 text-purple-600" />
                                      Resep & Obat
                                    </p>
                                    <Badge variant={prescription.status === 'dispensed' ? 'default' : 'outline'} className={prescription.status === 'dispensed' ? 'bg-green-600' : ''}>
                                      {prescription.status === 'dispensed' ? 'Lunas / Selesai' : 'Belum Lunas'}
                                    </Badge>
                                  </div>
                                  <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 space-y-2">
                                    {prescription.items.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between text-sm">
                                        <span>{item.medicineName} <span className="text-muted-foreground">x{item.amount}</span></span>
                                        <span className="italic text-muted-foreground">{item.instructions}</span>
                                      </div>
                                    ))}
                                    <div className="border-t border-purple-200 dark:border-purple-800 pt-2 mt-2 flex justify-between font-semibold">
                                      <span>Total Biaya</span>
                                      <span>Rp {prescription.totalPrice.toLocaleString('id-ID')}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowHistoryDialog(false)}>
                    Tutup
                  </Button>
                  <Button onClick={handleViewHistory} className="bg-blue-600 hover:bg-blue-700">
                    <User className="h-4 w-4 mr-2" />
                    Buka Profil Pasien Lengkap
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Prescriptions Modal */}
            <Dialog open={showPrescriptionsDialog} onOpenChange={setShowPrescriptionsDialog}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    <Pill className="h-6 w-6 text-purple-600" />
                    Resep Obat Anda
                  </DialogTitle>
                  <DialogDescription>
                    Daftar resep obat dan status pengambilan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {patientPrescriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <Pill className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Belum ada resep</p>
                    </div>
                  ) : (
                    patientPrescriptions.map((prescription: any) => (
                      <Card key={prescription.id} className="border-2 hover:border-purple-500 transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Badge variant="outline">{prescription.id}</Badge>
                                <span>{prescription.date}</span>
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Dokter: <span className="font-medium text-foreground">{prescription.doctorName}</span>
                              </CardDescription>
                              {prescription.diagnosis && (
                                <p className="text-sm text-blue-600 font-medium mt-1">
                                  💊 Diagnosis: {prescription.diagnosis}
                                </p>
                              )}
                            </div>
                            <Badge className={`
                              ${prescription.status === 'pending' ? 'bg-orange-500' : ''}
                              ${prescription.status === 'processing' ? 'bg-blue-500' : ''}
                              ${prescription.status === 'ready' ? 'bg-green-500' : ''}
                              ${prescription.status === 'dispensed' ? 'bg-gray-500' : ''}
                            `}>
                              {prescription.status === 'pending' && '⏳ Pending'}
                              {prescription.status === 'processing' && '🔄 Diproses'}
                              {prescription.status === 'ready' && '✅ Siap Diambil'}
                              {prescription.status === 'dispensed' && '✔️ Selesai'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold">Daftar Obat:</p>
                            {prescription.items.map((item: any, idx: number) => (
                              <div key={idx} className="p-4 bg-muted/50 rounded-lg border-l-4 border-purple-500">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-bold text-lg">{item.medicineName}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                      {item.dosage && (
                                        <div>
                                          <span className="text-muted-foreground">Dosis:</span>
                                          <span className="ml-2 font-medium">{item.dosage}</span>
                                        </div>
                                      )}
                                      {item.frequency && (
                                        <div>
                                          <span className="text-muted-foreground">Frekuensi:</span>
                                          <span className="ml-2 font-medium">{item.frequency}</span>
                                        </div>
                                      )}
                                      {item.duration && (
                                        <div>
                                          <span className="text-muted-foreground">Durasi:</span>
                                          <span className="ml-2 font-medium">{item.duration}</span>
                                        </div>
                                      )}
                                      <div>
                                        <span className="text-muted-foreground">Jumlah:</span>
                                        <span className="ml-2 font-medium">{item.amount}x</span>
                                      </div>
                                    </div>
                                    {item.instructions && (
                                      <p className="text-xs text-muted-foreground mt-2 italic">
                                        💊 {item.instructions}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                            <span className="font-semibold text-lg">Total Biaya</span>
                            <span className="text-2xl font-black text-purple-600">
                              Rp {prescription.totalPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                          {prescription.status === 'ready' && (
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-500">
                              <p className="text-green-800 dark:text-green-200 font-semibold flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Resep Anda sudah siap! Silakan ambil di Apotek.
                              </p>
                            </div>
                          )}
                          {prescription.status === 'dispensed' && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-950/20 rounded-lg border-2 border-gray-500">
                              <p className="text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Resep telah diserahkan. Terima kasih!
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowPrescriptionsDialog(false)}>
                    Tutup
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Registration Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-center">Pendaftaran Berhasil!</DialogTitle>
                  <DialogDescription className="text-center text-base">
                    Anda telah terdaftar dalam antrian pemeriksaan.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-2">
                  <p className="text-muted-foreground">Nomor Antrian Anda</p>
                  <p className="text-5xl font-black text-primary tracking-wider">{newQueueNumber}</p>
                  <p className="text-sm text-muted-foreground pt-2">
                    Silakan menunggu panggilan dari petugas kami.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setShowSuccessDialog(false)}
                  >
                    Mengerti
                  </Button>
                </div>
              </DialogContent>
            </Dialog>


            {/* Contact & Info Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Phone className="h-5 w-5 text-primary" />
                  Hubungi Kami
                </CardTitle>
                <CardDescription>Informasi kontak Sentosa Health Hub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-4 p-4 border-2 rounded-xl hover:border-primary transition-colors bg-gradient-to-r from-white to-primary/5 dark:from-background dark:to-primary/10">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Telepon</p>
                      <p className="text-lg font-bold">+62 21 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border-2 rounded-xl hover:border-primary transition-colors bg-gradient-to-r from-white to-primary/5 dark:from-background dark:to-primary/10">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Email</p>
                      <p className="text-lg font-bold">info@sentosahealth.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 border-2 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Jam Operasional</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Senin - Sabtu: <span className="font-medium text-foreground">08:00 - 20:00</span></p>
                        <p>Minggu: <span className="font-medium text-foreground">09:00 - 15:00</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  // --- STAFF/ADMIN VIEW ---

  // State for Admin Modals
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showMedicinesModal, setShowMedicinesModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const waitingCount = queue.filter(q => q.status === 'waiting').length;
  const inProgressCount = queue.filter(q => q.status === 'in-progress').length;
  const completedTodayCount = queue.filter(q => q.status === 'completed').length;

  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = prescriptions
    .filter(p => p.status === 'dispensed' && p.date === today)
    .reduce((sum, p) => sum + p.totalPrice, 0);

  const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);
  const recentPatients = [...queue].reverse().slice(0, 5);
  const todaySchedule = activeDoctors.slice(0, 5).map((doctor, index) => ({
    time: `${8 + index * 2}:00 - ${12 + index * 2}:00`,
    doctor: doctor.name,
    specialty: doctor.specialty || doctor.role
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Premium Admin Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-8 w-8" />
                <h1 className="text-4xl font-bold">
                  Dashboard Admin
                </h1>
              </div>
              <p className="text-white/90 text-lg">
                Selamat datang, <span className="font-semibold">{user?.name}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-white/70">Tanggal</p>
                <p className="text-xl font-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Patients Card - Clickable */}
        <Card
          className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-2 hover:border-blue-500"
          onClick={() => setShowPatientsModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pasien
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600">{patients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Klik untuk lihat detail</p>
          </CardContent>
        </Card>

        {/* Queue Card - Clickable */}
        <Card
          className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 hover:border-orange-500"
          onClick={() => setShowQueueModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Antrian Aktif
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-600">{waitingCount + inProgressCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Klik untuk kelola antrian</p>
          </CardContent>
        </Card>

        {/* Staff Card - Clickable */}
        <Card
          className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-2 hover:border-purple-500"
          onClick={() => setShowStaffModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Staff
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <User className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-purple-600">{staff.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Klik untuk lihat staff</p>
          </CardContent>
        </Card>

        {/* Revenue Card - Clickable */}
        <Card
          className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-2 hover:border-green-500"
          onClick={() => setShowAnalyticsModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue Hari Ini
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">Rp {(todayRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground mt-1">Klik untuk analytics</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Queue */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-5 w-5 text-orange-600" />
              Antrian Terbaru
            </CardTitle>
            <CardDescription>Pasien yang baru mendaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPatients.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada antrian hari ini</p>
              ) : (
                recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10 hover:border-primary transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {patient.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{patient.patientName}</p>
                        <p className="text-sm text-muted-foreground">{patient.id} • {patient.time}</p>
                      </div>
                    </div>
                    <Badge className={`
                      ${patient.status === 'completed' ? 'bg-green-600' : ''}
                      ${patient.status === 'in-progress' ? 'bg-blue-600' : ''}
                      ${patient.status === 'waiting' ? 'bg-orange-500' : ''}
                      ${patient.status === 'cancelled' ? 'bg-red-600' : ''}
                    `}>
                      {patient.status === 'completed' ? '✓ Selesai' :
                        patient.status === 'in-progress' ? '🩺 Diperiksa' :
                          patient.status === 'waiting' ? '⏳ Menunggu' : '✕ Batal'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            {recentPatients.length > 0 && (
              <Button className="w-full mt-4" variant="outline" onClick={() => setShowQueueModal(true)}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Lihat Semua Antrian
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Medicine Inventory Card - Clickable */}
        <Card
          className="shadow-xl cursor-pointer hover:shadow-2xl transition-all"
          onClick={() => setShowMedicinesModal(true)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Pill className="h-5 w-5 text-purple-600" />
              Inventori Obat
            </CardTitle>
            <CardDescription>Status stok obat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockMedicines.length > 0 ? (
                <>
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200">Stok Menipis!</p>
                        <p className="text-sm text-red-600 dark:text-red-300">{lowStockMedicines.length} obat perlu restock</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {lowStockMedicines.slice(0, 3).map(med => (
                        <div key={med.id} className="flex justify-between text-sm">
                          <span className="font-medium">{med.name}</span>
                          <Badge variant="destructive">{med.stock} {med.unit}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  {lowStockMedicines.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{lowStockMedicines.length - 3} obat lainnya
                    </p>
                  )}
                </>
              ) : (
                <div className="p-6 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-xl text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800 dark:text-green-200">Semua Stok Aman</p>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">{medicines.length} obat tersedia</p>
                </div>
              )}
              <Button className="w-full" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Kelola Inventori
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Modal */}
      <Dialog open={showPatientsModal} onOpenChange={setShowPatientsModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Daftar Pasien
            </DialogTitle>
            <DialogDescription>
              Total {patients.length} pasien terdaftar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {patients.map((patient) => (
              <Card key={patient.id} className="border-2 hover:border-blue-500 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{patient.name}</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm">
                          <p className="text-muted-foreground">ID: <span className="font-medium text-foreground">{patient.id}</span></p>
                          <p className="text-muted-foreground">Umur: <span className="font-medium text-foreground">{patient.age} tahun</span></p>
                          <p className="text-muted-foreground">Gender: <span className="font-medium text-foreground">{patient.gender}</span></p>
                          <p className="text-muted-foreground">Telepon: <span className="font-medium text-foreground">{patient.phone}</span></p>
                          <p className="text-muted-foreground col-span-2">Alamat: <span className="font-medium text-foreground">{patient.address}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {patient.lastVisit ? `Terakhir: ${patient.lastVisit}` : 'Belum pernah'}
                      </Badge>
                      <Button size="sm" className="mt-2" onClick={() => navigate(`/patients/${patient.id}`)}>
                        <FileText className="h-3 w-3 mr-1" />
                        Detail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Queue Management Modal */}
      <Dialog open={showQueueModal} onOpenChange={setShowQueueModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Clock className="h-6 w-6 text-orange-600" />
              Manajemen Antrian
            </DialogTitle>
            <DialogDescription>
              Kelola antrian pasien hari ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {queue.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Belum ada antrian</p>
              </div>
            ) : (
              queue.map((item) => (
                <Card key={item.id} className="border-2 hover:border-orange-500 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {item.id.replace('Q', '')}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{item.patientName}</h3>
                          <p className="text-sm text-muted-foreground">Dokter: {item.doctor}</p>
                          {item.complaint && (
                            <p className="text-sm mt-1"><span className="font-medium">Keluhan:</span> {item.complaint}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={`
                          ${item.status === 'completed' ? 'bg-green-600' : ''}
                          ${item.status === 'in-progress' ? 'bg-blue-600' : ''}
                          ${item.status === 'waiting' ? 'bg-orange-500' : ''}
                          ${item.status === 'cancelled' ? 'bg-red-600' : ''}
                        `}>
                          {item.status === 'completed' ? '✓ Selesai' :
                            item.status === 'in-progress' ? '🩺 Diperiksa' :
                              item.status === 'waiting' ? '⏳ Menunggu' : '✕ Batal'}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => navigate('/queue')}>
                          Kelola
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Modal */}
      <Dialog open={showStaffModal} onOpenChange={setShowStaffModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-purple-600" />
              Manajemen Staff
            </DialogTitle>
            <DialogDescription>
              Daftar semua staff klinik
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            {staff.map((member) => (
              <Card key={member.id} className="border-2 hover:border-purple-500 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.specialty || member.role}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-muted-foreground">📧 {member.email}</p>
                        <p className="text-muted-foreground">📱 {member.phone}</p>
                      </div>
                      <Badge className={`mt-2 ${member.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}`}>
                        {member.status === 'active' ? '✓ Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Medicines Modal */}
      <Dialog open={showMedicinesModal} onOpenChange={setShowMedicinesModal}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Pill className="h-6 w-6 text-purple-600" />
              Inventori Obat
            </DialogTitle>
            <DialogDescription>
              Kelola stok obat klinik
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {medicines.map((med) => (
              <Card key={med.id} className={`border-2 transition-colors ${med.stock <= med.minStock ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'hover:border-purple-500'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ${med.stock <= med.minStock ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-purple-500 to-purple-600'}`}>
                        <Pill className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{med.name}</h3>
                        <div className="flex gap-4 mt-1 text-sm">
                          <p className="text-muted-foreground">Stok: <span className={`font-bold ${med.stock <= med.minStock ? 'text-red-600' : 'text-foreground'}`}>{med.stock} {med.unit}</span></p>
                          <p className="text-muted-foreground">Min: {med.minStock}</p>
                          <p className="text-muted-foreground">Harga: Rp {med.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {med.stock <= med.minStock ? (
                        <Badge variant="destructive" className="mb-2">⚠️ Stok Rendah</Badge>
                      ) : (
                        <Badge className="bg-green-600 mb-2">✓ Stok Aman</Badge>
                      )}
                      <Button size="sm" variant="outline" onClick={() => navigate('/pharmacy')}>
                        Kelola
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Analytics & Laporan
            </DialogTitle>
            <DialogDescription>
              Ringkasan kinerja klinik hari ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Revenue Summary */}
            <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Pendapatan Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-green-600 mb-4">
                  Rp {todayRevenue.toLocaleString('id-ID')}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Transaksi</p>
                    <p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'dispensed' && p.date === today).length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rata-rata</p>
                    <p className="text-2xl font-bold">
                      Rp {prescriptions.filter(p => p.status === 'dispensed' && p.date === today).length > 0
                        ? Math.round(todayRevenue / prescriptions.filter(p => p.status === 'dispensed' && p.date === today).length).toLocaleString()
                        : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pasien Selesai</p>
                    <p className="text-2xl font-bold">{completedTodayCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Queue Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Status Antrian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-orange-600">{waitingCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Menunggu</p>
                  </div>
                  <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Diperiksa</p>
                  </div>
                  <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-green-600">{completedTodayCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Status Sistem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-background rounded-lg border">
                    <span className="font-medium">Total Pasien Terdaftar</span>
                    <Badge variant="outline" className="text-lg">{patients.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-background rounded-lg border">
                    <span className="font-medium">Staff Aktif</span>
                    <Badge variant="outline" className="text-lg">{staff.filter(s => s.status === 'active').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-background rounded-lg border">
                    <span className="font-medium">Jenis Obat</span>
                    <Badge variant="outline" className="text-lg">{medicines.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white dark:bg-background rounded-lg border">
                    <span className="font-medium">Obat Stok Rendah</span>
                    <Badge variant={lowStockMedicines.length > 0 ? "destructive" : "secondary"} className="text-lg">
                      {lowStockMedicines.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
