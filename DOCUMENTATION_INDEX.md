# Sentosa Health Hub - Dokumentasi SAD (Software Architecture Document)

## 📚 Daftar Dokumentasi

### 1. **SAD_QUICK_REFERENCE.md** ⭐ MULAI DARI SINI
**Tujuan:** Quick navigation guide untuk semua developer  
**Isi:**
- File structure overview
- Quick use case finder
- Real-time features explanation
- Testing checklist
- API endpoints summary
- Learning path untuk developer baru

**Waktu baca:** 10-15 menit  
**Untuk siapa:** Semua developer, project manager

---

### 2. **ARCHITECTURE_TRACEABILITY.md** 🏗️ MAIN TECHNICAL DOCUMENT
**Tujuan:** Pemetaan komprehensif antara artefak SAD dan implementasi  
**Isi:**
- 7 Use Cases lengkap dengan flow, components, dan endpoints
- Entity-Relationship Diagram (ERD) dengan relasi
- Data Flow Diagram (DFD) Level 0, 1, dan 2
- 9 User Stories dengan acceptance criteria
- Arsitektur sistem (high-level & component architecture)
- Komponen dependencies

**Waktu baca:** 1-2 jam  
**Untuk siapa:** Architect, senior developer, code reviewer

---

### 3. **IMPLEMENTATION_TRACEABILITY.md** 💻 CODE MAPPING GUIDE
**Tujuan:** Pemetaan file code ke artefak SAD  
**Isi:**
- USE CASE → CODE ARTIFACTS (detail file & line numbers)
- ERD → CODE MAPPING (Entity definitions & CRUD operations)
- USER STORY → COMPONENT MAPPING (Flow implementasi)
- DFD → CODE FLOW (Actual code examples)
- Traceability Matrix (completeness checklist)
- API Testing Commands (curl examples)
- Frontend Testing Scenarios

**Waktu baca:** 1 jam  
**Untuk siapa:** Developer, QA engineer, DevOps

---

## 🎯 Cara Menggunakan Dokumentasi

### Saya adalah... Developer Baru
```
1. Baca SAD_QUICK_REFERENCE.md (Learning Path section)
2. Pelajari file structure & use cases
3. Coba testing checklist UC-001 (Patient Management)
4. Baca ARCHITECTURE_TRACEABILITY.md (UC-001 & UC-002 section)
5. Lihat code implementation di IMPLEMENTATION_TRACEABILITY.md
6. Clone repo & jalankan `npm run dev`
```

### Saya adalah... Experienced Developer
```
1. Baca ARCHITECTURE_TRACEABILITY.md (full read)
2. Reference IMPLEMENTATION_TRACEABILITY.md saat coding
3. Gunakan SAD_QUICK_REFERENCE.md sebagai quick lookup
4. Ikuti development workflow untuk menambah feature baru
```

### Saya adalah... Project Manager / Stakeholder
```
1. Baca SAD_QUICK_REFERENCE.md (Overview section)
2. Pahami use cases & user stories
3. Review testing checklist untuk project status
4. Lihat metrics & KPIs
```

### Saya ingin... Menambah Use Case Baru
```
1. Baca section "Saya ingin... Menambah Feature" di SAD_QUICK_REFERENCE.md
2. Ikuti step-by-step guide untuk Add New Use Case
3. Update ARCHITECTURE_TRACEABILITY.md dengan UC baru
4. Update IMPLEMENTATION_TRACEABILITY.md dengan code mapping
5. Create pull request dengan referensi dokumentasi
```

### Saya ingin... Debug atau Troubleshoot
```
1. Lihat API Endpoints Summary di SAD_QUICK_REFERENCE.md
2. Cari testing commands di IMPLEMENTATION_TRACEABILITY.md
3. Run curl command untuk test endpoint
4. Cross-reference dengan code di IMPLEMENTATION_TRACEABILITY.md
5. Check component flow di DFD sections
```

---

## 📊 Documentation Map

