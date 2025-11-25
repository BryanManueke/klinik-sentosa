import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface StaffFormData {
    name: string;
    role: string;
    email: string;
    phone: string;
}

interface StaffDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StaffFormData) => void;
    initialData?: StaffFormData;
    mode: 'add' | 'edit';
}

export const StaffDialog = ({ isOpen, onClose, onSubmit, initialData, mode }: StaffDialogProps) => {
    const [formData, setFormData] = useState<StaffFormData>({
        name: '',
        role: 'Dokter Umum',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (isOpen && !initialData) {
            setFormData({
                name: '',
                role: 'Dokter Umum',
                email: '',
                phone: '',
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Tambah Staff Baru' : 'Edit Data Staff'}</DialogTitle>
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
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit}>{mode === 'add' ? 'Simpan' : 'Simpan Perubahan'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
