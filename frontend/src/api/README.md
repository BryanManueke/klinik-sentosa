# API Client Documentation

This directory contains the API client for communicating with the backend server.

## Usage

```typescript
import { patientsAPI, queueAPI, staffAPI } from '@/api/client';

// Get all patients
const patients = await patientsAPI.getAll();

// Create a new patient
const newPatient = await patientsAPI.create({
  name: 'John Doe',
  age: 30,
  gender: 'Laki-laki',
  phone: '08123456789',
  address: 'Jakarta'
});

// Update patient
await patientsAPI.update('P001', { age: 31 });

// Delete patient
await patientsAPI.delete('P001');
```

## Available APIs

- `patientsAPI` - Patient management
- `queueAPI` - Queue management
- `staffAPI` - Staff management
- `medicinesAPI` - Medicine inventory
- `prescriptionsAPI` - Prescription management
- `medicalRecordsAPI` - Medical records
- `healthCheck` - API health check

## Configuration

The API base URL is configured in `client.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

Make sure the backend server is running on port 3001.