```
SAD (System Design Phase)
├── Use Cases (7 UC)
├── ERD (Entities & Relationships)
├── DFD (Data Flows)
└── User Stories (9 stories)
        │
        ▼
ARCHITECTURE_TRACEABILITY.md ✅
├── UC-001 → Components → Backend Routes → Data Models
├── UC-002 (with real-time polling)
├── UC-003 → UC-007
├── ERD Diagram & Relationships
├── DFD Level 0, 1, 2
└── User Stories with mapping
        │
        ▼
IMPLEMENTATION_TRACEABILITY.md ✅
├── File → Line Number Mapping
├── Code Examples
├── Testing Procedures
└── API Endpoints
        │
        ▼
SAD_QUICK_REFERENCE.md ✅
└── Quick Lookups & Navigation
```

---

## 🔍 Finding Things

### "Saya ingin tahu tentang UC-004 (Prescription Payment)"
```
SAD_QUICK_REFERENCE.md
└─ Table: Use Case Finder → UC-004 row
   └─ Ke ARCHITECTURE_TRACEABILITY.md
      └─ Section: UC-004 → Read full flow
      └─ Section: Real-Time Features → Payment Tracking
      └─ Ke IMPLEMENTATION_TRACEABILITY.md
         └─ Section: UC-004 Mapping
         └─ Section: Payment Flow Implementation
```

### "Saya ingin lihat file untuk Patient Management"
```
SAD_QUICK_REFERENCE.md
└─ Section: File Locations → frontend/src/pages/Patients.tsx
   └─ IMPLEMENTATION_TRACEABILITY.md
      └─ Section: UC-001 → List file paths & line numbers
```

### "Saya ingin buat component baru untuk UC-002"
```
ARCHITECTURE_TRACEABILITY.md
└─ UC-002: Manajemen Antrian Pasien
   └─ Lihat existing components
   └─ Lihat data flow
   └─ IMPLEMENTATION_TRACEABILITY.md
      └─ UC-002 Code Flow
      └─ Testing procedures
      └─ API endpoints
```

### "Saya ingin tahu testing steps"
```
SAD_QUICK_REFERENCE.md
└─ Section: Testing Checklist
   └─ IMPLEMENTATION_TRACEABILITY.md
      └─ Section: API Testing Commands
      └─ Section: Frontend Testing Scenarios
```

---

## 📋 Feature Tracking

| Feature | Use Case | Status | Component | Test? |
|---------|----------|--------|-----------|-------|
| Add Patient | UC-001 | ✅ Complete | PatientDialog | ✅ |
| View Patients | UC-001 | ✅ Complete | PatientTable | ✅ |
| Edit Patient | UC-001 | ✅ Complete | PatientDialog | ✅ |
| Delete Patient | UC-001 | ✅ Complete | PatientTable | ✅ |
| Register Queue | UC-002 | ✅ Complete | QueueDialog | ✅ |
| View Queue | UC-002 | ✅ Complete | QueueStatusCard | ✅ |
| Real-time Queue Poll | UC-002 | ✅ Complete | useRealTimeData | ✅ |
| Create Medical Record | UC-003 | ✅ Complete | Examination | ✅ |
| View Medical Records | UC-003 | ✅ Complete | MedicalRecordsCard | ✅ |
| Create Prescription | UC-004 | ✅ Complete | Pharmacy | ✅ |
| View Prescriptions | UC-004 | ✅ Complete | PrescriptionCard | ✅ |
| **Real-time Payment Tracking** | UC-004 | 🔄 Active | PrescriptionPaymentTracker | 🔄 |
| **Payment Status Poll** | UC-004 | 🔄 Active | usePaymentTracking | 🔄 |
| View Medicines | UC-005 | ✅ Complete | Pharmacy | ✅ |
| Update Stock | UC-005 | ✅ Complete | Context | ✅ |
| Manage Staff | UC-006 | ✅ Complete | Staff page | ✅ |
| Authentication | UC-007 | ✅ Complete | AuthContext | ✅ |

---

## 🚀 Quick Start Checklist

### Setup Development Environment
```bash
# Clone & install
git clone <repo>
cd sentosa-health-hub
npm run install:all

# Run development
npm run dev
# Frontend: http://localhost:8080
# Backend: http://localhost:3001

# Test API
curl http://localhost:3001/api/health
# Response: {"status":"ok","message":"Sentosa Health Hub API is running"}
```

