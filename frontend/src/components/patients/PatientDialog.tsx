import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface PatientFormData {
    name: string;
    age: string;
    gender: string;
    phone: string;
    address: string;
}

interface PatientDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PatientFormData) => void;
    initialData?: PatientFormData;
    mode: 'add' | 'edit';
}

export const PatientDialog = ({ isOpen, onClose, onSubmit, initialData, mode }: PatientDialogProps) => {
    const [formData, setFormData] = useState<PatientFormData>({
        name: '',
        age: '',
        gender: 'Laki-laki',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (isOpen && !initialData) {
            setFormData({
                name: '',
                age: '',
                gender: 'Laki-laki',
                phone: '',
                address: '',
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Tambah Pasien Baru' : 'Edit Data Pasien'}</DialogTitle>
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
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit}>
                        {mode === 'add' ? 'Simpan' : 'Simpan Perubahan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
