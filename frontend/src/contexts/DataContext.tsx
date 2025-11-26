import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Interfaces
export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Laki-laki' | 'Perempuan';
    address: string;
    phone: string;
    lastVisit?: string;
}

export interface QueueItem {
    id: string;
    patientId: string;
    patientName: string;
    time: string;
    status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
    doctor: string;
    complaint?: string;
}

export interface Medicine {
    id: string;
    code?: string;
    name: string;
    genericName?: string;
    category?: string;
    manufacturer?: string;
    description?: string;
    stock: number;
    minStock: number;
    unit: string;
    price: number;
    costPrice?: number;
    expiryDate?: string;
    batchNumber?: string;
    supplier?: string;
    location?: string;
    requiresPrescription?: boolean;
}

export interface PrescriptionItem {
    medicineId: string;
    medicineName: string;
    amount: number;
    instructions: string;
}

export interface Prescription {
    id: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    date: string;
    items: PrescriptionItem[];
    status: 'pending' | 'processing' | 'ready' | 'dispensed' | 'cancelled';
    totalPrice: number;
    processedBy?: string;
    processedAt?: string;
    dispensedAt?: string;
    notes?: string;
}

export interface MedicalRecord {
    id: string;
    patientId: string;
    date: string;
    complaint: string;
    diagnosis: string;
    treatment: string;
    doctorName: string;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    specialty?: string;
}

interface DataContextType {
    patients: Patient[];
    queue: QueueItem[];
    medicines: Medicine[];
    prescriptions: Prescription[];
    medicalRecords: MedicalRecord[];
    staff: Staff[];

