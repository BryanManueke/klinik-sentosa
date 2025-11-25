import { Patient } from '@/contexts/DataContext';

export interface PatientService {
    validatePatientData: (data: Partial<Patient>) => { isValid: boolean; error?: string };
    formatPatientForSave: (data: any) => Omit<Patient, 'id'>;
}

export const patientService: PatientService = {
    validatePatientData: (data: Partial<Patient>) => {
        if (!data.name || !data.age) {
            return { isValid: false, error: 'Mohon lengkapi data pasien' };
        }
        return { isValid: true };
    },

    formatPatientForSave: (data: any) => {
        return {
            name: data.name,
            age: parseInt(data.age),
            gender: data.gender as 'Laki-laki' | 'Perempuan',
            phone: data.phone,
            address: data.address,
            lastVisit: new Date().toISOString().split('T')[0],
        };
    }
};
