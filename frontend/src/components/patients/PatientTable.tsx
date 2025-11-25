import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, UserPlus, ArrowUpDown } from 'lucide-react';
import { Patient } from '@/contexts/DataContext';

interface PatientTableProps {
    patients: Patient[];
    onSort: (key: keyof Patient) => void;
    onAddToQueue: (id: string) => void;
    onViewDetail: (id: string) => void;
    onEdit: (patient: Patient) => void;
    onDelete: (id: string) => void;
}

export const PatientTable = ({ patients, onSort, onAddToQueue, onViewDetail, onEdit, onDelete }: PatientTableProps) => {
    return (
        <div className="rounded-lg border">
            <table className="w-full">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSort('id')}>
                            <div className="flex items-center gap-1">ID <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSort('name')}>
                            <div className="flex items-center gap-1">Nama <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSort('age')}>
                            <div className="flex items-center gap-1">Umur <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSort('gender')}>
                            <div className="flex items-center gap-1">Jenis Kelamin <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Telepon</th>
                        <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSort('lastVisit')}>
                            <div className="flex items-center gap-1">Kunjungan Terakhir <ArrowUpDown className="h-3 w-3" /></div>
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center p-8 text-muted-foreground">
                                Tidak ada data pasien yang ditemukan.
                            </td>
                        </tr>
                    ) : (
                        patients.map((patient) => (
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
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => onAddToQueue(patient.id)}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Antrian
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => onViewDetail(patient.id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                            Detail
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => onEdit(patient)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 text-destructive hover:text-destructive"
                                            onClick={() => onDelete(patient.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