    addPatient: (patient: Omit<Patient, 'id'>) => Promise<Patient | null>;
    updatePatient: (id: string, updatedPatient: Partial<Patient>) => void;
    deletePatient: (id: string) => void;
    addToQueue: (patientId: string, doctorName: string, complaint?: string) => Promise<QueueItem | null>;
    updateQueueStatus: (id: string, status: QueueItem['status']) => void;
    updateMedicineStock: (id: string, change: number) => void;
    addPrescription: (prescription: Omit<Prescription, 'id' | 'date' | 'totalPrice'>) => void;
    updatePrescriptionStatus: (id: string, status: Prescription['status']) => void;
    startProcessingPrescription: (id: string, processedBy: string) => void;
    markPrescriptionReady: (id: string) => void;
    dispensePrescription: (id: string) => void;
    cancelPrescription: (id: string, reason: string) => void;
    batchProcessPrescriptions: (ids: string[], processedBy: string) => void;
    addPrescriptionNote: (id: string, note: string) => void;
    addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => void;
    getPatient: (id: string) => Patient | undefined;
    addStaff: (staff: Omit<Staff, 'id'>) => void;
    updateStaff: (id: string, updatedStaff: Partial<Staff>) => void;
    deleteStaff: (id: string) => void;
    updateStaffStatus: (id: string, status: Staff['status']) => void;
    addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
    updateMedicine: (id: string, updatedMedicine: Partial<Medicine>) => void;
    deleteMedicine: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);

    const API_URL = 'http://127.0.0.1:3001';

    const fetchData = async () => {
        try {
            const [patientsRes, queueRes, medicinesRes, prescriptionsRes, recordsRes, staffRes] = await Promise.all([
                fetch(`${API_URL}/patients`),
                fetch(`${API_URL}/queue`),
                fetch(`${API_URL}/medicines`),
                fetch(`${API_URL}/prescriptions`),
                fetch(`${API_URL}/medicalRecords`),
                fetch(`${API_URL}/staff`)
            ]);

            if (patientsRes.ok) setPatients(await patientsRes.json());
            if (queueRes.ok) setQueue(await queueRes.json());
            if (medicinesRes.ok) setMedicines(await medicinesRes.json());
            if (prescriptionsRes.ok) setPrescriptions(await prescriptionsRes.json());
            if (recordsRes.ok) setMedicalRecords(await recordsRes.json());
            if (staffRes.ok) setStaff(await staffRes.json());
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Gagal memuat data dari server. Pastikan backend berjalan.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper to generate next ID
    const generateId = (prefix: string, items: { id: string }[]) => {
        const maxId = items.reduce((max, item) => {
            const num = parseInt(item.id.replace(prefix, ''));
            return isNaN(num) ? max : Math.max(max, num);
        }, 0);
        return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
    };

    // Actions
    const addPatient = async (patient: Omit<Patient, 'id'>) => {
        try {
            // Fetch latest patients to ensure ID uniqueness
            const latestRes = await fetch(`${API_URL}/patients`);
            const latestPatients: Patient[] = latestRes.ok ? await latestRes.json() : patients;

            const generatedId = generateId('P', latestPatients);
            console.log('Generating Patient ID:', generatedId, 'Based on count:', latestPatients.length);

            const newPatient = { ...patient, id: generatedId };

            const res = await fetch(`${API_URL}/patients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPatient)
            });

            if (res.ok) {
                const saved = await res.json();
                setPatients([...patients, saved]);
                toast.success('Pasien berhasil didaftarkan');
                return saved;
            } else {
                console.error('Failed to add patient:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Exception in addPatient:', error);
            toast.error('Gagal menambahkan pasien');
            return null;
        }
        return null;
    };

    const updatePatient = async (id: string, updatedPatient: Partial<Patient>) => {
        try {
            const res = await fetch(`${API_URL}/patients/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPatient)
            });
            if (res.ok) {
                setPatients(patients.map(p => p.id === id ? { ...p, ...updatedPatient } : p));
                toast.success('Data pasien berhasil diperbarui');
            }
        } catch (error) {
            toast.error('Gagal memperbarui pasien');
        }
    };

    const deletePatient = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPatients(patients.filter(p => p.id !== id));
                toast.success('Data pasien berhasil dihapus');
            }
        } catch (error) {
            toast.error('Gagal menghapus pasien');
        }
    };

    const addToQueue = async (patientId: string, doctorName: string, complaint?: string) => {
        let patient = patients.find(p => p.id === patientId);

        // If not found in local state (possible race condition after addPatient), fetch from API
        if (!patient) {
            try {
                const res = await fetch(`${API_URL}/patients/${patientId}`);
                if (res.ok) {
                    patient = await res.json();
                }
            } catch (error) {
                console.error('Error fetching patient for queue:', error);
            }
        }

        if (!patient) {
            console.error('Patient not found for queue:', patientId);
            return null;
        }

        try {
            // Fetch latest queue to ensure ID uniqueness
            const latestRes = await fetch(`${API_URL}/queue`);
            const latestQueue: QueueItem[] = latestRes.ok ? await latestRes.json() : queue;

            const generatedId = generateId('Q', latestQueue);
            console.log('Generating Queue ID:', generatedId, 'Based on count:', latestQueue.length);

            const newItem: QueueItem = {
                id: generatedId,
                patientId,
                patientName: patient.name,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                status: 'waiting',
                doctor: doctorName,
                complaint
            };

            const res = await fetch(`${API_URL}/queue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                const saved = await res.json();
                setQueue([...queue, saved]);
                toast.success('Pasien ditambahkan ke antrian');
                return saved;
            } else {
                console.error('Failed to add to queue:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Exception in addToQueue:', error);
            toast.error('Gagal menambah antrian');
        }
        return null;
    };

    const updateQueueStatus = async (id: string, status: QueueItem['status']) => {
        try {
            const res = await fetch(`${API_URL}/queue/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setQueue(queue.map(item => item.id === id ? { ...item, status } : item));
            }
        } catch (error) {
            toast.error('Gagal update status antrian');
        }
    };

    const addMedicine = async (medicine: Omit<Medicine, 'id'>) => {
        const newMedicine = {
            ...medicine,
            id: generateId('M', medicines)
        };
        try {
            const res = await fetch(`${API_URL}/medicines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMedicine)
            });
            if (res.ok) {
                const saved = await res.json();
                setMedicines([...medicines, saved]);
                toast.success('Obat berhasil ditambahkan');
            }
        } catch (error) {
            toast.error('Gagal menambah obat');
        }
    };

    const updateMedicine = async (id: string, updatedMedicine: Partial<Medicine>) => {
        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMedicine)
            });
            if (res.ok) {
                setMedicines(medicines.map(m => m.id === id ? { ...m, ...updatedMedicine } : m));
                toast.success('Data obat berhasil diperbarui');
            }
        } catch (error) {
            toast.error('Gagal memperbarui obat');
        }
    };

    const deleteMedicine = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMedicines(medicines.filter(m => m.id !== id));
                toast.success('Obat berhasil dihapus');
            }
        } catch (error) {
            toast.error('Gagal menghapus obat');
        }
    };

    const updateMedicineStock = async (id: string, change: number) => {
        const med = medicines.find(m => m.id === id);
        if (!med) return;
        const newStock = Math.max(0, med.stock + change);

        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock })
            });
            if (res.ok) {
                setMedicines(medicines.map(m => m.id === id ? { ...m, stock: newStock } : m));
            }
        } catch (error) {
            toast.error('Gagal update stok obat');
        }
    };

    const addPrescription = async (prescriptionData: Omit<Prescription, 'id' | 'date' | 'totalPrice'>) => {
        const totalPrice = prescriptionData.items.reduce((sum, item) => {
            const med = medicines.find(m => m.id === item.medicineId);
            return sum + (med ? med.price * item.amount : 0);
        }, 0);

        const newPrescription: Prescription = {
            ...prescriptionData,
            id: generateId('RX', prescriptions),
            date: new Date().toISOString().split('T')[0],
            status: prescriptionData.status || 'pending',
            totalPrice
        };

        try {
            const res = await fetch(`${API_URL}/prescriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPrescription)
            });
            if (res.ok) {
                const saved = await res.json();
                setPrescriptions([...prescriptions, saved]);

                // If status is 'processed' or 'ready' or 'dispensed', we might want to deduct stock immediately?
                // For now, let's keep it simple. If it's a direct transaction, we might handle stock deduction separately or here.
                // But typically 'processed' means waiting for payment.
                toast.success('Resep/Transaksi berhasil dibuat');
            }
        } catch (error) {
            toast.error('Gagal membuat resep');
        }
    };

    const updatePrescriptionStatus = async (id: string, status: Prescription['status']) => {
        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setPrescriptions(prescriptions.map(p =>
                    p.id === id ? { ...p, status } : p
                ));
            }
        } catch (error) {
            toast.error('Gagal mengubah status resep');
        }
    };

    const startProcessingPrescription = async (id: string, processedBy: string) => {
        const prescription = prescriptions.find(p => p.id === id);
        if (!prescription) return;

        // Check stock availability
        const enoughStock = prescription.items.every(item => {
            const med = medicines.find(m => m.id === item.medicineId);
            return med && med.stock >= item.amount;
        });

        if (!enoughStock) {
            toast.error('Stok obat tidak mencukupi!');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'processing',
                    processedBy,
                    processedAt: new Date().toISOString()
                })
            });
            if (res.ok) {
                setPrescriptions(prescriptions.map(p =>
                    p.id === id ? { ...p, status: 'processing', processedBy, processedAt: new Date().toISOString() } : p
                ));
                toast.success('Resep sedang diproses');
            }
        } catch (error) {
            toast.error('Gagal memproses resep');
        }
    };

    const markPrescriptionReady = async (id: string) => {
        const prescription = prescriptions.find(p => p.id === id);
        if (!prescription) return;

        // Deduct stock when marking as ready
        for (const item of prescription.items) {
            await updateMedicineStock(item.medicineId, -item.amount);
        }

        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ready' })
            });
            if (res.ok) {
                setPrescriptions(prescriptions.map(p =>
                    p.id === id ? { ...p, status: 'ready' } : p
                ));
                toast.success('Resep siap diambil');
            }
        } catch (error) {
            toast.error('Gagal menandai resep siap');
        }
    };

    const dispensePrescription = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'dispensed',
                    dispensedAt: new Date().toISOString()
                })
            });
            if (res.ok) {
                setPrescriptions(prescriptions.map(p =>
                    p.id === id ? { ...p, status: 'dispensed', dispensedAt: new Date().toISOString() } : p
                ));
                toast.success('Resep telah diserahkan');
            }
        } catch (error) {
            toast.error('Gagal menyerahkan resep');
        }
    };

    const cancelPrescription = async (id: string, reason: string) => {
        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'cancelled',
                    notes: reason
                })
            });
            if (res.ok) {
                setPrescriptions(prescriptions.map(p =>
                    p.id === id ? { ...p, status: 'cancelled', notes: reason } : p
                ));
                toast.success('Resep dibatalkan');
            }
        } catch (error) {
            toast.error('Gagal membatalkan resep');
        }
    };

    const batchProcessPrescriptions = async (ids: string[], processedBy: string) => {
        for (const id of ids) {
            await startProcessingPrescription(id, processedBy);
        }
        toast.success(`${ids.length} resep sedang diproses`);
    };

    const addPrescriptionNote = async (id: string, note: string) => {
        try {
            const res = await fetch(`${API_URL}/prescriptions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: note })
            });
            if (res.ok) {
                setPrescriptions(prescriptions.map(p =>
                    p.id === id ? { ...p, notes: note } : p
                ));
                toast.success('Catatan ditambahkan');
            }
        } catch (error) {
            toast.error('Gagal menambah catatan');
        }
    };

    const addMedicalRecord = async (record: Omit<MedicalRecord, 'id' | 'date'>) => {
        const newRecord = {
            ...record,
            id: generateId('MR', medicalRecords),
            date: new Date().toISOString().split('T')[0]
        };

        try {
            const res = await fetch(`${API_URL}/medicalRecords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord)
            });
            if (res.ok) {
                const saved = await res.json();
                setMedicalRecords([...medicalRecords, saved]);
            }
        } catch (error) {
            toast.error('Gagal menambah rekam medis');
        }
    };

    const getPatient = (id: string) => patients.find(p => p.id === id);

    const addStaff = async (newStaff: Omit<Staff, 'id'>) => {
        const staffMember = {
            ...newStaff,
            id: generateId('S', staff)
        };
        try {
            const res = await fetch(`${API_URL}/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staffMember)
            });
            if (res.ok) {
                const saved = await res.json();
                setStaff([...staff, saved]);
                toast.success('Staff berhasil ditambahkan');
            }
        } catch (error) {
            toast.error('Gagal menambah staff');
        }
    };

    const updateStaff = async (id: string, updatedStaff: Partial<Staff>) => {
        try {
            const res = await fetch(`${API_URL}/staff/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStaff)
            });
            if (res.ok) {
                setStaff(staff.map(s => s.id === id ? { ...s, ...updatedStaff } : s));
                toast.success('Data staff berhasil diperbarui');
            }
        } catch (error) {
            toast.error('Gagal update staff');
        }
    };

    const deleteStaff = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/staff/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setStaff(staff.filter(s => s.id !== id));
                toast.success('Staff berhasil dihapus');
            }
        } catch (error) {
            toast.error('Gagal menghapus staff');
        }
    };

    const updateStaffStatus = async (id: string, status: Staff['status']) => {
        try {
            const res = await fetch(`${API_URL}/staff/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setStaff(staff.map(s => s.id === id ? { ...s, status } : s));
                toast.success('Status staff diperbarui');
            }
        } catch (error) {
            toast.error('Gagal update status staff');
        }
    };

    return (
        <DataContext.Provider value={{
            patients,
            queue,
            medicines,
            prescriptions,
            medicalRecords,
            staff,
            addPatient,
            updatePatient,
            deletePatient,
            addToQueue,
            updateQueueStatus,
            addMedicine,
            updateMedicine,
            deleteMedicine,
            updateMedicineStock,
            addPrescription,
            updatePrescriptionStatus,
            startProcessingPrescription,
            markPrescriptionReady,
            dispensePrescription,
            cancelPrescription,
            batchProcessPrescriptions,
            addPrescriptionNote,
            addMedicalRecord,
            getPatient,
            addStaff,
            updateStaff,
            deleteStaff,
            updateStaffStatus
        }}>
            {children}
        </DataContext.Provider>
    );
};
