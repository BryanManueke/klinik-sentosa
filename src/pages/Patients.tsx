import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  lastVisit: string;
}

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([
    { id: 'P001', name: 'Budi Santoso', age: 35, gender: 'Laki-laki', phone: '08123456789', address: 'Airmadidi', lastVisit: '2024-01-15' },
    { id: 'P002', name: 'Siti Nurhaliza', age: 28, gender: 'Perempuan', phone: '08198765432', address: 'Manado', lastVisit: '2024-01-14' },
    { id: 'P003', name: 'Ahmad Fauzi', age: 42, gender: 'Laki-laki', phone: '08234567890', address: 'Tomohon', lastVisit: '2024-01-13' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Laki-laki',
    phone: '',
    address: '',
  });

  const handleAddPatient = () => {
    if (!formData.name || !formData.age) {
      toast.error('Mohon lengkapi data pasien');
      return;
    }

    const newPatient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      lastVisit: new Date().toISOString().split('T')[0],
    };

    setPatients([...patients, newPatient]);
    setIsDialogOpen(false);
    resetForm();
    toast.success('Pasien berhasil ditambahkan');
  };

  const handleUpdatePatient = () => {
    if (!editingPatient) return;

    const updatedPatients = patients.map(p =>
      p.id === editingPatient.id
        ? { ...p, ...formData, age: parseInt(formData.age) }
        : p
    );

    setPatients(updatedPatients);
    setIsDialogOpen(false);
    setEditingPatient(null);
    resetForm();
    toast.success('Data pasien berhasil diperbarui');
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(p => p.id !== id));
    toast.success('Pasien berhasil dihapus');
  };

  const openEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Laki-laki',
      phone: '',
      address: '',
    });
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Pasien</h1>
          <p className="text-muted-foreground">Kelola data pasien klinik</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pasien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPatient ? 'Edit Pasien' : 'Tambah Pasien Baru'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Umur</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Umur"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={editingPatient ? handleUpdatePatient : handleAddPatient}>
                {editingPatient ? 'Perbarui' : 'Simpan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Nama</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Umur</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Jenis Kelamin</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Telepon</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Kunjungan Terakhir</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{patient.id}</td>
                    <td className="p-4 text-foreground">{patient.name}</td>
                    <td className="p-4 text-muted-foreground">{patient.age} tahun</td>
                    <td className="p-4 text-muted-foreground">{patient.gender}</td>
                    <td className="p-4 text-muted-foreground">{patient.phone}</td>
                    <td className="p-4 text-muted-foreground">{patient.lastVisit}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
