# SAD Traceability Quick Reference Guide

## 📋 File Locations

```
📁 SENTOSA HEALTH HUB
│
├── 📄 ARCHITECTURE_TRACEABILITY.md ⭐ MAIN DOCUMENT
│   └── Pemetaan lengkap Use Cases, ERD, DFD, User Stories
│
├── 📄 IMPLEMENTATION_TRACEABILITY.md ⭐ IMPLEMENTATION GUIDE  
│   └── Code-level mapping & testing procedures
│
├── 📁 frontend/src/
│   ├── 📁 pages/
│   │   ├── Dashboard.tsx ────────── Main dashboard (all roles)
│   │   ├── Queue.tsx ───────────── Queue management
│   │   ├── Pharmacy.tsx ────────── Prescription & medicine
│   │   ├── Examination.tsx ─────── Medical records
│   │   ├── Patients.tsx ────────── Patient management
│   │   ├── Staff.tsx ──────────── Staff management
│   │   ├── Login.tsx & Register.tsx ─ Authentication
│   │   └── Reports.tsx, Settings.tsx, etc.
│   │
│   ├── 📁 components/
│   │   ├── patient/
│   │   │   ├── QueueStatusCard.tsx ────────── Real-time queue display
│   │   │   ├── MedicalRecordsCard.tsx ────── Medical history
│   │   │   ├── PrescriptionCard.tsx ─────── Prescription list
│   │   │   └── PrescriptionPaymentTracker.tsx ⭐ REAL-TIME PAYMENT TRACKING
│   │   ├── patients/
│   │   │   ├── PatientDialog.tsx ────────── Patient form
│   │   │   └── PatientTable.tsx ────────── Patient list
│   │   ├── staff/
│   │   │   ├── StaffDialog.tsx ─────────── Staff form
│   │   │   └── StaffList.tsx ──────────── Staff list
│   │   ├── RoleGuard.tsx ───────────────── Route protection
│   │   └── AppLayout.tsx ──────────────── Main layout
│   │
│   ├── 📁 contexts/
│   │   ├── AuthContext.tsx ────── Authentication & roles
│   │   └── DataContext.tsx ────── Global data management
│   │
│   ├── 📁 hooks/
│   │   ├── useRealTimeData.ts ──────── ⭐ Queue polling (5s)
│   │   └── usePaymentTracking.ts ───── ⭐ Payment polling (3s)
│   │
│   └── 📁 api/
│       └── client.ts ──────────────── API wrapper
│
├── 📁 backend/src/
│   ├── server.ts ────────────────── Express app
│   ├── 📁 routes/
│   │   ├── patients.ts ────────── Patient CRUD
│   │   ├── queue.ts ──────────── Queue management
│   │   ├── prescriptions.ts ───── Prescription + payment
│   │   ├── medicalRecords.ts ─── Medical records
│   │   ├── medicines.ts ──────── Medicine management
│   │   └── staff.ts ──────────── Staff management
│   │
│   └── 📁 data/
│       └── mockData.ts ────────── Sample data storage
│
└── 📁 docs/
    ├── ARCHITECTURE_TRACEABILITY.md
    └── IMPLEMENTATION_TRACEABILITY.md
```

---

## 🎯 Quick Use Case Finder

| Use Case | Frontend Page | Component | Backend Route | Hook | ERD Entity |
|----------|---------------|-----------|---------------|------|-----------|
| **UC-001: Patient Mgmt** | `Patients.tsx` | `PatientDialog` | `/api/patients` | - | `Patient` |
| **UC-002: Queue Mgmt** | `Queue.tsx` | `QueueStatusCard` | `/api/queue` | ⭐`useRealTimeData` | `QueueItem` |
| **UC-003: Medical Records** | `Examination.tsx` | `MedicalRecordsCard` | `/api/medical-records` | - | `MedicalRecord` |
| **UC-004: Prescription & Payment** ⭐ | `Pharmacy.tsx` | `PrescriptionPaymentTracker` | `/api/prescriptions` | ⭐`usePaymentTracking` | `Prescription` |
| **UC-005: Medicine Stock** | `Pharmacy.tsx` | - | `/api/medicines` | - | `Medicine` |
| **UC-006: Staff Mgmt** | `Staff.tsx` | `StaffDialog` | `/api/staff` | - | `Staff` |
| **UC-007: Auth** | `Login.tsx` | `RoleGuard` | Auth context | - | User roles |

---

## 🔄 Real-Time Features

