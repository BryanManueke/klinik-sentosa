import { Staff } from '@/contexts/DataContext';

export interface StaffService {
    validateStaffData: (data: Partial<Staff>) => { isValid: boolean; error?: string };
    formatStaffForSave: (data: any) => Omit<Staff, 'id' | 'status'>;
}

export const staffService: StaffService = {
    validateStaffData: (data: Partial<Staff>) => {
        if (!data.name || !data.email) {
            return { isValid: false, error: 'Mohon lengkapi data staff' };
        }
        return { isValid: true };
    },

    formatStaffForSave: (data: any) => {
        return {
            name: data.name,
            role: data.role,
            email: data.email,
            phone: data.phone,
        };
    }
};
