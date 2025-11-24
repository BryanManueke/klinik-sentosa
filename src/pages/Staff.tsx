import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCog, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

const Staff = () => {
  const { staff, addStaff, updateStaffStatus } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Dokter Umum',
    email: '',
    phone: '',
  });

  const handleAddStaff = () => {
    if (!formData.name || !formData.email) {
      toast.error('Mohon lengkapi data staff');
      return;
    }

    addStaff({
      ...formData,
      status: 'active'
    });

    setIsDialogOpen(false);
    setFormData({ name: '', role: 'Dokter Umum', email: '', phone: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Staff</h1>
          <p className="text-muted-foreground">Kelola data staff dan karyawan klinik</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Staff Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama staff"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Jabatan/Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="Dokter Umum">Dokter Umum</option>
                  <option value="Dokter Gigi">Dokter Gigi</option>
                  <option value="Perawat">Perawat</option>
                  <option value="Apoteker">Apoteker</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@klinik.com"
                />
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
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button onClick={handleAddStaff}>Simpan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.id}</p>
                  </div>
                </div>
                <Badge
                  variant={member.status === 'active' ? 'default' : 'secondary'}
                  className={member.status === 'active' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' : ''}
                >
                  {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{member.role}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email: {member.email}</p>
                <p className="text-xs text-muted-foreground">Telp: {member.phone}</p>
              </div>
              <div className="pt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateStaffStatus(member.id, member.status === 'active' ? 'inactive' : 'active')}
                >
                  {member.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Staff;
