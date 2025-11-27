import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, FileText, Save, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const Examination = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getPatient, addMedicalRecord, addPrescription, medicines, medicalRecords, queue, updateQueueStatus } = useData();
  const { user } = useAuth();

  const patientId = searchParams.get('patientId');
  const patient = patientId ? getPatient(patientId) : null;
  const patientHistory = patientId ? medicalRecords.filter(r => r.patientId === patientId) : [];

  const [formData, setFormData] = useState({
    complaint: '',
    symptoms: '',
    bloodPressure: '',
    temperature: '',
    heartRate: '',
    diagnosis: '',
    prescriptionNotes: '',
    notes: '',
  });

  // Simple prescription item state for demo
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [medicineAmount, setMedicineAmount] = useState(1);
  const [prescriptionItems, setPrescriptionItems] = useState<{ medicineId: string, medicineName: string, amount: number, instructions: string }[]>([]);

  useEffect(() => {
    if (patientId && !patient) {
      const timer = setTimeout(() => {
        if (!patient) {
          toast.error('Data pasien tidak ditemukan');
          navigate('/queue');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [patientId, patient, navigate]);

  if (!patientId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4 text-center">
        <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20">
          <Stethoscope className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">Mulai Pemeriksaan</h2>
        <p className="text-muted-foreground max-w-md">
          Silakan pilih pasien dari daftar antrian untuk memulai pemeriksaan kesehatan.
        </p>
        <Button onClick={() => navigate('/queue')} size="lg" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Antrian
        </Button>
      </div>
    );
  }

  const handleAddMedicine = () => {
    if (!selectedMedicine) return;
    const med = medicines.find(m => m.id === selectedMedicine);
    if (med) {
      setPrescriptionItems([...prescriptionItems, {
        medicineId: med.id,
        medicineName: med.name,
        amount: medicineAmount,
        instructions: 'Sesudah makan'
      }]);
      setSelectedMedicine('');
      setMedicineAmount(1);
    }
  };

  const handleSave = () => {
    if (!formData.complaint || !formData.diagnosis) {
      toast.error('Mohon lengkapi keluhan dan diagnosis');
      return;
    }

    if (patient && user) {
      addMedicalRecord({
        patientId: patient.id,
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        treatment: formData.prescriptionNotes,
        doctorName: user.name
      });

      if (prescriptionItems.length > 0) {
        addPrescription({
          patientId: patient.id,
          patientName: patient.name,
          doctorName: user.name,
          items: prescriptionItems,
          status: 'ready'
        });
        toast.success('Resep obat berhasil dibuat dan dikirim ke Apotek');
      }

      const queueItem = queue.find(q => q.patientId === patient.id && q.status === 'in-progress');
      if (queueItem) {
        updateQueueStatus(queueItem.id, 'completed');
      }

      toast.success('Rekam medis berhasil disimpan');
      navigate('/pharmacy');
    }
  };

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/queue')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pemeriksaan Pasien</h1>
          <p className="text-muted-foreground">Catat hasil pemeriksaan dan diagnosis</p>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Data Pasien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID Pasien</p>
              <p className="font-semibold text-foreground">{patient.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-semibold text-foreground">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Umur</p>
              <p className="font-semibold text-foreground">{patient.age} tahun</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
              <p className="font-semibold text-foreground">{patient.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">No. Telepon</p>
              <p className="font-semibold text-foreground">{patient.phone}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm text-muted-foreground">Alamat</p>
              <p className="font-semibold text-foreground truncate" title={patient.address}>{patient.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="examination" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="examination">Pemeriksaan Saat Ini</TabsTrigger>
          <TabsTrigger value="history">Riwayat Medis</TabsTrigger>
        </TabsList>

        <TabsContent value="examination" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Keluhan & Gejala</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complaint">Keluhan Utama</Label>
                  <Textarea
                    id="complaint"
                    value={formData.complaint}
                    onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                    placeholder="Keluhan utama pasien..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Gejala yang Dialami</Label>
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Gejala yang dialami pasien..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tanda Vital</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">Tekanan Darah</Label>
                  <Input
                    id="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    placeholder="120/80 mmHg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Suhu Tubuh</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="36.5 °C"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Detak Jantung</Label>
                  <Input
                    id="heartRate"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    placeholder="80 bpm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Diagnosis & Resep
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Diagnosis penyakit..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Resep Obat</Label>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedMedicine}
                    onChange={(e) => setSelectedMedicine(e.target.value)}
                  >
                    <option value="">Pilih Obat</option>
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (Stok: {m.stock})</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    className="w-20"
                    min="1"
                    value={medicineAmount}
                    onChange={(e) => setMedicineAmount(parseInt(e.target.value))}
                  />
                  <Button type="button" onClick={handleAddMedicine}>Tambah</Button>
                </div>

                {prescriptionItems.length > 0 && (
                  <div className="mt-2 border rounded-md p-2">
                    <ul className="space-y-1">
                      {prescriptionItems.map((item, idx) => (
                        <li key={idx} className="text-sm flex justify-between">
                          <span>{item.medicineName} x {item.amount}</span>
                          <span className="text-muted-foreground">{item.instructions}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Tambahan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan atau rekomendasi tambahan..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/queue')}>Batal</Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Simpan Rekam Medis
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Riwayat Pemeriksaan Sebelumnya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Belum ada riwayat pemeriksaan.</p>
                ) : (
                  patientHistory.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{record.date}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Dr. {record.doctorName}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Keluhan:</span>
                          <p className="text-foreground">{record.complaint}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Diagnosis:</span>
                          <p className="text-foreground">{record.diagnosis}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Tindakan/Resep:</span>
                          <p className="text-foreground">{record.treatment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Examination;