### ⭐ Queue Status Tracking (UC-002)
**File:** `frontend/src/hooks/useRealTimeData.ts`
```
Polling Interval: 5 seconds
API Call: GET /api/queue/patient/:patientId
Display: QueueStatusCard.tsx
Update Trigger: Auto-refresh every 5s
```

### ⭐ Payment Status Tracking (UC-004)
**File:** `frontend/src/hooks/usePaymentTracking.ts`
```
Polling Interval: 3 seconds
API Call: GET /api/prescriptions/:id
Display: PrescriptionPaymentTracker.tsx
Timeline: pending → processed → paid
```

---

## 📊 Data Model Relationships

```
Patient (1) ──────┬───── (many) QueueItem
            │
            ├────── (many) MedicalRecord
            │
            └────── (many) Prescription ──────┬──── (many) Medicine
                                              └── (N:N via PrescriptionItem)

Staff (Independent)
```

---

## 🔐 Authentication & Roles

**Location:** `frontend/src/contexts/AuthContext.tsx`

```typescript
roles = {
  'patient',      // Pasien - akses Dashboard, view queue/medical records
  'doctor',       // Dokter - akses Queue, Examination, create prescriptions
  'pharmacist',   // Apoteker - akses Pharmacy, manage prescriptions & stock
  'staff',        // Staff - akses management pages
  'admin'         // Admin - akses penuh ke semua fitur
}
```

**Protected Pages (RoleGuard.tsx):**
- `/patients` → admin, staff
- `/queue` → all roles
- `/examination` → doctor
- `/pharmacy` → pharmacist
- `/staff` → admin
- `/reports` → admin, doctor

---

## 🚀 Development Workflow

### 1. Adding New Feature to Existing Use Case

**Example: Add phone notification untuk queue**

```
1. Update QueueItem interface (DataContext.tsx)
   └─ Add: notificationPhoneSent?: boolean

2. Update backend route (backend/src/routes/queue.ts)
   └─ Add logic to send SMS

3. Update API client (frontend/src/api/client.ts)
   └─ Add method to trigger SMS

4. Update component (QueueStatusCard.tsx)
   └─ Add button to send notification

5. Test endpoint:
   curl -X POST http://localhost:3001/api/queue/1/notify-sms
```

### 2. Adding New Use Case (Example: UC-008 Patient Appointment Booking)

```
1. Create Data Model (DataContext.tsx)
   └─ Add: Appointment interface

2. Create Frontend Page (frontend/src/pages/Appointments.tsx)
   └─ Display & manage appointments

3. Create Component (frontend/src/components/AppointmentDialog.tsx)
   └─ Form untuk book appointment

4. Create Backend Routes (backend/src/routes/appointments.ts)
   └─ POST, GET, PUT, DELETE endpoints

5. Add API Client Methods (frontend/src/api/client.ts)
   └─ appointmentAPI wrapper

6. Add Navigation Link (AppLayout.tsx)
   └─ Link ke halaman Appointments

7. Add Role Guard if needed (RoleGuard.tsx)
   └─ Restrict access ke certain roles

8. Update Documentation
   └─ Add UC-008 ke ARCHITECTURE_TRACEABILITY.md
```

---

## 🧪 Testing Checklist

### UC-001: Patient Management ✅
```
[ ] Add new patient
[ ] View patient list
[ ] Edit patient data
[ ] Delete patient
[ ] Verify data persisted in mock store
```

### UC-002: Queue Management ✅ (with Real-Time)
```
[ ] Register queue
[ ] View queue status
[ ] Check real-time update (5s polling)
[ ] Update queue status
[ ] Verify QueueStatusCard auto-refreshes
```

### UC-003: Medical Records ✅
```
[ ] Doctor create medical record
[ ] Patient view medical records
[ ] Verify record linked to patient
[ ] Check date & doctor info
```

### UC-004: Prescription & Payment ⭐ (with Real-Time)
```
[ ] Doctor create prescription
[ ] View prescription list
[ ] Pharmacist process prescription
[ ] Patient make payment
[ ] Check real-time payment status update (3s polling)
[ ] Verify timeline: pending → processed → paid
[ ] Medicine stock auto-reduced
```

### UC-005: Medicine Stock ✅
```
[ ] View medicine list
[ ] Check stock levels
[ ] Verify low-stock alert
[ ] Process prescription → stock reduced
```

