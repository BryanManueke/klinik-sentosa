// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

// Patients API
export const patientsAPI = {
    getAll: () => fetchAPI<any[]>('/patients'),
    getById: (id: string) => fetchAPI<any>(`/patients/${id}`),
    create: (data: any) => fetchAPI<any>('/patients', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchAPI<any>(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI<void>(`/patients/${id}`, {
        method: 'DELETE',
    }),
};

// Queue API
export const queueAPI = {
    getAll: () => fetchAPI<any[]>('/queue'),
    getByPatient: (patientId: string) => fetchAPI<any[]>(`/queue/patient/${patientId}`),
    addToQueue: (data: { patientId: string; doctorName: string; complaint?: string }) =>
        fetchAPI<any>('/queue', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateStatus: (id: string, status: string) =>
        fetchAPI<any>(`/queue/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
};

// Staff API
export const staffAPI = {
    getAll: () => fetchAPI<any[]>('/staff'),
    create: (data: any) => fetchAPI<any>('/staff', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchAPI<any>(`/staff/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    updateStatus: (id: string, status: string) =>
        fetchAPI<any>(`/staff/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
    delete: (id: string) => fetchAPI<void>(`/staff/${id}`, {
        method: 'DELETE',
    }),
};

// Medicines API
export const medicinesAPI = {
    getAll: () => fetchAPI<any[]>('/medicines'),
    create: (data: any) => fetchAPI<any>('/medicines', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchAPI<any>(`/medicines/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    updateStock: (id: string, change: number) =>
        fetchAPI<any>(`/medicines/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ change }),
        }),
    delete: (id: string) => fetchAPI<void>(`/medicines/${id}`, {
        method: 'DELETE',
    }),
};

// Prescriptions API
export const prescriptionsAPI = {
    getAll: () => fetchAPI<any[]>('/prescriptions'),
    getByPatient: (patientId: string) => fetchAPI<any[]>(`/prescriptions/patient/${patientId}`),
    create: (data: any) => fetchAPI<any>('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    process: (id: string) =>
        fetchAPI<any>(`/prescriptions/${id}/process`, {
            method: 'PATCH',
        }),
    pay: (id: string) =>
        fetchAPI<any>(`/prescriptions/${id}/pay`, {
            method: 'PATCH',
        }),
};

// Medical Records API
export const medicalRecordsAPI = {
    getAll: (patientId?: string) => {
        const query = patientId ? `?patientId=${patientId}` : '';
        return fetchAPI<any[]>(`/medical-records${query}`);
    },
    create: (data: any) => fetchAPI<any>('/medical-records', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

// Health Check
export const healthCheck = () => fetchAPI<{ status: string; message: string }>('/health');
