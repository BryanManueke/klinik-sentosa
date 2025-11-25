# Sentosa Health Hub - Backend API

Backend API server for Sentosa Health Hub application.

## Tech Stack
- Node.js
- Express.js
- TypeScript
- CORS enabled

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Build for Production
```bash
npm run build
npm start
```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Queue
- `GET /api/queue` - Get all queue items
- `POST /api/queue` - Add patient to queue
- `PATCH /api/queue/:id/status` - Update queue status

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `PATCH /api/staff/:id/status` - Update staff status
- `DELETE /api/staff/:id` - Delete staff

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Create new medicine
- `PUT /api/medicines/:id` - Update medicine
- `PATCH /api/medicines/:id/stock` - Update medicine stock
- `DELETE /api/medicines/:id` - Delete medicine

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `POST /api/prescriptions` - Create new prescription
- `PATCH /api/prescriptions/:id/process` - Process prescription
- `PATCH /api/prescriptions/:id/pay` - Mark prescription as paid

### Medical Records
- `GET /api/medical-records` - Get all medical records
- `GET /api/medical-records?patientId=:id` - Get medical records by patient
- `POST /api/medical-records` - Create new medical record

### Health Check
- `GET /api/health` - Check API status