### UC-006: Staff Management ✅
```
[ ] Add staff member
[ ] Edit staff info
[ ] Set active/inactive status
[ ] Delete staff
```

### UC-007: Authentication ✅
```
[ ] Login dengan different roles
[ ] Verify role-based page access
[ ] Logout functionality
[ ] Protected routes with RoleGuard
```

---

## 📈 Metrics & KPIs

| Metrik | Target | Location |
|--------|--------|----------|
| Queue polling response | < 100ms | useRealTimeData.ts |
| Payment polling response | < 100ms | usePaymentTracking.ts |
| Dashboard load time | < 2s | Dashboard.tsx |
| API response time | < 500ms | backend routes |
| Real-time update delay | < 3s | hooks |

---

## 🔧 API Endpoints Summary

```
PATIENTS
  GET    /api/patients              List all
  POST   /api/patients              Create
  GET    /api/patients/:id          Get one
  PUT    /api/patients/:id          Update
  DELETE /api/patients/:id          Delete

QUEUE
  GET    /api/queue                 List all
  POST   /api/queue                 Create
  GET    /api/queue/:id             Get one
  PUT    /api/queue/:id             Update status
  DELETE /api/queue/:id             Cancel
  GET    /api/queue/patient/:id     Patient's queue

MEDICAL RECORDS
  GET    /api/medical-records       List all
  POST   /api/medical-records       Create
  GET    /api/medical-records/:id   Get one
  PUT    /api/medical-records/:id   Update
  DELETE /api/medical-records/:id   Delete
  GET    /api/medical-records/patient/:id  Patient's records

PRESCRIPTIONS ⭐
  GET    /api/prescriptions         List all
  POST   /api/prescriptions         Create
  GET    /api/prescriptions/:id     Get one
  PUT    /api/prescriptions/:id     Update
  DELETE /api/prescriptions/:id     Delete
  PUT    /api/prescriptions/:id/process  Process (pharmacist)
  PUT    /api/prescriptions/:id/pay      Pay (patient)
  GET    /api/prescriptions/patient/:id  Patient's prescriptions

MEDICINES
  GET    /api/medicines             List all
  POST   /api/medicines             Create
  GET    /api/medicines/:id         Get one
  PUT    /api/medicines/:id         Update stock
  DELETE /api/medicines/:id         Delete

STAFF
  GET    /api/staff                 List all
  POST   /api/staff                 Create
  GET    /api/staff/:id             Get one
  PUT    /api/staff/:id             Update
  DELETE /api/staff/:id             Delete
```

---

## 🎓 Learning Path for New Developers

### Week 1: Foundation
- [ ] Read ARCHITECTURE_TRACEABILITY.md (SAD structure)
- [ ] Understand ERD relationships
- [ ] Study UC-001 & UC-002 (basic CRUD & real-time)
- [ ] Review AuthContext & RoleGuard

### Week 2: Component Development
- [ ] Review component structure
- [ ] Study UC-003 (Medical Records)
- [ ] Create simple component (e.g., new patient field)
- [ ] Test with mock data

### Week 3: Real-Time Features
- [ ] Study useRealTimeData hook (UC-002)
- [ ] Study usePaymentTracking hook (UC-004)
- [ ] Understand polling mechanism
- [ ] Implement new real-time feature

### Week 4: Backend Integration
- [ ] Review backend routes
- [ ] Create new API endpoint
- [ ] Implement CRUD in backend
- [ ] Test with curl commands

### Week 5: Advanced
- [ ] Database integration planning
- [ ] WebSocket implementation (optional)
- [ ] Performance optimization
- [ ] Deployment strategy

---

## 📞 Support & Documentation

**For Questions About:**
- Use Cases → See ARCHITECTURE_TRACEABILITY.md (Use Cases section)
- Code Implementation → See IMPLEMENTATION_TRACEABILITY.md
- Component Structure → See file listings above
- API Endpoints → See API Endpoints Summary section
- Real-Time Features → See real-time features section
- Authentication → See RoleGuard in frontend/src/components/

---

## ✅ Checklist for SAD Compliance

- [x] Use Cases defined & mapped to code
- [x] ERD with clear relationships
- [x] DFD showing data flows
- [x] User Stories with acceptance criteria
- [x] Component architecture documented
- [x] API endpoints documented
- [x] Authentication & authorization defined
- [x] Real-time features implemented & documented
- [x] Mock data ready for testing
- [x] Development workflow established

**Status:** ✅ READY FOR DEVELOPMENT & DEPLOYMENT

