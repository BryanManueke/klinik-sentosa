import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Stethoscope, FileText, Save } from 'lucide-react';
import { toast } from 'sonner';

const Examination = () => {
  const [selectedPatient] = useState({
    id: 'P002',
    name: 'Siti Nurhaliza',
    age: 28,
    gender: 'Perempuan',
  });

  const [formData, setFormData] = useState({
    complaint: '',
    symptoms: '',
    bloodPressure: '',
    temperature: '',
    heartRate: '',
    diagnosis: '',
    prescription: '',
    notes: '',
  });

  const handleSave = () => {
    if (!formData.complaint || !formData.diagnosis) {
      toast.error('Mohon lengkapi keluhan dan diagnosis');
      return;
    }
    toast.success('Rekam medis berhasil disimpan');
    // Reset form
    setFormData({
      complaint: '',
      symptoms: '',
      bloodPressure: '',
      temperature: '',
      heartRate: '',
      diagnosis: '',
      prescription: '',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pemeriksaan Pasien</h1>
        <p className="text-muted-foreground">Catat hasil pemeriksaan dan diagnosis</p>
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
              <p className="font-semibold text-foreground">{selectedPatient.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-semibold text-foreground">{selectedPatient.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Umur</p>
              <p className="font-semibold text-foreground">{selectedPatient.age} tahun</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
              <p className="font-semibold text-foreground">{selectedPatient.gender}</p>
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
            <Label htmlFor="prescription">Resep Obat</Label>
            <Textarea
              id="prescription"
              value={formData.prescription}
              onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
              placeholder="Daftar obat dan dosis..."
              rows={4}
            />
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
        <Button variant="outline">Batal</Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Simpan Rekam Medis
        </Button>
      </div>
    </div>
  );
};

export default Examination;
