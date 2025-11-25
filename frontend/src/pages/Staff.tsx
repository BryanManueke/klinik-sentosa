import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { useData, Staff as StaffType } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { StaffList } from '@/components/staff/StaffList';
import { StaffDialog } from '@/components/staff/StaffDialog';
import { staffService } from '@/services/staffService';

const Staff = () => {
  const { staff, addStaff, updateStaff, deleteStaff, updateStaffStatus } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);

  const handleAddStaff = (data: any) => {
    const validation = staffService.validateStaffData(data);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    addStaff({
      ...staffService.formatStaffForSave(data),
      status: 'active'
    });

    setIsDialogOpen(false);
  };

  const handleEditClick = (staffMember: StaffType) => {
    setSelectedStaff(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStaff = (data: any) => {
    if (!selectedStaff) return;

    const validation = staffService.validateStaffData(data);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    updateStaff(selectedStaff.id, staffService.formatStaffForSave(data));
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus staff ini?')) {
      deleteStaff(id);
    }
  };

  const [sortConfig, setSortConfig] = useState<{ key: keyof StaffType; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof StaffType) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredStaff = staff
    .filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

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
          <StaffDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleAddStaff}
            mode="add"
          />
        </Dialog>

        <StaffDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedStaff(null);
          }}
          onSubmit={handleUpdateStaff}
          initialData={selectedStaff ? {
            name: selectedStaff.name,
            role: selectedStaff.role,
            email: selectedStaff.email,
            phone: selectedStaff.phone,
          } : undefined}
          mode="edit"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-sm flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau jabatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSort('name')} className="gap-2">
            Nama <ArrowUpDown className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('role')} className="gap-2">
            Role <ArrowUpDown className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSort('status')} className="gap-2">
            Status <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <StaffList
        staff={filteredStaff}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onUpdateStatus={updateStaffStatus}
      />
    </div>
  );
};

export default Staff;
