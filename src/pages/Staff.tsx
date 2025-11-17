import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCog, Plus } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

const Staff = () => {
  const staff: StaffMember[] = [
    { id: 'S001', name: 'Dr. Sarah Wijaya', role: 'Dokter Umum', email: 'sarah@kliniksentosa.com', phone: '08123456789', status: 'active' },
    { id: 'S002', name: 'Dr. Ahmad Fauzi', role: 'Dokter Gigi', email: 'ahmad@kliniksentosa.com', phone: '08198765432', status: 'active' },
    { id: 'S003', name: 'Siti Nurhaliza', role: 'Perawat', email: 'siti@kliniksentosa.com', phone: '08234567890', status: 'active' },
    { id: 'S004', name: 'Budi Santoso', role: 'Admin', email: 'budi@kliniksentosa.com', phone: '08345678901', status: 'active' },
    { id: 'S005', name: 'Dewi Lestari', role: 'Apoteker', email: 'dewi@kliniksentosa.com', phone: '08456789012', status: 'active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Staff</h1>
          <p className="text-muted-foreground">Kelola data staff dan karyawan klinik</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Staff
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.id}</p>
                  </div>
                </div>
                <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">
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
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Detail
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
