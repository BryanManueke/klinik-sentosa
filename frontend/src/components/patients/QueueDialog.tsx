import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Staff } from '@/contexts/DataContext';

interface QueueDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (doctorName: string, complaint: string) => void;
    doctors: Staff[];
}

export const QueueDialog = ({ isOpen, onClose, onSubmit, doctors }: QueueDialogProps) => {
    const [queueData, setQueueData] = useState({
        doctorName: '',
        complaint: ''
    });

    useEffect(() => {
        if (isOpen) {
            setQueueData({ doctorName: '', complaint: '' });
        }
    }, [isOpen]);

    const handleSubmit = () => {
        onSubmit(queueData.doctorName, queueData.complaint);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Masuk Antrian</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="doctor">Pilih Dokter</Label>
                        <Select
                            value={queueData.doctorName}
                            onValueChange={(value) => setQueueData({ ...queueData, doctorName: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih dokter..." />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((doctor) => (
                                    <SelectItem key={doctor.id} value={doctor.name}>
                                        {doctor.name} ({doctor.role})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="complaint">Keluhan Utama</Label>
                        <Textarea
                            id="complaint"
                            value={queueData.complaint}
                            onChange={(e) => setQueueData({ ...queueData, complaint: e.target.value })}
                            placeholder="Contoh: Demam tinggi sejak kemarin"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSubmit}>Simpan ke Antrian</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
