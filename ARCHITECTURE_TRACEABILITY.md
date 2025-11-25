# Software Architecture Document (SAD) - Ketertelusuran Artefak

**Proyek:** Sentosa Health Hub - Sistem Manajemen Klinik Terintegrasi  
**Tanggal:** November 25, 2025  
**Versi:** 1.0

---

## Daftar Isi
1. [Ringkasan Eksekutif](#ringkasan-eksekutif)
2. [Pemetaan Use Cases](#pemetaan-use-cases)
3. [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram)
4. [Data Flow Diagram (DFD)](#data-flow-diagram)
5. [User Stories dan Mapping](#user-stories-dan-mapping)
6. [Arsitektur Sistem](#arsitektur-sistem)
7. [Komponen dan Dependencies](#komponen-dan-dependencies)

---

## Ringkasan Eksekutif

Sentosa Health Hub adalah aplikasi manajemen klinik yang mengintegrasikan:
- **Frontend**: React + TypeScript + Vite (Port 8080)
- **Backend**: Express.js + TypeScript (Port 3001)
- **Database**: In-memory (mockData) - siap untuk integrasi database real

### Tujuan Sistem
- Mengelola data pasien dan tenaga medis
- Menangani antrian pasien secara real-time
- Mengelola resep dan pembayaran apotek
- Tracking riwayat medis pasien

---

## Pemetaan Use Cases

### UC-001: Manajemen Data Pasien

**Deskripsi:** Sistem dapat mengelola informasi pasien termasuk registrasi, update, dan penghapusan.

**Aktor:** Admin, Staff Medis

**Flow Utama:**
1. Staff membuka halaman Patients
2. Klik "Tambah Pasien"
3. Isi form (nama, umur, gender, alamat, telepon)
4. Sistem menyimpan data pasien
5. Pasien muncul di tabel

**Artefak SAD:**
- **Frontend Component**: `frontend/src/pages/Patients.tsx`
- **Frontend Component**: `frontend/src/components/patients/PatientDialog.tsx`
- **Backend Route**: `backend/src/routes/patients.ts`
- **Data Interface**: `frontend/src/contexts/DataContext.tsx` - `Patient` interface
- **Context Method**: `addPatient()`, `updatePatient()`, `deletePatient()`

**Backend Endpoints:**
```
GET    /api/patients           - List semua pasien
POST   /api/patients           - Tambah pasien baru
GET    /api/patients/:id       - Ambil data pasien spesifik
PUT    /api/patients/:id       - Update data pasien
DELETE /api/patients/:id       - Hapus data pasien
```

**Testing:** 
```bash
# Tambah pasien
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"Bryan","age":25,"gender":"Laki-laki","address":"Jl. Test","phone":"081234567"}'

# List pasien
curl http://localhost:3001/api/patients
```

---

### UC-002: Manajemen Antrian Pasien

**Deskripsi:** Pasien dapat mendaftar antrian pemeriksaan, status antrian dapat diupdate secara real-time.

**Aktor:** Pasien, Staff Medis, Dokter

**Flow Utama:**
1. Pasien login dan buka Dashboard
2. Klik "Daftar Antrian"
3. Pilih dokter dan isi keluhan
4. Sistem membuat entry antrian (status: waiting)
5. Pasien dapat melihat posisi antrian mereka
6. Dokter dapat mengubah status → in-progress → completed

**Artefak SAD:**
- **Frontend Component**: `frontend/src/pages/Queue.tsx`
- **Frontend Component**: `frontend/src/components/patient/QueueStatusCard.tsx`
- **Frontend Dialog**: `frontend/src/components/patients/QueueDialog.tsx`
- **Backend Route**: `backend/src/routes/queue.ts`
- **Data Interface**: `DataContext.tsx` - `QueueItem` interface
- **Context Methods**: `addToQueue()`, `updateQueueStatus()`
- **Dashboard Integration**: `frontend/src/pages/Dashboard.tsx` (lines 85-102)

**Data Model:**
```typescript
interface QueueItem {
    id: string;
    patientId: string;
    patientName: string;
    time: string;
    status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
    doctor: string;
    complaint?: string;
}
```

**Backend Endpoints:**
```
GET    /api/queue              - List antrian
POST   /api/queue              - Tambah antrian baru
GET    /api/queue/:id          - Ambil antrian spesifik
PUT    /api/queue/:id          - Update status antrian
DELETE /api/queue/:id          - Batalkan antrian
GET    /api/queue/patient/:id  - Ambil antrian pasien tertentu
```

**Real-time Features:**
- Polling setiap 5 detik di `useRealTimeData` hook
- Update otomatis status antrian di QueueStatusCard

---

### UC-003: Pemeriksaan dan Riwayat Medis

**Deskripsi:** Dokter dapat membuat catatan pemeriksaan dan riwayat medis pasien dapat diakses.

**Aktor:** Dokter, Pasien, Staff Medis

**Flow Utama:**
1. Dokter memasuki halaman Examination
2. Pilih pasien dari antrian
3. Isi data pemeriksaan (keluhan, diagnosis, treatment)
4. Sistem menyimpan sebagai Medical Record
5. Pasien dapat melihat riwayat medis di Dashboard

**Artefak SAD:**
- **Frontend Page**: `frontend/src/pages/Examination.tsx`
- **Frontend Component**: `frontend/src/components/patient/MedicalRecordsCard.tsx`
- **Backend Route**: `backend/src/routes/medicalRecords.ts`
- **Data Interface**: `DataContext.tsx` - `MedicalRecord` interface
- **Context Methods**: `addMedicalRecord()`

**Data Model:**
```typescript
interface MedicalRecord {
    id: string;
    patientId: string;
    date: string;
    complaint: string;
    diagnosis: string;
    treatment: string;
    doctorName: string;
}
```

**Backend Endpoints:**
```
GET    /api/medical-records           - List semua record
POST   /api/medical-records           - Tambah record baru
GET    /api/medical-records/:id       - Ambil record spesifik
GET    /api/medical-records/patient/:id - Ambil record pasien
PUT    /api/medical-records/:id       - Update record
DELETE /api/medical-records/:id       - Hapus record
```

---

### UC-004: Manajemen Resep dan Pembayaran

**Deskripsi:** Dokter membuat resep, pasien melakukan pembayaran di apotek, tracking status pembayaran real-time.

**Aktor:** Dokter, Pasien, Pharmacist

**Flow Utama:**
1. Dokter membuat resep untuk pasien
2. Resep berstatus 'pending' (belum diproses)
3. Pharmacist proses resep → status 'processed'
4. Pasien melakukan pembayaran
5. Status resep → 'paid'
6. Pasien melihat real-time tracking pembayaran di Dashboard

**Artefak SAD:**
- **Frontend Page**: `frontend/src/pages/Pharmacy.tsx`
- **Frontend Component**: `frontend/src/components/patient/PrescriptionCard.tsx`
- **Frontend Component**: `frontend/src/components/patient/PrescriptionPaymentTracker.tsx`
- **Backend Route**: `backend/src/routes/prescriptions.ts`
- **Data Interface**: `DataContext.tsx` - `Prescription`, `PrescriptionItem` interfaces
- **Context Methods**: `addPrescription()`, `processPrescription()`, `payPrescription()`
- **Real-time Hook**: `frontend/src/hooks/usePaymentTracking.ts`

**Data Model:**
```typescript
interface PrescriptionItem {
    medicineId: string;
    medicineName: string;
    amount: number;
    instructions: string;
}

interface Prescription {
    id: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    date: string;
    items: PrescriptionItem[];
    status: 'pending' | 'processed' | 'paid';
    totalPrice: number;
}
```

**Backend Endpoints:**
```
GET    /api/prescriptions              - List resep
POST   /api/prescriptions              - Buat resep baru
GET    /api/prescriptions/:id          - Ambil resep spesifik
PUT    /api/prescriptions/:id/process  - Proses resep
PUT    /api/prescriptions/:id/pay      - Bayar resep
DELETE /api/prescriptions/:id          - Hapus resep
GET    /api/prescriptions/patient/:id  - Ambil resep pasien
```

**Real-time Payment Tracking:**
- `usePaymentTracking` hook melakukan polling status pembayaran
- Update UI setiap 3 detik
- Timeline visual: pending → processed → paid

---

### UC-005: Manajemen Stok Obat

**Deskripsi:** Apotek mengelola stok obat, sistem alert jika stok minimum terpenuhi.

**Aktor:** Pharmacist, Admin

**Flow Utama:**
1. Pharmacist buka halaman Pharmacy
2. Lihat daftar obat dan stok
3. Ketika resep diproses, stok otomatis berkurang
4. Jika stok < minStock, alert ditampilkan
5. Pharmacist dapat update stok manual

**Artefak SAD:**
- **Frontend Page**: `frontend/src/pages/Pharmacy.tsx`
- **Backend Route**: `backend/src/routes/medicines.ts`
- **Data Interface**: `DataContext.tsx` - `Medicine` interface
- **Context Methods**: `updateMedicineStock()`

**Data Model:**
```typescript
interface Medicine {
    id: string;
    name: string;
    stock: number;
    minStock: number;
    unit: string;
    price: number;
}
```

**Backend Endpoints:**
```
GET    /api/medicines          - List obat
POST   /api/medicines          - Tambah obat
GET    /api/medicines/:id      - Ambil obat spesifik
PUT    /api/medicines/:id      - Update obat
DELETE /api/medicines/:id      - Hapus obat
```

---

### UC-006: Manajemen Staff

**Deskripsi:** Admin dapat mengelola data staff (dokter, pharmacist, nurse, dll).

**Aktor:** Admin

**Flow Utama:**
1. Admin buka halaman Staff
2. Klik "Tambah Staff"
3. Isi data staff (nama, role, email, phone)
4. Set status active/inactive
5. Staff dapat diedit atau dihapus

**Artefak SAD:**
- **Frontend Page**: `frontend/src/pages/Staff.tsx`
- **Frontend Component**: `frontend/src/components/staff/StaffDialog.tsx`
- **Frontend Component**: `frontend/src/components/staff/StaffList.tsx`
- **Backend Route**: `backend/src/routes/staff.ts`
- **Data Interface**: `DataContext.tsx` - `Staff` interface
- **Context Methods**: `addStaff()`, `updateStaff()`, `deleteStaff()`, `updateStaffStatus()`

**Data Model:**
```typescript
interface Staff {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
}
```

**Backend Endpoints:**
```
GET    /api/staff              - List staff
POST   /api/staff              - Tambah staff
GET    /api/staff/:id          - Ambil staff spesifik
PUT    /api/staff/:id          - Update staff
DELETE /api/staff/:id          - Hapus staff
```

---

### UC-007: Authentikasi dan Otorisasi

**Deskripsi:** User dapat login dengan role berbeda (pasien, staff medis, pharmacist, admin).

**Aktor:** Semua User

**Flow Utama:**
1. User buka halaman Login
2. Masuk username (nama) dan password
3. Sistem validate credentials
4. Jika valid, generate auth context dengan role
5. User diarahkan ke Dashboard sesuai role
6. Setiap halaman di-protect dengan RoleGuard

**Artefak SAD:**
- **Frontend Page**: `frontend/src/pages/Login.tsx`
- **Frontend Page**: `frontend/src/pages/Register.tsx`
- **Frontend Context**: `frontend/src/contexts/AuthContext.tsx`
- **Frontend Guard**: `frontend/src/components/RoleGuard.tsx`
- **Frontend Hook**: `frontend/src/hooks/use-mobile.tsx`

**Auth Roles:**
```typescript
export const roles = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    PHARMACIST: 'pharmacist',
    STAFF: 'staff',
    ADMIN: 'admin'
};
```

**Protected Routes:**
- `/` - Dashboard (semua role)
- `/patients` - Admin, Staff (UC-001)
- `/queue` - Semua role (UC-002)
- `/examination` - Doctor (UC-003)
- `/pharmacy` - Pharmacist (UC-005)
- `/staff` - Admin (UC-006)
- `/reports` - Admin, Doctor
- `/settings` - Admin

---

## Entity-Relationship Diagram

### ERD - Sentosa Health Hub

```
┌─────────────────────┐
│      Patient        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ age                 │
│ gender              │
│ address             │
│ phone               │
│ lastVisit           │
└─────────────────────┘
         │ 1
         │
         │ has many (1:N)
         │
    ┌────┴────┐
    │          │
    │ N        │ N
    │          │
    ▼          ▼
┌─────────────────────┐    ┌──────────────────────┐
│    QueueItem        │    │   MedicalRecord      │
├─────────────────────┤    ├──────────────────────┤
│ id (PK)             │    │ id (PK)              │
│ patientId (FK)      │    │ patientId (FK)       │
│ patientName         │    │ date                 │
│ time                │    │ complaint            │
│ status              │    │ diagnosis            │
│ doctor              │    │ treatment            │
│ complaint           │    │ doctorName           │
└─────────────────────┘    └──────────────────────┘
                                   │ 1
                                   │
                                   │ has many (1:N)
                                   │
                                   ▼
                           ┌──────────────────────┐
                           │   Prescription       │
                           ├──────────────────────┤
                           │ id (PK)              │
                           │ patientId (FK)       │
                           │ patientName          │
                           │ doctorName           │
                           │ date                 │
                           │ items[] (FK-Medicine)│
                           │ status               │
                           │ totalPrice           │
                           └──────────────────────┘
                                   │ N
                                   │
                                   │ contains (N:N)
                                   │
                                   ▼
                           ┌──────────────────────┐
                           │      Medicine        │
                           ├──────────────────────┤
                           │ id (PK)              │
                           │ name                 │
                           │ stock                │
                           │ minStock             │
                           │ unit                 │
                           │ price                │
                           └──────────────────────┘

┌─────────────────────┐
│        Staff        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ role                │
│ email               │
│ phone               │
│ status              │
└─────────────────────┘
```

### Relasi Entities

| Entity | Relasi | Cardinality | Keterangan |
|--------|--------|-------------|-----------|
| Patient | has many | 1:N | 1 pasien punya banyak QueueItem |
| Patient | has many | 1:N | 1 pasien punya banyak MedicalRecord |
| Patient | has many | 1:N | 1 pasien punya banyak Prescription |
| MedicalRecord | referenced by | 1:N | 1 record berkaitan dengan 1 pasien |
| Prescription | contains | N:N | 1 resep mengandung banyak obat |
| Medicine | contained in | N:N | 1 obat bisa di banyak resep |
| Staff | independent | - | Staff adalah entity terpisah |

---

## Data Flow Diagram

### DFD Level 0 (Context Diagram)

```
                    ┌─────────────────┐
                    │  Sentosa Health │
                    │   Hub System    │
                    └─────────────────┘
                     /    |    |    \
          ┌──────────┘     │    │     └──────────┐
          │                │    │                │
          ▼                ▼    ▼                ▼
    ┌──────────┐    ┌──────────┐      ┌──────────────┐
    │ Patients │    │ Doctors  │      │  Pharmacists │
    │ (Users)  │    │ (Staff)  │      │  (Staff)     │
    └──────────┘    └──────────┘      └──────────────┘
          │                │                  │
          │                │                  │
          └────────────────┼──────────────────┘
                           │
                      Admin Staff
```

### DFD Level 1 (Main Processes)

```
┌──────────┐
│ Patient  │
│  (User)  │
└────┬─────┘
     │
     │ Login
     ▼
   [1.0] ─────────────── Auth Context
   Authentication         (username/role/password)
   │
   ├─────────────────────────────────┬────────────────────────┐
   │                                 │                        │
   ▼                                 ▼                        ▼
[2.0]                           [3.0]                    [4.0]
Queue Management                Examination              Prescription
  │                              │                        │
  ├─ Register queue              ├─ View queue             ├─ View prescriptions
  ├─ View queue status           ├─ Create examination     ├─ Request prescription
  ├─ Cancel queue                ├─ Create medical record  ├─ Pay prescription
  │                              │                        ├─ Track payment status
  ▼                              ▼                        ▼
DataContext                   DataContext             Pharmacy API
(Queue Store)                 (Medical Records)       (Medicine Stock)
   │                              │                        │
   └──────────────────────────────┴────────────────────────┘
                                │
                                ▼
                        Backend API Server
                        (/api/*)
                                │
                                ▼
                        Database Store
                        (Mock Data / Real DB)
```

### DFD Level 2 - Payment Flow (Prescription Payment)

```
┌─────────────┐
│   Patient   │
└─────┬───────┘
      │
      │ View Prescription
      ▼
  [4.1]
  Prescription │
  Retrieval    ├─→ GET /api/prescriptions/:patientId
               │
      ┌────────┘
      │
      ▼
  [4.2]
  Payment     ├─→ PUT /api/prescriptions/:id/pay
  Processing  │   (status: pending → processed → paid)
      │
      ├─→ usePaymentTracking Hook
      │   (Polling every 3 seconds)
      │
      ├─→ Update Medicine Stock
      │   (updateMedicineStock)
      │
      ▼
  [4.3]
  Real-time   ├─→ PrescriptionPaymentTracker
  Status        │   Component
  Display       ├─→ Timeline: pending → processed → paid
      │
      ▼
  Patient Dashboard
  (Updated Status)
```

### DFD Level 2 - Queue Flow

```
┌─────────────┐
│   Patient   │
└─────┬───────┘
      │
      │ Register Queue
      ▼
  [2.1]
  Queue      ├─→ addToQueue(patientId, doctorName, complaint)
  Registration
      │
      ├─→ POST /api/queue
      │   (Create: {id, patientId, time, status: 'waiting', ...})
      │
      ▼
  [2.2]
  Queue      ├─→ useRealTimeData Hook
  Monitoring  │   (Polling every 5 seconds)
      │
      ├─→ GET /api/queue/:patientId
      │
      ├─→ Update Status
      │   (waiting → in-progress → completed)
      │
      ▼
  [2.3]
  Status     ├─→ QueueStatusCard Component
  Display    │   Shows: Queue number, status, time
      │
      ▼
  Patient Dashboard
  (Real-time Queue Status)
```

---

## User Stories dan Mapping

### PATIENT STORIES

#### Story PS-001: Pasien Mendaftar Antrian
```
AS A pasien
I WANT TO mendaftar antrian pemeriksaan
SO THAT saya dapat diperiksa oleh dokter

ACCEPTANCE CRITERIA:
✓ Pasien dapat membuka form "Daftar Antrian" di Dashboard
✓ Dapat memilih dokter dan menginput keluhan
✓ Data tersimpan di sistem antrian
✓ Menerima konfirmasi nomor antrian
✓ Dapat membatalkan antrian jika perlu

MAPPING KE ARTEFAK SAD:
- Component: PrescriptionCard.tsx (line 88-102)
- Hook: useRealTimeData.ts (polling antrian)
- API: POST /api/queue
- Context: addToQueue() method
- ERD: QueueItem entity
- DFD: [2.1] Queue Registration + [2.2] Queue Monitoring
```

#### Story PS-002: Pasien Melihat Riwayat Medis
```
AS A pasien
I WANT TO melihat riwayat pemeriksaan saya
SO THAT saya tahu diagnosis dan treatment yang pernah dilakukan

ACCEPTANCE CRITERIA:
✓ Riwayat medis ditampilkan di Dashboard
✓ Menampilkan tanggal, keluhan, diagnosis, treatment
✓ Data ter-update real-time setelah pemeriksaan dokter
✓ Dapat diunduh atau dicetak

MAPPING KE ARTEFAK SAD:
- Component: MedicalRecordsCard.tsx
- API: GET /api/medical-records/:patientId
- Context: medicalRecords state
- ERD: MedicalRecord entity
- UC: UC-003 (Pemeriksaan dan Riwayat Medis)
```

#### Story PS-003: Pasien Membayar Resep dan Tracking Real-Time
```
AS A pasien
I WANT TO membayar resep di apotek dan melacak status pembayaran
SO THAT saya tahu kapan obat siap diambil

ACCEPTANCE CRITERIA:
✓ Dapat melihat list resep yang pending pembayaran
✓ Dapat melakukan pembayaran
✓ Status pembayaran ter-update real-time (pending → processed → paid)
✓ Timeline visual menunjukkan progress pembayaran
✓ Notifikasi ketika pembayaran selesai

MAPPING KE ARTEFAK SAD:
- Component: PrescriptionPaymentTracker.tsx
- Hook: usePaymentTracking.ts (polling setiap 3 detik)
- API: 
  - GET /api/prescriptions/:patientId
  - PUT /api/prescriptions/:id/pay
- Context: payPrescription() method
- ERD: Prescription, PrescriptionItem entities
- DFD: [4.1] Prescription Retrieval → [4.2] Payment Processing → [4.3] Real-time Status
- UC: UC-004 (Manajemen Resep dan Pembayaran)
```

#### Story PS-004: Pasien Update Data Pribadi
```
AS A pasien
I WANT TO mengupdate data pribadi saya
SO THAT informasi medis saya selalu akurat

ACCEPTANCE CRITERIA:
✓ Dapat mengakses halaman Settings
✓ Dapat update nama, alamat, telepon
✓ Perubahan tersimpan dan ter-reflect di sistem

MAPPING KE ARTEFAK SAD:
- Component: Settings.tsx page
- Context: updatePatient() method
- API: PUT /api/patients/:id
- ERD: Patient entity
```

---

### DOCTOR STORIES

#### Story DS-001: Dokter Melihat Antrian Pasien
```
AS A dokter
I WANT TO melihat antrian pasien saya
SO THAT saya tahu pasien mana yang akan diperiksa

ACCEPTANCE CRITERIA:
✓ Halaman Queue menampilkan pasien dengan status 'waiting'
✓ Dapat filter antrian berdasarkan waktu dan dokter
✓ Update otomatis setiap 5 detik
✓ Dapat perubah status antrian (waiting → in-progress → completed)

MAPPING KE ARTEFAK SAD:
- Component: Queue.tsx page
- Hook: useRealTimeData.ts
- API: 
  - GET /api/queue
  - PUT /api/queue/:id (update status)
- Context: updateQueueStatus() method
- ERD: QueueItem entity
- DFD: [2.2] Queue Monitoring
- UC: UC-002 (Manajemen Antrian)
```

#### Story DS-002: Dokter Membuat Catatan Pemeriksaan
```
AS A dokter
I WANT TO membuat catatan hasil pemeriksaan pasien
SO THAT data medis pasien terdokumentasi dengan baik

ACCEPTANCE CRITERIA:
✓ Dapat membuka form pemeriksaan untuk pasien dalam antrian
✓ Input keluhan, diagnosis, treatment
✓ Data tersimpan sebagai medical record
✓ Dapat dilihat oleh pasien dan dokter lain

MAPPING KE ARTEFAK SAD:
- Component: Examination.tsx page
- API: POST /api/medical-records
- Context: addMedicalRecord() method
- ERD: MedicalRecord, Patient entities
- UC: UC-003 (Pemeriksaan dan Riwayat Medis)
```

#### Story DS-003: Dokter Membuat Resep
```
AS A dokter
I WANT TO membuat resep untuk pasien
SO THAT pasien dapat membeli obat yang diperlukan

ACCEPTANCE CRITERIA:
✓ Dapat membuka form pembuatan resep
✓ Pilih obat dari daftar apotek
✓ Input jumlah dan instruksi penggunaan
✓ Resep tersimpan dengan status 'pending'
✓ Pasien dapat melihat resep mereka

MAPPING KE ARTEFAK SAD:
- Component: Pharmacy.tsx page (untuk input resep)
- API: POST /api/prescriptions
- Context: addPrescription() method
- ERD: Prescription, PrescriptionItem, Medicine entities
- UC: UC-004 (Manajemen Resep)
```

---

### PHARMACIST STORIES

#### Story PH-001: Pharmacist Melihat Resep Pending
```
AS A pharmacist/apotek staff
I WANT TO melihat resep yang pending diproses
SO THAT saya dapat menyiapkan obat untuk pasien

ACCEPTANCE CRITERIA:
✓ Halaman Pharmacy menampilkan resep dengan status 'pending'
✓ Dapat filter berdasarkan tanggal atau pasien
✓ Dapat mark resep sebagai 'processed'
✓ Stok obat otomatis berkurang setelah proses

MAPPING KE ARTEFAK SAD:
- Component: Pharmacy.tsx page
- API: 
  - GET /api/prescriptions
  - PUT /api/prescriptions/:id/process
  - PUT /api/medicines/:id
- Context: processPrescription(), updateMedicineStock()
- ERD: Prescription, Medicine entities
- UC: UC-004, UC-005 (Resep dan Stok Obat)
```

#### Story PH-002: Pharmacist Manage Stok Obat
```
AS A pharmacist
I WANT TO manage stok obat di apotek
SO THAT stok selalu terkontrol dan tidak kehabisan

ACCEPTANCE CRITERIA:
✓ Dapat melihat daftar obat dan stok saat ini
✓ Alert ketika stok di bawah minimum
✓ Dapat update stok secara manual
✓ Dapat tambah obat baru

MAPPING KE ARTEFAK SAD:
- Component: Pharmacy.tsx page
- API: 
  - GET /api/medicines
  - PUT /api/medicines/:id
  - POST /api/medicines
- Context: updateMedicineStock() method
- ERD: Medicine entity
- UC: UC-005 (Manajemen Stok Obat)
```

---

### ADMIN STORIES

#### Story AD-001: Admin Manage Data Pasien
```
AS AN admin
I WANT TO manage data pasien (tambah, edit, hapus)
SO THAT database pasien selalu ter-update

ACCEPTANCE CRITERIA:
✓ Akses penuh ke halaman Patients
✓ Dapat tambah pasien baru via form
✓ Dapat edit data pasien
✓ Dapat hapus pasien
✓ Data ter-update di semua halaman

MAPPING KE ARTEFAK SAD:
- Component: Patients.tsx page
- Component: PatientDialog.tsx
- Component: PatientTable.tsx
- API:
  - GET /api/patients
  - POST /api/patients
  - PUT /api/patients/:id
  - DELETE /api/patients/:id
- Context: addPatient(), updatePatient(), deletePatient()
- ERD: Patient entity
- UC: UC-001 (Manajemen Data Pasien)
```

#### Story AD-002: Admin Manage Staff
```
AS AN admin
I WANT TO manage data staff (dokter, pharmacist, nurse)
SO THAT roster staff selalu akurat

ACCEPTANCE CRITERIA:
✓ Akses penuh ke halaman Staff
✓ Dapat tambah staff baru
✓ Dapat edit data staff
✓ Dapat set status active/inactive
✓ Dapat hapus staff

MAPPING KE ARTEFAK SAD:
- Component: Staff.tsx page
- Component: StaffDialog.tsx
- Component: StaffList.tsx
- API:
  - GET /api/staff
  - POST /api/staff
  - PUT /api/staff/:id
  - DELETE /api/staff/:id
- Context: addStaff(), updateStaff(), deleteStaff(), updateStaffStatus()
- ERD: Staff entity
- UC: UC-006 (Manajemen Staff)
```

#### Story AD-003: Admin Lihat Reports dan Analytics
```
AS AN admin
I WANT TO lihat laporan dan analytics sistem
SO THAT saya bisa monitor performa klinik

ACCEPTANCE CRITERIA:
✓ Dapat melihat statistik pasien, antrian, resep
✓ Dashboard summary dengan KPI utama
✓ Dapat export laporan

MAPPING KE ARTEFAK SAD:
- Component: Reports.tsx page
- Component: Dashboard.tsx (summary page)
- API: Various GET endpoints untuk aggregate data
```

---

## Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │          React Application (Vite)                   │   │
│  │  ├─ Pages (Dashboard, Queue, Pharmacy, etc.)       │   │
│  │  ├─ Components (UI, Cards, Dialogs)               │   │
│  │  ├─ Contexts (Auth, Data)                         │   │
│  │  ├─ Hooks (useRealTimeData, usePaymentTracking)   │   │
│  │  ├─ Services (patientService, staffService)       │   │
│  │  └─ API Client (client.ts - axios wrapper)        │   │
│  └────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         │ HTTP/REST                        │
│                         ▼                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Express.js)                    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                  │   │
│  │  ├─ CORS handling                                  │   │
│  │  ├─ JSON parsing                                  │   │
│  │  └─ Error handling                                │   │
│  └────────────────────────────────────────────────────┘   │
│                         │                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Route Handlers                                    │   │
│  │  ├─ /api/patients                                  │   │
│  │  ├─ /api/queue                                     │   │
│  │  ├─ /api/medical-records                          │   │
│  │  ├─ /api/prescriptions                            │   │
│  │  ├─ /api/medicines                                │   │
│  │  └─ /api/staff                                     │   │
│  └────────────────────────────────────────────────────┘   │
│                         │                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                 │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Current: Mock Data (mockData.ts)                  │   │
│  │  ├─ In-memory storage                             │   │
│  │  ├─ Test & development ready                      │   │
│  │  └─ Easy to replace with real DB                  │   │
│  │                                                    │   │
│  │  Future: PostgreSQL / MongoDB                     │   │
│  │  ├─ ORM: Sequelize / Mongoose                     │   │
│  │  └─ Connection pooling                            │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend Structure:
frontend/src/
├── api/
│   └── client.ts ─────────── Axios wrapper untuk API calls
├── components/
│   ├── AppLayout.tsx ─────── Main layout wrapper
│   ├── NavLink.tsx ────────── Navigation component
│   ├── RoleGuard.tsx ─────── Route protection component
│   ├── patient/
│   │   ├── QueueStatusCard.tsx ─── Display queue status
│   │   ├── MedicalRecordsCard.tsx ─ Display medical records
│   │   ├── PrescriptionCard.tsx ─── Display prescriptions
│   │   └── PrescriptionPaymentTracker.tsx ─ Payment tracking UI
│   ├── patients/
│   │   ├── PatientDialog.tsx ────── Form untuk CRUD patient
│   │   └── PatientTable.tsx ─────── Table display patients
│   ├── staff/
│   │   ├── StaffDialog.tsx ─────── Form untuk CRUD staff
│   │   └── StaffList.tsx ──────── List display staff
│   └── ui/ ────────────────────── Shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx ────────── User authentication & roles
│   └── DataContext.tsx ────────── Global data management
├── hooks/
│   ├── useRealTimeData.ts ────── Polling hook untuk real-time data
│   ├── usePaymentTracking.ts ─── Polling hook untuk payment status
│   ├── use-mobile.tsx ────────── Mobile detection hook
│   └── use-toast.ts ──────────── Toast notification hook
├── lib/
│   └── utils.ts ───────────────── Utility functions
├── pages/
│   ├── Dashboard.tsx ─────── Main dashboard (semua role)
│   ├── Queue.tsx ───────── Queue management page
│   ├── Pharmacy.tsx ────── Medicine & prescription page
│   ├── Examination.tsx ─── Medical examination page
│   ├── Patients.tsx ────── Patient management page
│   ├── Staff.tsx ──────── Staff management page
│   ├── Reports.tsx ────── Analytics & reports page
│   ├── Settings.tsx ───── User settings page
│   ├── Login.tsx ──────── Authentication page
│   ├── Register.tsx ───── Registration page
│   ├── PatientDetail.tsx ─ Patient detail page
│   ├── Index.tsx ──────── Homepage
│   └── NotFound.tsx ───── 404 error page
├── services/
│   ├── patientService.ts ────── Patient API service
│   └── staffService.ts ─────── Staff API service
└── [config files] ────────────── vite, tailwind, tsconfig

Backend Structure:
backend/src/
├── server.ts ──────────────── Main Express app
├── routes/
│   ├── patients.ts ───────── Patient CRUD endpoints
│   ├── queue.ts ──────────── Queue management endpoints
│   ├── medicines.ts ──────── Medicine management endpoints
│   ├── prescriptions.ts ──── Prescription endpoints
│   ├── medicalRecords.ts ─── Medical record endpoints
│   └── staff.ts ──────────── Staff management endpoints
└── data/
    └── mockData.ts ──────── Mock database
```

---

## Komponen dan Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-router-dom": "^6.x - Routing",
    "axios": "^1.x - HTTP client",
    "sonner": "^1.x - Toast notifications",
    "lucide-react": "^0.x - Icons",
    "@radix-ui": "^1.x - Headless UI components",
    "class-variance-authority": "^0.x - CSS utilities",
    "clsx": "^2.x - Conditional className",
    "tailwind-css": "^3.x - Styling"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.x - Web framework",
    "cors": "^2.x - CORS middleware",
    "uuid": "^9.x - ID generation"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "ts-node": "^10.x"
  }
}
```

### Real-Time Features Implementation

#### 1. Queue Polling - `useRealTimeData.ts`
```typescript
// Polling setiap 5 detik untuk update antrian
const pollInterval = 5000;
const timer = setInterval(async () => {
  const data = await queueAPI.getByPatient(patientId);
  setQueue(data);
}, pollInterval);
```

#### 2. Payment Tracking - `usePaymentTracking.ts`
```typescript
// Polling setiap 3 detik untuk status pembayaran
const pollInterval = 3000;
const timer = setInterval(async () => {
  const prescription = await prescriptionsAPI.getById(prescriptionId);
  setPrescription(prescription);
  // Update timeline status
}, pollInterval);
```

#### 3. Real-Time Components
- **QueueStatusCard**: Menampilkan status antrian dengan auto-refresh
- **PrescriptionPaymentTracker**: Timeline pembayaran dengan visual progress
- **MedicalRecordsCard**: Display medical history yang ter-update

---

## Mapping Summary Table

| Use Case | Komponen Frontend | Backend Route | Data Model | Page | Hook |
|----------|------------------|---------------|-----------|------|------|
| UC-001 | PatientDialog, PatientTable | `/api/patients` | Patient | Patients.tsx | - |
| UC-002 | QueueDialog, QueueStatusCard | `/api/queue` | QueueItem | Queue.tsx | useRealTimeData |
| UC-003 | MedicalRecordsCard, Examination | `/api/medical-records` | MedicalRecord | Examination.tsx | - |
| UC-004 | PrescriptionCard, PaymentTracker | `/api/prescriptions` | Prescription | Pharmacy.tsx | usePaymentTracking |
| UC-005 | Pharmacy page | `/api/medicines` | Medicine | Pharmacy.tsx | - |
| UC-006 | StaffDialog, StaffList | `/api/staff` | Staff | Staff.tsx | - |
| UC-007 | Login, Register, RoleGuard | Auth context | User | Login.tsx | - |

---

## Development Roadmap

### Phase 1: ✅ Foundation (Current)
- [x] Basic CRUD untuk semua entities
- [x] Authentication & role-based access
- [x] Mock data storage
- [x] UI Components dengan Shadcn/ui
- [x] Real-time polling untuk queue

### Phase 2: 🔄 Enhancement (Next)
- [ ] Real-time payment tracking dengan visual timeline
- [ ] WebSocket untuk true real-time (alternative to polling)
- [ ] Database integration (PostgreSQL / MongoDB)
- [ ] User profile & settings management
- [ ] Notification system

### Phase 3: 📈 Advanced
- [ ] Analytics & reporting dashboard
- [ ] Export data (PDF, Excel)
- [ ] Document management (medical records)
- [ ] SMS/Email notifications
- [ ] Mobile app (React Native)
- [ ] API authentication (JWT)

---

## Deployment & Environment

### Environment Variables
```
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001/api

# Backend (.env)
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:8080
```

### Build & Run
```bash
# Install dependencies
npm run install:all

# Development (both services)
npm run dev

# Production build
npm run build

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

---

## Kesimpulan

Dokumen SAD Traceability ini memetakan:
- **7 Use Cases** utama sistem
- **Hubungan 1:N & N:N** antara entities
- **Data Flow** untuk setiap proses utama
- **9 User Stories** dengan mapping ke artefak
- **Arsitektur sistem** yang jelas dan terstruktur
- **Komponen dependencies** yang detail

Sistem Sentosa Health Hub dirancang dengan modular architecture yang memudahkan maintenance, testing, dan future expansion. Real-time features diimplementasikan dengan polling mechanism yang siap untuk diupgrade ke WebSocket ketika diperlukan.

