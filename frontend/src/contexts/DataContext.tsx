import React, { createContext, useContext, useState, ReactNode } from 'react';
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
    name: string;
    stock: number;
    minStock: number;
    unit: string;
    price: number;
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
    status: 'pending' | 'processed' | 'paid';
    totalPrice: number;
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
}

interface DataContextType {
    patients: Patient[];
    queue: QueueItem[];
    medicines: Medicine[];
    prescriptions: Prescription[];
    medicalRecords: MedicalRecord[];
    staff: Staff[];

    addPatient: (patient: Omit<Patient, 'id'>) => void;
    updatePatient: (id: string, updatedPatient: Partial<Patient>) => void;
    deletePatient: (id: string) => void;
    addToQueue: (patientId: string, doctorName: string, complaint?: string) => void;
    updateQueueStatus: (id: string, status: QueueItem['status']) => void;
    updateMedicineStock: (id: string, change: number) => void;
    addPrescription: (prescription: Omit<Prescription, 'id' | 'date' | 'status' | 'totalPrice'>) => void;
    processPrescription: (id: string) => void;
    payPrescription: (id: string) => void;
    addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'date'>) => void;
    getPatient: (id: string) => Patient | undefined;
    addStaff: (staff: Omit<Staff, 'id'>) => void;
    updateStaff: (id: string, updatedStaff: Partial<Staff>) => void;
    deleteStaff: (id: string) => void;
    updateStaffStatus: (id: string, status: Staff['status']) => void;
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
    // Mock Data
    const [patients, setPatients] = useState<Patient[]>([
        { id: 'P001', name: 'Budi Santoso', age: 45, gender: 'Laki-laki', address: 'Jl. Merdeka No. 10', phone: '081234567890', lastVisit: '2024-03-10' },
        { id: 'P002', name: 'Siti Nurhaliza', age: 28, gender: 'Perempuan', address: 'Jl. Sudirman No. 5', phone: '081298765432', lastVisit: '2024-03-15' },
        { id: 'P003', name: 'Ahmad Fauzi', age: 35, gender: 'Laki-laki', address: 'Jl. Gatot Subroto No. 88', phone: '081345678901' },
    ]);

    const [queue, setQueue] = useState<QueueItem[]>([
        { id: 'Q001', patientId: 'P001', patientName: 'Budi Santoso', time: '09:30', status: 'completed', doctor: 'Dr. Sarah' },
        { id: 'Q002', patientId: 'P002', patientName: 'Siti Nurhaliza', time: '10:15', status: 'waiting', doctor: 'Dr. Ahmad' },
    ]);

    const [medicines, setMedicines] = useState<Medicine[]>([
        { id: 'M001', name: 'Paracetamol 500mg', stock: 150, minStock: 50, unit: 'Tablet', price: 500 },
        { id: 'M002', name: 'Amoxicillin 500mg', stock: 80, minStock: 30, unit: 'Kapsul', price: 2000 },
        { id: 'M003', name: 'Vitamin C 1000mg', stock: 200, minStock: 50, unit: 'Tablet', price: 1500 },
        { id: 'M004', name: 'OBH Sirup', stock: 25, minStock: 20, unit: 'Botol', price: 15000 },
        { id: 'M005', name: 'Betadine', stock: 40, minStock: 20, unit: 'Botol', price: 25000 },
    ]);

    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

    const [staff, setStaff] = useState<Staff[]>([
        { id: 'S001', name: 'Dr. Sarah Wijaya', role: 'Dokter Umum', email: 'sarah@kliniksentosa.com', phone: '08123456789', status: 'active' },
        { id: 'S002', name: 'Dr. Ahmad Fauzi', role: 'Dokter Gigi', email: 'ahmad@kliniksentosa.com', phone: '08198765432', status: 'active' },
        { id: 'S003', name: 'Siti Nurhaliza', role: 'Perawat', email: 'siti@kliniksentosa.com', phone: '08234567890', status: 'active' },
        { id: 'S004', name: 'Budi Santoso', role: 'Admin', email: 'budi@kliniksentosa.com', phone: '08345678901', status: 'active' },
        { id: 'S005', name: 'Dewi Lestari', role: 'Apoteker', email: 'dewi@kliniksentosa.com', phone: '08456789012', status: 'active' },
    ]);

    // Actions
    const addPatient = (patient: Omit<Patient, 'id'>) => {
        const newPatient = { ...patient, id: `P${String(patients.length + 1).padStart(3, '0')}` };
        setPatients([...patients, newPatient]);
        toast.success('Pasien berhasil didaftarkan');
    };

    const updatePatient = (id: string, updatedPatient: Partial<Patient>) => {
        setPatients(patients.map(p => p.id === id ? { ...p, ...updatedPatient } : p));
        toast.success('Data pasien berhasil diperbarui');
    };

    const deletePatient = (id: string) => {
        setPatients(patients.filter(p => p.id !== id));
        toast.success('Data pasien berhasil dihapus');
    };

    const addToQueue = (patientId: string, doctorName: string, complaint?: string) => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient) return;

        const newItem: QueueItem = {
            id: `Q${String(queue.length + 1).padStart(3, '0')}`,
            patientId,
            patientName: patient.name,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            status: 'waiting',
            doctor: doctorName,
            complaint
        };
        setQueue([...queue, newItem]);
        toast.success('Pasien ditambahkan ke antrian');
    };

    const updateQueueStatus = (id: string, status: QueueItem['status']) => {
        setQueue(queue.map(item => item.id === id ? { ...item, status } : item));
    };

    const updateMedicineStock = (id: string, change: number) => {
        setMedicines(medicines.map(med =>
            med.id === id ? { ...med, stock: Math.max(0, med.stock + change) } : med
        ));
    };

    const addPrescription = (prescriptionData: Omit<Prescription, 'id' | 'date' | 'status' | 'totalPrice'>) => {
        const totalPrice = prescriptionData.items.reduce((sum, item) => {
            const med = medicines.find(m => m.id === item.medicineId);
            return sum + (med ? med.price * item.amount : 0);
        }, 0);

        const newPrescription: Prescription = {
            ...prescriptionData,
            id: `RX${String(prescriptions.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            totalPrice
        };
        setPrescriptions([...prescriptions, newPrescription]);
    };

    const processPrescription = (id: string) => {
        const prescription = prescriptions.find(p => p.id === id);
        if (!prescription) return;

        // Check stock first
        const enoughStock = prescription.items.every(item => {
            const med = medicines.find(m => m.id === item.medicineId);
            return med && med.stock >= item.amount;
        });

        if (!enoughStock) {
            toast.error('Stok obat tidak mencukupi!');
            return;
        }

        // Deduct stock
        prescription.items.forEach(item => {
            updateMedicineStock(item.medicineId, -item.amount);
        });

        setPrescriptions(prescriptions.map(p =>
            p.id === id ? { ...p, status: 'processed' } : p
        ));
        toast.success('Resep berhasil diproses');
    };

    const payPrescription = (id: string) => {
        setPrescriptions(prescriptions.map(p =>
            p.id === id ? { ...p, status: 'paid' } : p
        ));
        toast.success('Pembayaran berhasil dikonfirmasi');
    };

    const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'date'>) => {
        const newRecord = {
            ...record,
            id: `MR${String(medicalRecords.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0]
        };
        setMedicalRecords([...medicalRecords, newRecord]);
    };

    const getPatient = (id: string) => patients.find(p => p.id === id);

    const addStaff = (newStaff: Omit<Staff, 'id'>) => {
        const staffMember = {
            ...newStaff,
            id: `S${String(staff.length + 1).padStart(3, '0')}`
        };
        setStaff([...staff, staffMember]);
        toast.success('Staff berhasil ditambahkan');
    };

    const updateStaff = (id: string, updatedStaff: Partial<Staff>) => {
        setStaff(staff.map(s => s.id === id ? { ...s, ...updatedStaff } : s));
        toast.success('Data staff berhasil diperbarui');
    };

    const deleteStaff = (id: string) => {
        setStaff(staff.filter(s => s.id !== id));
        toast.success('Staff berhasil dihapus');
    };

    const updateStaffStatus = (id: string, status: Staff['status']) => {
        setStaff(staff.map(s => s.id === id ? { ...s, status } : s));
        toast.success('Status staff diperbarui');
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
            updateMedicineStock,
            addPrescription,
            processPrescription,
            payPrescription,
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
