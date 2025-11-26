import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Users2, Mail, Phone, Edit, Trash2, UserCheck, UserX, Stethoscope, Briefcase } from 'lucide-react';
import { useData, Staff as StaffType } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { staffService } from '@/services/staffService';

const Staff = () => {
  const { staff, addStaff, updateStaff, deleteStaff, updateStaffStatus } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    specialty: ''
  });

  const roles = ['Dokter Umum', 'Dokter Gigi', 'Dokter Anak', 'Dokter Kulit', 'Dokter Mata', 'Dokter THT', 'Dokter Kandungan', 'Apoteker', 'Perawat', 'Admin'];

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeStaff = staff.filter(s => s.status === 'active').length;
  const doctors = staff.filter(s => s.role.toLowerCase().includes('dokter')).length;

  const handleAddStaff = () => {
    const validation = staffService.validateStaffData(formData);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    addStaff({
      ...staffService.formatStaffForSave(formData),
      status: 'active',
      specialty: formData.specialty || formData.role
    });

    setIsAddDialogOpen(false);
    setFormData({ name: '', role: '', email: '', phone: '', specialty: '' });
    toast.success('Staff berhasil ditambahkan!');
  };

  const handleEditStaff = () => {
    if (!selectedStaff) return;

    const validation = staffService.validateStaffData(formData);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    updateStaff(selectedStaff.id, {
      ...staffService.formatStaffForSave(formData),
      specialty: formData.specialty || formData.role
    });

    setIsEditDialogOpen(false);
    setSelectedStaff(null);
    setFormData({ name: '', role: '', email: '', phone: '', specialty: '' });
    toast.success('Data staff berhasil diperbarui!');
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      deleteStaff(id);
      toast.success('Staff berhasil dihapus!');
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateStaffStatus(id, newStatus);
    toast.success(`Status berhasil diubah menjadi ${newStatus === 'active' ? 'Aktif' : 'Nonaktif'}`);
  };

  const openEditDialog = (staffMember: StaffType) => {
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      email: staffMember.email,
      phone: staffMember.phone,
      specialty: staffMember.specialty || staffMember.role
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users2 className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Manajemen Staff</h1>
              </div>
              <p className="text-white/90 text-lg">Kelola {staff.length} staff dan karyawan klinik</p>
            </div>
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90 shadow-xl"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Staff
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Staff Aktif</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-600">{activeStaff}</div>
            <p className="text-xs text-muted-foreground mt-1">Staff yang aktif bekerja</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-2 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dokter</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-600">{doctors}</div>
            <p className="text-xs text-muted-foreground mt-1">Tenaga medis dokter</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border-2 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perawat & Lainnya</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-purple-600">{staff.length - doctors}</div>
            <p className="text-xs text-muted-foreground mt-1">Staff pendukung</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau telepon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-56 h-12">
                <SelectValue placeholder="Semua Jabatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jabatan</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-semibold text-foreground">{filteredStaff.length}</span> dari {staff.length} staff
        </p>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Users2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada staff ditemukan</h3>
            <p className="text-muted-foreground mb-4">Coba ubah filter atau tambahkan staff baru</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Staff
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.id}</p>
                    </div>
                  </div>
                  <Badge className={member.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}>
                    {member.status === 'active' ? '✓ Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{member.role}</p>
                      {member.specialty && member.specialty !== member.role && (
                        <p className="text-xs text-muted-foreground">{member.specialty}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleToggleStatus(member.id, member.status)}
                  >
                    {member.status === 'active' ? <UserX className="h-3 w-3 mr-1" /> : <UserCheck className="h-3 w-3 mr-1" />}
                    {member.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(member)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteStaff(member.id, member.name)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tambah Staff Baru</DialogTitle>
            <DialogDescription>Lengkapi data staff untuk mendaftar</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Jabatan *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialty">Spesialisasi</Label>
                <Input
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Opsional"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={handleAddStaff}>
              Tambah Staff
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Data Staff</DialogTitle>
            <DialogDescription>Perbarui informasi staff</DialogDescription>
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
                <Label htmlFor="edit-role">Jabatan *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specialty">Spesialisasi</Label>
                <Input
                  id="edit-specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Nomor Telepon *</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={handleEditStaff}>
              Simpan Perubahan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
