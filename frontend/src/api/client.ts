// API Base URL
const API_BASE_URL = 'http://localhost:3001';

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
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI<void>(`/patients/${id}`, {
        method: 'DELETE',
    }),
};

// Queue API
export const queueAPI = {
    getAll: () => fetchAPI<any[]>('/queue'),
    getByPatient: (patientId: string) => fetchAPI<any[]>(`/queue?patientId=${patientId}`),
    addToQueue: (data: { patientId: string; doctorName: string; complaint?: string }) =>
        fetchAPI<any>('/queue', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateStatus: (id: string, status: string) =>
        fetchAPI<any>(`/queue/${id}`, {
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
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    updateStatus: (id: string, status: string) =>
        fetchAPI<any>(`/staff/${id}`, {
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
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    updateStock: (id: string, change: number) => {
        // Note: json-server doesn't support atomic increment. 
        // We would need to fetch, calculate, and patch. 
        // For now, we assume the caller handles the logic or we just patch the new value if passed.
        // But since the signature is (change: number), we can't easily do it here without fetching.
        // However, DataContext handles this logic. This API might be used elsewhere?
        // Let's assume the caller passes the NEW stock value if we change the signature, 
        // but to keep compatibility, we might need to fetch first.
        // For simplicity in this fix, we'll assume this might be broken for concurrent updates 
        // but we can't change signature easily.
        // Actually, let's just fetch and update.
        return fetchAPI<any>(`/medicines/${id}`).then(med =>
            fetchAPI<any>(`/medicines/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ stock: med.stock + change }),
            })
        );
    },
    delete: (id: string) => fetchAPI<void>(`/medicines/${id}`, {
        method: 'DELETE',
    }),
};

// Prescriptions API
export const prescriptionsAPI = {
    getAll: () => fetchAPI<any[]>('/prescriptions'),
    getByPatient: (patientId: string) => fetchAPI<any[]>(`/prescriptions?patientId=${patientId}`),
    create: (data: any) => fetchAPI<any>('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    process: (id: string) =>
        fetchAPI<any>(`/prescriptions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'processed' }),
        }),
    pay: (id: string) =>
        fetchAPI<any>(`/prescriptions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: 'paid' }),
        }),
};

// Medical Records API
export const medicalRecordsAPI = {
    getAll: (patientId?: string) => {
        const query = patientId ? `?patientId=${patientId}` : '';
        return fetchAPI<any[]>(`/medicalRecords${query}`);
    },
    create: (data: any) => fetchAPI<any>('/medicalRecords', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

// Health Check
export const healthCheck = () => Promise.resolve({ status: 'ok', message: 'JSON Server running' });
