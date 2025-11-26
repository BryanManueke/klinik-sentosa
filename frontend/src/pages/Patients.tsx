import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Grid3x3, List, Filter, UserPlus, Phone, MapPin, Calendar, User, Eye, Edit, Trash2, UserCircle2, Activity, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useData, Patient } from '@/contexts/DataContext';
import { patientService } from '@/services/patientService';

const Patients = () => {
  const { patients, addPatient, updatePatient, deletePatient, addToQueue, staff, queue } = useData();
  const navigate = useNavigate();

  // View states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    doctor: '',
    complaint: ''
  });
  const [queueDoctor, setQueueDoctor] = useState('');
  const [queueComplaint, setQueueComplaint] = useState('');

  const activeDoctors = staff.filter(s => s.status === 'active' && s.role.toLowerCase().includes('dokter'));

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesAge = ageFilter === 'all' ||
      (ageFilter === 'child' && p.age < 18) ||
      (ageFilter === 'adult' && p.age >= 18 && p.age < 60) ||
      (ageFilter === 'senior' && p.age >= 60);
    return matchesSearch && matchesGender && matchesAge;
  });

  const handleAddPatient = async () => {
    // Validate all required fields
    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.address) {
      toast.error('Mohon lengkapi semua field data diri yang wajib diisi');
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 120) {
      toast.error('Usia tidak valid');
      return;
    }

    // Validate phone
    if (!/^08\d{8,11}$/.test(formData.phone)) {
      toast.error('Nomor telepon harus dimulai dengan 08 dan 10-13 digit');
      return;
    }

    const newPatient = {
      name: formData.name,
      age: age,
      gender: formData.gender as 'Laki-laki' | 'Perempuan',
      phone: formData.phone,
      address: formData.address,
      lastVisit: new Date().toISOString().split('T')[0]
    };

    const savedPatient = await addPatient(newPatient);

    // If doctor and complaint are filled, add to queue
    if (savedPatient && formData.doctor && formData.complaint) {
      addToQueue(savedPatient.id, formData.doctor, formData.complaint);
    }

    setIsAddDialogOpen(false);
    setFormData({ name: '', age: '', gender: '', phone: '', address: '', doctor: '', complaint: '' });
  };

  const handleEditPatient = () => {
    if (!selectedPatient) return;

    // Validate all required fields
    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.address) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 120) {
      toast.error('Usia tidak valid');
      return;
    }

    // Validate phone
    if (!/^08\d{8,11}$/.test(formData.phone)) {
      toast.error('Nomor telepon harus dimulai dengan 08 dan 10-13 digit');
      return;
    }

    const updatedPatient = {
      name: formData.name,
      age: age,
      gender: formData.gender as 'Laki-laki' | 'Perempuan',
      phone: formData.phone,
      address: formData.address,
      lastVisit: selectedPatient.lastVisit || new Date().toISOString().split('T')[0]
    };

    updatePatient(selectedPatient.id, updatedPatient);
    setIsEditDialogOpen(false);
    setSelectedPatient(null);
    setFormData({ name: '', age: '', gender: '', phone: '', address: '' });
    toast.success('Data pasien berhasil diperbarui!');
  };

  const handleDeletePatient = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pasien ${name}?`)) {
      deletePatient(id);
      toast.success('Pasien berhasil dihapus!');
    }
  };

  const handleAddToQueue = () => {
    if (!selectedPatient) return;
    if (!queueDoctor || !queueComplaint) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    addToQueue(selectedPatient.id, queueDoctor, queueComplaint);
    setIsQueueDialogOpen(false);
    setSelectedPatient(null);
    setQueueDoctor('');
    setQueueComplaint('');
    toast.success('Pasien berhasil ditambahkan ke antrian!');
  };

  const openEditDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address
    });
    setIsEditDialogOpen(true);
  };

  const openQueueDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsQueueDialogOpen(true);
  };

  const getPatientQueueStatus = (patientId: string) => {
    const activeQueue = queue.find(q => q.patientId === patientId && (q.status === 'waiting' || q.status === 'in-progress'));
    return activeQueue;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <UserCircle2 className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Data Pasien</h1>
              </div>
              <p className="text-white/90 text-lg">Kelola {patients.length} pasien terdaftar</p>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 shadow-xl"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Pasien
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari nama, ID, atau nomor telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Gender Filter */}
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Gender</SelectItem>
                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                <SelectItem value="Perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>

            {/* Age Filter */}
            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Usia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Usia</SelectItem>
                <SelectItem value="child">Anak (&lt;18)</SelectItem>
                <SelectItem value="adult">Dewasa (18-59)</SelectItem>
                <SelectItem value="senior">Lansia (≥60)</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex-1"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex-1"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(genderFilter !== 'all' || ageFilter !== 'all' || searchTerm) && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {searchTerm && (
                <Badge variant="secondary">
                  Pencarian: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
                </Badge>
              )}
              {genderFilter !== 'all' && (
                <Badge variant="secondary">
                  Gender: {genderFilter}
                  <button onClick={() => setGenderFilter('all')} className="ml-2">×</button>
                </Badge>
              )}
              {ageFilter !== 'all' && (
                <Badge variant="secondary">
                  Usia: {ageFilter === 'child' ? 'Anak' : ageFilter === 'adult' ? 'Dewasa' : 'Lansia'}
                  <button onClick={() => setAgeFilter('all')} className="ml-2">×</button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{filteredPatients.length}</span> dari {patients.length} pasien
        </p>
      </div>

      {/* Patient Grid/List */}
      {filteredPatients.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <UserCircle2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada pasien ditemukan</h3>
            <p className="text-muted-foreground mb-4">Coba ubah filter atau tambahkan pasien baru</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pasien
            </Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => {
            const queueStatus = getPatientQueueStatus(patient.id);
            return (
              <Card key={patient.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">{patient.id}</p>
                      </div>
                    </div>
                    {queueStatus && (
                      <Badge className={queueStatus.status === 'waiting' ? 'bg-orange-500' : 'bg-blue-600'}>
                        {queueStatus.status === 'waiting' ? '⏳ Antri' : '🩺 Diperiksa'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.age} thn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{patient.address}</span>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">Terakhir: {patient.lastVisit}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/patients/${patient.id}`)}>
                      <Eye className="h-3 w-3 mr-1" />
                      Detail
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(patient)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openQueueDialog(patient)} disabled={!!queueStatus}>
                      <UserPlus className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeletePatient(patient.id, patient.name)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredPatients.map((patient) => {
                const queueStatus = getPatientQueueStatus(patient.id);
                return (
                  <div key={patient.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{patient.name}</h3>
                            {queueStatus && (
                              <Badge variant="secondary" className="text-xs">
                                {queueStatus.status === 'waiting' ? 'Antri' : 'Diperiksa'}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>{patient.id}</span>
                            <span>•</span>
                            <span>{patient.age} tahun</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                            <span>•</span>
                            <span>{patient.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/patients/${patient.id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openQueueDialog(patient)} disabled={!!queueStatus}>
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePatient(patient.id, patient.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Patient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tambah Pasien Baru</DialogTitle>
            <DialogDescription className="text-base">
              Lengkapi data pasien untuk mendaftar
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
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="h-12 text-base border-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-semibold">
                    Usia <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Usia"
                    className="h-12 text-base border-2"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base font-semibold">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
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
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="h-12 text-base border-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-semibold">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap..."
                  rows={3}
                  className="resize-none text-base border-2"
                />
              </div>
            </div>

            {/* Informasi Pemeriksaan (Opsional) */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Informasi Pemeriksaan (Langsung Daftar Antrian)</h3>

              <div className="space-y-2">
                <Label htmlFor="doctor" className="text-base font-semibold">
                  Pilih Dokter Spesialis
                </Label>
                <Select
                  value={formData.doctor}
                  onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                >
                  <SelectTrigger className="h-14 text-base border-2 focus:border-primary">
                    <SelectValue placeholder="Pilih dokter (Opsional)" />
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
                  Keluhan
                </Label>
                <Textarea
                  id="complaint"
                  placeholder="Jelaskan keluhan atau gejala..."
                  value={formData.complaint}
                  onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
                  rows={4}
                  className="resize-none text-base border-2 focus:border-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Isi jika ingin langsung mendaftarkan pasien ke antrian
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 h-12 text-base font-semibold"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg"
              onClick={handleAddPatient}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Tambah Pasien
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Data Pasien</DialogTitle>
            <DialogDescription>Perbarui informasi pasien</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Lengkap *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-age">Usia *</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Nomor Telepon *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Alamat *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={handleEditPatient}>
              Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to Queue Dialog */}
      <Dialog open={isQueueDialogOpen} onOpenChange={setIsQueueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah ke Antrian</DialogTitle>
            <DialogDescription>
              Pasien: <span className="font-semibold text-foreground">{selectedPatient?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Pilih Dokter *</Label>
              <Select value={queueDoctor} onValueChange={setQueueDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih dokter" />
                </SelectTrigger>
                <SelectContent>
                  {activeDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name} - {doctor.specialty || doctor.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Keluhan *</Label>
              <Input
                value={queueComplaint}
                onChange={(e) => setQueueComplaint(e.target.value)}
                placeholder="Jelaskan keluhan pasien..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsQueueDialogOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={handleAddToQueue}>
              Tambah ke Antrian
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
