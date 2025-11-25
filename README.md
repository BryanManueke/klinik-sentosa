# Sentosa Health Hub

A comprehensive clinic management system with separate backend and frontend.

## Project Structure

```
sentosa-health-hub/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   └── data/
│   └── package.json
├── frontend/         # React + Vite application
│   ├── src/
│   ├── public/
│   └── package.json
└── package.json      # Root package with scripts
```

## Getting Started

### 🚀 Quick Start (Recommended)

Setelah clone repository, cukup jalankan:

```bash
npm run dev
```

**Script ini akan otomatis:**
- ✅ Mengecek apakah dependencies sudah terinstall
- ✅ Menginstall dependencies jika belum ada (root, backend, frontend)
- ✅ Menjalankan backend dan frontend secara bersamaan

**Akses aplikasi:**
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3001`

### 📦 Manual Installation (Opsional)

Jika ingin install dependencies secara manual terlebih dahulu:

```bash
npm run install:all
```

Kemudian jalankan:
```bash
npm run dev:manual
```

### Run Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Troubleshooting

**If you get "Port already in use" error:**

1. **Windows:** Kill the process manually
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

2. **Or restart your terminal and try again**

### Build for Production
```bash
npm run build
```

## Features

- **Patient Management**: Register, update, and manage patient records
- **Queue System**: Manage patient queues with doctor assignments
- **Medical Records**: Track patient medical history
- **Pharmacy**: Manage medicines, prescriptions, and payments
- **Staff Management**: Manage clinic staff and roles
- **Reports**: View clinic statistics and reports
- **Real-Time Updates**: Live queue and payment status tracking
- **Role-Based Access**: Different permissions for patients, doctors, pharmacists, staff, and admins

## 📚 SAD Traceability Documentation ⭐

Complete Software Architecture Documentation with traceability mapping:

### Documentation Files
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Start here! Navigation hub for all documentation
- **[SAD_QUICK_REFERENCE.md](SAD_QUICK_REFERENCE.md)** - Quick reference guide (5-15 min read)
- **[ARCHITECTURE_TRACEABILITY.md](ARCHITECTURE_TRACEABILITY.md)** - Full architecture document (1-2 hours read)
- **[IMPLEMENTATION_TRACEABILITY.md](IMPLEMENTATION_TRACEABILITY.md)** - Code mapping and testing guide
- **[VISUAL_SUMMARY.md](VISUAL_SUMMARY.md)** - Visual diagrams and system overview

### What's Documented
✅ 7 Use Cases with complete flow mapping  
✅ Entity-Relationship Diagram (ERD)  
✅ Data Flow Diagram (DFD) - Levels 0, 1, 2  
✅ 9 User Stories with acceptance criteria  
✅ Component architecture & file structure  
✅ API endpoints & backend routes  
✅ Real-time features (Queue & Payment tracking)  
✅ Role-based access control  
✅ Testing procedures & checklist  
✅ Development workflow guide  

### Quick Links for Different Roles

**👨‍💻 New Developer?**  
→ Start with [SAD_QUICK_REFERENCE.md](SAD_QUICK_REFERENCE.md) Learning Path (Week 1-5)

**🏗️ Architect/Senior Dev?**  
→ Read [ARCHITECTURE_TRACEABILITY.md](ARCHITECTURE_TRACEABILITY.md) for complete technical design

**💻 Developer (Coding)?**  
→ Use [IMPLEMENTATION_TRACEABILITY.md](IMPLEMENTATION_TRACEABILITY.md) for code file paths & examples

**🧪 QA/Testing?**  
→ Check [SAD_QUICK_REFERENCE.md](SAD_QUICK_REFERENCE.md) Testing Checklist section

**📊 Project Manager?**  
→ Review [VISUAL_SUMMARY.md](VISUAL_SUMMARY.md) for system overview & metrics

**🚀 Need to add new feature?**  
→ Follow Development Workflow in [SAD_QUICK_REFERENCE.md](SAD_QUICK_REFERENCE.md)

## Real-Time Features

### Queue Status Tracking (UC-002)
- Real-time polling every 5 seconds
- Automatic queue position updates
- Hook: `useRealTimeData`
- Component: `QueueStatusCard`

### Payment Status Tracking (UC-004) ⭐
- Real-time polling every 3 seconds  
- Visual timeline: pending → processed → paid
- Hook: `usePaymentTracking`
- Component: `PrescriptionPaymentTracker`

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- CORS enabled
- Port: 3001

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- Sonner (Toast notifications)
- Port: 8080

## API Documentation

See [backend/README.md](backend/README.md) for API endpoints documentation.

## Important Notes

- Make sure both backend and frontend are running for the app to work properly
- Backend must be running on port 3001
- Frontend will be accessible on port 8080
- If you encounter port conflicts, use the troubleshooting steps above
