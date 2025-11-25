# Sistem Validasi & Umpan Balik Pengguna

## Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Komponen Utama](#komponen-utama)
3. [Cara Penggunaan](#cara-penggunaan)
4. [Contoh Implementasi](#contoh-implementasi)
5. [Daftar Validasi Lengkap](#daftar-validasi-lengkap)
6. [Error & Success Messages](#error--success-messages)

---

## Pendahuluan

Sistem validasi ini dirancang untuk memberikan umpan balik yang jelas dan konsisten kepada pengguna. Sistem ini mencakup:

- ✅ Validasi real-time saat pengguna mengetik
- ✅ Pesan error yang spesifik dan membantu
- ✅ Pesan success yang informatif
- ✅ Indikator visual (icon success/error)
- ✅ Support untuk multiple validasi per field
- ✅ Error handling yang comprehensive

---

## Komponen Utama

### 1. **lib/validators.ts**
File utility yang berisi semua fungsi validasi individual:

```typescript
// Email validation
validateEmail(email: string): ValidationResult

// Password validation
validatePassword(password: string, minLength?: number): ValidationResult

// Form-level validation
validatePatientForm(data: any): ValidationResult
validateLoginForm(data: any): ValidationResult
validateRegisterForm(data: any): ValidationResult
```

### 2. **services/errorService.ts**
Service untuk menangani error dan pesan:

```typescript
// Categorize dan format error
categorizeError(error: any): ErrorInfo
formatErrorMessage(error: any): string

// Success message management
getSuccessMessage(code: string): string
getValidationErrorMessage(code: string): string
```

### 3. **components/ui/form-field.tsx**
Komponen FormField dengan built-in validasi:

```typescript
<FormField
  label="Email"
  error={errors.email}
  touched={touched.email}
  required
>
  <FormInput ... />
</FormField>
```

### 4. **components/ui/validation-feedback.tsx**
Komponen untuk menampilkan alert dan feedback:

```typescript
<Alert variant="destructive|success|warning|info">
  <AlertTitle>Judul</AlertTitle>
  <AlertDescription>Pesan detail</AlertDescription>
</Alert>
```

---

## Cara Penggunaan

### Step 1: Import yang diperlukan

```typescript
import { FormField, FormInput } from '@/components/ui/form-field';
import { validateName, validateEmail } from '@/lib/validators';
import { formatErrorMessage, getSuccessMessage } from '@/services/errorService';
```

### Step 2: Setup state

```typescript
const [formData, setFormData] = useState({ name: '', email: '' });
const [touched, setTouched] = useState({ name: false, email: false });
const [errors, setErrors] = useState<Record<string, string>>({});
```

### Step 3: Real-time validation function

```typescript
const validateField = (field: string, value: string) => {
  const newErrors = { ...errors };
  
  if (field === 'email') {
    const validation = validateEmail(value);
    if (!validation.isValid) {
      newErrors.email = validation.error || '';
    } else {
      delete newErrors.email;
    }
  }
  
  setErrors(newErrors);
};
```

### Step 4: Handle change dan blur

```typescript
const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setFormData(prev => ({ ...prev, email: value }));
  if (touched.email) {
    validateField('email', value);
  }
};

const handleBlur = (field: string) => {
  setTouched(prev => ({ ...prev, [field]: true }));
  validateField(field, formData[field]);
};
```

### Step 5: Form submission

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Mark all as touched
  setTouched({ name: true, email: true });
  
  // Validate form
  const validation = validatePatientForm(formData);
  if (!validation.isValid) {
    setErrors(validation.errors || {});
    toast.error('Mohon periksa kembali form');
    return;
  }
  
  // Submit
  toast.success(getSuccessMessage('PATIENT_ADDED'));
};
```

---

## Contoh Implementasi

### Login Form
**File:** `frontend/src/pages/Login.tsx`

```typescript
// Fitur:
- Email validation dengan format check
- Password validation (minimal 6 karakter)
- Real-time error display
- Loading state saat submit
- Success/error toast message
- Icon indikator (✓ atau ✗)

// Field yang divalidasi:
1. Email (required, format valid, max 100 char)
2. Password (required, min 6 char, max 50 char)
```

### Register Form
**File:** `frontend/src/pages/Register.tsx`

```typescript
// Fitur:
- Nama validation
- Email validation (unique check)
- Password validation
- Confirm password validation
- Real-time feedback
- Helper text

// Field yang divalidasi:
1. Nama (min 2 char, max 100 char)
2. Email (format valid)
3. Password (min 6 char)
4. Confirm Password (match check)
```

### Patient Management Form
**File:** `frontend/src/pages/Patients.tsx` (ready to implement)

```typescript
// Field yang divalidasi:
1. Nama Pasien (min 2, max 100)
2. Umur (0-150)
3. Jenis Kelamin (required)
4. Nomor Telepon (format Indonesia)
5. Alamat (min 5, max 200)
```

---

## Daftar Validasi Lengkap

### Text Fields

| Field | Validasi | Pesan Error |
|-------|----------|------------|
| **Nama** | Min 2, Max 100, Hanya huruf | "Nama minimal 2 karakter" |
| **Email** | Format valid, Max 100 | "Format email tidak valid" |
| **Alamat** | Min 5, Max 200 | "Alamat minimal 5 karakter" |
| **Keluhan** | Min 3, Max 500 | "Keluhan minimal 3 karakter" |

### Number Fields

| Field | Validasi | Pesan Error |
|-------|----------|------------|
| **Umur** | 0-150, Integer | "Usia harus antara 0-150 tahun" |
| **Stok** | ≥0, Integer | "Stok tidak boleh negatif" |
| **Harga** | ≥0, Max 999999999 | "Harga tidak boleh negatif" |
| **Jumlah** | >0, Integer | "Jumlah harus lebih dari 0" |

### Selection Fields

| Field | Validasi | Options |
|-------|----------|---------|
| **Jenis Kelamin** | Required | Laki-laki, Perempuan |
| **Satuan** | From list | tablet, kaplet, kapsul, ml, botol, gram, box |

### Phone & Contact

| Field | Validasi | Format |
|-------|----------|--------|
| **No. Telepon** | Indonesia format | 08xx... atau +62xx... |

### Passwords

| Field | Validasi | Rules |
|-------|----------|-------|
| **Password** | Min 6, Max 50 | Alphanumeric + symbols |
| **Confirm** | Must match | Same as password field |

---

## Error & Success Messages

### Error Categories

```typescript
// NETWORK_ERROR
"Gagal terhubung ke server"
"Periksa koneksi internet Anda"

// VALIDATION_ERROR
"Data yang dikirim tidak valid"

// AUTH_ERROR
"Sesi Anda telah berakhir"
"Silakan login kembali"

// FORBIDDEN_ERROR
"Anda tidak memiliki akses"

// NOT_FOUND_ERROR
"Data tidak ditemukan"

// SERVER_ERROR
"Terjadi kesalahan pada server"
"Tim teknis sedang menangani masalah ini"
```

### Success Messages

```typescript
// Patient
"PATIENT_ADDED" → "Data pasien berhasil ditambahkan"
"PATIENT_UPDATED" → "Data pasien berhasil diperbarui"
"PATIENT_DELETED" → "Data pasien berhasil dihapus"

// Queue
"QUEUE_REGISTERED" → "Berhasil mendaftar antrian"
"QUEUE_CANCELLED" → "Antrian berhasil dibatalkan"

// Prescription
"PRESCRIPTION_CREATED" → "Resep berhasil dibuat"
"PRESCRIPTION_PAID" → "Pembayaran resep berhasil"

// Authentication
"LOGIN_SUCCESS" → "Login berhasil"
"LOGOUT_SUCCESS" → "Logout berhasil"
"REGISTER_SUCCESS" → "Registrasi berhasil"
```

---

## Best Practices

### 1. **Always Validate on Blur**
```typescript
const handleBlur = (field: string) => {
  setTouched(prev => ({ ...prev, [field]: true }));
  validateField(field, formData[field]);
};
```

### 2. **Real-time Validation After Touch**
```typescript
const handleChange = (e) => {
  const value = e.target.value;
  setFormData(prev => ({ ...prev, [field]: value }));
  
  // Only validate if user has already interacted
  if (touched[field]) {
    validateField(field, value);
  }
};
```

### 3. **Validate All on Submit**
```typescript
const handleSubmit = (e) => {
  e.preventDefault();
  
  // Mark all as touched first
  setTouched({ field1: true, field2: true, ... });
  
  // Then validate
  const validation = validateForm(formData);
  if (!validation.isValid) {
    setErrors(validation.errors || {});
    return;
  }
  
  // Submit
};
```

### 4. **Use Appropriate Error Types**
```typescript
// Use toast untuk quick feedback
toast.error('Pesan error umum');
toast.success('Operasi berhasil');

// Use Alert untuk error yang perlu permanent display
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Detail error...</AlertDescription>
</Alert>
```

### 5. **Show Loading State**
```typescript
<Button disabled={isLoading}>
  {isLoading ? 'Sedang proses...' : 'Submit'}
</Button>
```

---

## Testing

### Test Cases untuk Validasi

```typescript
// Email validation
✓ Valid email: "user@example.com"
✗ Empty email: ""
✗ Invalid format: "invalid@"
✗ Too long: "a".repeat(101) + "@example.com"

// Password validation
✓ Valid password: "password123"
✗ Empty: ""
✗ Too short: "pass"
✗ Too long: "p".repeat(51)

// Phone validation
✓ Valid: "08123456789" atau "+621234567890"
✗ Invalid: "123" atau "not-a-number"
```

---

## Integrasi dengan Pages

Validasi ini sudah terintegrasi dengan:
- ✅ **Login.tsx** - Email & Password validation
- ✅ **Register.tsx** - Name, Email, Password, Confirm Password validation
- ⏳ **Patients.tsx** - Patient data validation (siap untuk diimplementasi)
- ⏳ **Pharmacy.tsx** - Medicine data validation (siap untuk diimplementasi)
- ⏳ **Queue.tsx** - Queue/Appointment validation (siap untuk diimplementasi)

---

## Next Steps

1. **Implementasikan ke Patients.tsx**
   - Add patient form validation
   - Edit patient form validation
   - Delete confirmation

2. **Implementasikan ke Pharmacy.tsx**
   - Medicine add/edit validation
   - Stock management validation
   - Price validation

3. **Implementasikan ke halaman lainnya**
   - Queue/Appointment validation
   - Prescription validation
   - Staff management validation

4. **Backend Integration**
   - Sync client-side validation dengan backend
   - Handle duplicate checks (email, etc)
   - Server-side validation responses

---

## Referensi File

- **Validators:** `frontend/src/lib/validators.ts`
- **Error Service:** `frontend/src/services/errorService.ts`
- **Form Components:** `frontend/src/components/ui/form-field.tsx`
- **Alert Components:** `frontend/src/components/ui/validation-feedback.tsx`
- **Login Page:** `frontend/src/pages/Login.tsx`
- **Register Page:** `frontend/src/pages/Register.tsx`