### Verify All UC-001-007 Working
```bash
# Run testing checklist dari SAD_QUICK_REFERENCE.md
# Section: Testing Checklist

# Test Patient Management (UC-001)
[ ] Add new patient
[ ] View patient list
[ ] Edit patient data
[ ] Delete patient

# Test Queue Management (UC-002) 
[ ] Register queue
[ ] Check real-time updates (5s)

# ... dst untuk UC-003-007
```

### Access System
```
Login Options:
- Patient:    username=patient1, password=password
- Doctor:     username=doctor1, password=password
- Pharmacist: username=pharmacist1, password=password
- Admin:      username=admin1, password=password
- Staff:      username=staff1, password=password

(Details di Login.tsx atau AuthContext.tsx)
```

---

## 📞 Kontak & Support

### Butuh bantuan understanding architecture?
→ Baca ARCHITECTURE_TRACEABILITY.md section relevant

### Butuh find specific code?
→ Gunakan IMPLEMENTATION_TRACEABILITY.md untuk exact file paths

### Butuh testing guide?
→ Lihat SAD_QUICK_REFERENCE.md Testing Checklist

### Butuh API documentation?
→ Lihat IMPLEMENTATION_TRACEABILITY.md API Endpoints atau SAD_QUICK_REFERENCE.md API Endpoints Summary

### Butuh tambah feature baru?
→ Ikuti SAD_QUICK_REFERENCE.md "Development Workflow" section

---

## 📅 Documentation Update Schedule

| Document | Last Updated | Next Review |
|----------|-------------|------------|
| SAD_QUICK_REFERENCE.md | Nov 25, 2025 | Dec 2025 |
| ARCHITECTURE_TRACEABILITY.md | Nov 25, 2025 | Dec 2025 |
| IMPLEMENTATION_TRACEABILITY.md | Nov 25, 2025 | Dec 2025 |

**Note:** Update dokumentasi setiap kali ada major feature atau architecture change.

---

## 🎓 Learning Resources

### For Understanding System Architecture
- Start: SAD_QUICK_REFERENCE.md (5 min)
- Deep dive: ARCHITECTURE_TRACEABILITY.md (1-2 hours)
- Hands-on: Follow testing checklist

### For Understanding Code Implementation
- Start: IMPLEMENTATION_TRACEABILITY.md (1 hour)
- Practice: Try API testing commands
- Code: Follow examples di IMPLEMENTATION_TRACEABILITY.md

### For Adding New Features
- Pattern: Study existing UC (e.g., UC-001)
- Document: Refer to "Development Workflow" section
- Implement: Follow same pattern
- Test: Write test cases following existing examples

---

## ✅ Verification Checklist

- [x] SAD_QUICK_REFERENCE.md - Complete dengan 8 sections
- [x] ARCHITECTURE_TRACEABILITY.md - Complete dengan 7 sections
- [x] IMPLEMENTATION_TRACEABILITY.md - Complete dengan 6 sections
- [x] File structure documented
- [x] All 7 Use Cases documented
- [x] ERD dengan relationships
- [x] DFD dengan data flows
- [x] Real-time features explained
- [x] Code examples provided
- [x] Testing procedures defined
- [x] API endpoints documented
- [x] Learning path established

**Status:** ✅ DOKUMENTASI LENGKAP & SIAP DIGUNAKAN

---

## 📞 Questions? 

Refer ke section "🔍 Finding Things" di atas atau ikuti path sesuai kebutuhan Anda:

```
Saya... (pilih yang sesuai)
├─ Developer baru → SAD_QUICK_REFERENCE.md (Learning Path)
├─ Ingin paham architecture → ARCHITECTURE_TRACEABILITY.md
├─ Ingin lihat code details → IMPLEMENTATION_TRACEABILITY.md
├─ Ingin add feature → SAD_QUICK_REFERENCE.md (Development Workflow)
├─ Ingin test → SAD_QUICK_REFERENCE.md (Testing Checklist)
└─ Ingin find something → Gunakan "🔍 Finding Things" di atas
```

---

**Happy Coding! 🚀**

