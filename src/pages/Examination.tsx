import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Stethoscope, FileText, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

const Examination = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getPatient, addMedicalRecord, addPrescription, medicines } = useData();

  const patientId = searchParams.get('patientId');
  const patient = patientId ? getPatient(patientId) : null;

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
    if (!patientId) {
      toast.error('ID Pasien tidak ditemukan');
      navigate('/queue');
    }
  }, [patientId, navigate]);

  const handleAddMedicine = () => {
    if (!selectedMedicine) return;
    const med = medicines.find(m => m.id === selectedMedicine);
    if (med) {
      setPrescriptionItems([...prescriptionItems, {
        medicineId: med.id,
        medicineName: med.name,
        amount: medicineAmount,
        instructions: 'Sesudah makan' // Default instruction
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

    if (patient) {
      // Save Medical Record
      addMedicalRecord({
        patientId: patient.id,
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        treatment: formData.prescriptionNotes, // Using notes as treatment summary
        doctorName: 'Dr. Current User' // Should come from AuthContext
      });

      // Create Prescription if items exist
      if (prescriptionItems.length > 0) {
        addPrescription({
          patientId: patient.id,
          patientName: patient.name,
          doctorName: 'Dr. Current User',
          items: prescriptionItems
        });
        toast.success('Resep obat berhasil dibuat');
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
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default Examination;
