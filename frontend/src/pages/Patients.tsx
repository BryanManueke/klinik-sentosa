import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useData, Patient } from '@/contexts/DataContext';
import { PatientTable } from '@/components/patients/PatientTable';
import { PatientDialog } from '@/components/patients/PatientDialog';
import { QueueDialog } from '@/components/patients/QueueDialog';
import { patientService } from '@/services/patientService';

const Patients = () => {
  const { patients, addPatient, updatePatient, deletePatient, addToQueue, staff } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isQueueDialogOpen, setIsQueueDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const doctors = staff.filter(s => s.role.startsWith('Dokter') && s.status === 'active');

  const handleAddPatient = (data: any) => {
    const validation = patientService.validatePatientData(data);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    addPatient(patientService.formatPatientForSave(data));
    setIsDialogOpen(false);
  };

  const handleAddToQueue = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsQueueDialogOpen(true);
  };

  const confirmAddToQueue = (doctorName: string, complaint: string) => {
    if (!selectedPatientId) return;
    if (!doctorName) {
      toast.error('Silahkan pilih dokter');
      return;
    }

    addToQueue(selectedPatientId, doctorName, complaint);
    setIsQueueDialogOpen(false);
    setSelectedPatientId(null);
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePatient = (data: any) => {
    if (!selectedPatient) return;

    const validation = patientService.validatePatientData(data);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    // We reuse formatPatientForSave but we might need to adjust if update logic differs significantly
    // For now it's safe as updatePatient takes Partial<Patient>
    const formattedData = patientService.formatPatientForSave(data);

    updatePatient(selectedPatient.id, {
      name: formattedData.name,
      age: formattedData.age,
      gender: formattedData.gender,
      phone: formattedData.phone,
      address: formattedData.address,
    });

    setIsEditDialogOpen(false);
    setSelectedPatient(null);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
      deletePatient(id);
    }
  };

  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Patient) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredPatients = patients
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-foreground">Data Pasien</h1>
          <p className="text-muted-foreground">Kelola data pasien klinik</p>
        </div>
        <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Tambah Pasien
        </Button>
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
          <PatientTable
            patients={filteredPatients}
            onSort={handleSort}
            onAddToQueue={handleAddToQueue}
            onViewDetail={(id) => navigate(`/patients/${id}`)}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <PatientDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddPatient}
        mode="add"
      />

      <PatientDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedPatient(null);
        }}
        onSubmit={handleUpdatePatient}
        initialData={selectedPatient ? {
          name: selectedPatient.name,
          age: selectedPatient.age.toString(),
          gender: selectedPatient.gender,
          phone: selectedPatient.phone,
          address: selectedPatient.address,
        } : undefined}
        mode="edit"
      />

      <QueueDialog
        isOpen={isQueueDialogOpen}
        onClose={() => {
          setIsQueueDialogOpen(false);
          setSelectedPatientId(null);
        }}
        onSubmit={confirmAddToQueue}
        doctors={doctors}
      />
    </div>
  );
};

export default Patients;
