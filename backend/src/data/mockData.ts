// Mock Data Storage
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

// In-memory data storage
export let patients: Patient[] = [
    { id: 'P001', name: 'Budi Santoso', age: 45, gender: 'Laki-laki', address: 'Jl. Merdeka No. 10', phone: '081234567890', lastVisit: '2024-03-10' },
    { id: 'P002', name: 'Siti Nurhaliza', age: 28, gender: 'Perempuan', address: 'Jl. Sudirman No. 5', phone: '081298765432', lastVisit: '2024-03-15' },
    { id: 'P003', name: 'Ahmad Fauzi', age: 35, gender: 'Laki-laki', address: 'Jl. Gatot Subroto No. 88', phone: '081345678901' },
];

export let queue: QueueItem[] = [
    { id: 'Q001', patientId: 'P001', patientName: 'Budi Santoso', time: '09:30', status: 'completed', doctor: 'Dr. Sarah' },
    { id: 'Q002', patientId: 'P002', patientName: 'Siti Nurhaliza', time: '10:15', status: 'waiting', doctor: 'Dr. Ahmad' },
];

export let medicines: Medicine[] = [
    { id: 'M001', name: 'Paracetamol 500mg', stock: 150, minStock: 50, unit: 'Tablet', price: 500 },
    { id: 'M002', name: 'Amoxicillin 500mg', stock: 80, minStock: 30, unit: 'Kapsul', price: 2000 },
    { id: 'M003', name: 'Vitamin C 1000mg', stock: 200, minStock: 50, unit: 'Tablet', price: 1500 },
    { id: 'M004', name: 'OBH Sirup', stock: 25, minStock: 20, unit: 'Botol', price: 15000 },
    { id: 'M005', name: 'Betadine', stock: 40, minStock: 20, unit: 'Botol', price: 25000 },
];

export let prescriptions: Prescription[] = [];

export let medicalRecords: MedicalRecord[] = [];

export let staff: Staff[] = [
    { id: 'S001', name: 'Dr. Sarah Wijaya', role: 'Dokter Umum', email: 'sarah@kliniksentosa.com', phone: '08123456789', status: 'active' },
    { id: 'S002', name: 'Dr. Ahmad Fauzi', role: 'Dokter Gigi', email: 'ahmad@kliniksentosa.com', phone: '08198765432', status: 'active' },
    { id: 'S003', name: 'Siti Nurhaliza', role: 'Perawat', email: 'siti@kliniksentosa.com', phone: '08234567890', status: 'active' },
    { id: 'S004', name: 'Budi Santoso', role: 'Admin', email: 'budi@kliniksentosa.com', phone: '08345678901', status: 'active' },
    { id: 'S005', name: 'Dewi Lestari', role: 'Apoteker', email: 'dewi@kliniksentosa.com', phone: '08456789012', status: 'active' },
];
