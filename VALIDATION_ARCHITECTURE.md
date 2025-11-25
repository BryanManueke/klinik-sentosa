# Sistem Validasi & Umpan Balik - Arsitektur

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND COMPONENTS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Pages (Login, Register, Patients, etc)         │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Custom Hooks (usePatientFormValidation)          │  │
│  │  - State management                                      │  │
│  │  - Real-time validation logic                           │  │
│  │  - Form data handling                                   │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│        ┌────────────┴────────────┬──────────────────┐           │
│        ▼                         ▼                  ▼           │
│  ┌──────────────┐  ┌──────────────────┐   ┌──────────────┐    │
│  │  UI Layer    │  │ Validators       │   │ Error Service│    │
│  │              │  │ (lib/validators) │   │              │    │
│  │ FormField ◄──┼─►│                  │   │ - Formatting │    │
│  │ FormInput    │  │ - Email          │   │ - Messages   │    │
│  │ FormTextarea │  │ - Password       │   │ - Error Codes│    │
│  │ Alert        │  │ - Phone          │   │              │    │
│  │              │  │ - Age            │   │              │    │
│  └──────────────┘  │ - Address        │   └──────────────┘    │
│                     │ - Form-level     │                       │
│                     └──────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘

        ▼                         ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    UTILITIES & SERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Frontend/src/lib/validators.ts                           │  │
│  │                                                            │  │
│  │  Single Validators:                                       │  │
│  │  • validateEmail()      → ValidationResult               │  │
│  │  • validatePassword()   → ValidationResult               │  │
│  │  • validatePhone()      → ValidationResult               │  │
│  │  • validateAge()        → ValidationResult               │  │
│  │  • validateAddress()    → ValidationResult               │  │
│  │                                                            │  │
│  │  Multi-field Validators:                                 │  │
│  │  • validatePatientForm()     → {isValid, errors}         │  │
│  │  • validateLoginForm()       → {isValid, errors}         │  │
│  │  • validateRegisterForm()    → {isValid, errors}         │  │
│  │  • validateQueueForm()       → {isValid, errors}         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Frontend/src/services/errorService.ts                   │  │
│  │                                                            │  │
│  │  Error Handling:                                          │  │
│  │  • categorizeError()      → ErrorInfo                    │  │
│  │  • formatErrorMessage()   → string                       │  │
│  │  • handleApiError()       → string                       │  │
│  │                                                            │  │
│  │  Message Management:                                      │  │
│  │  • getSuccessMessage()    → string                       │  │
│  │  • getWarningMessage()    → string                       │  │
│  │  • getValidationErrorMessage() → string                  │  │
│  │                                                            │  │
│  │  Error Categories:                                        │  │
│  │  • NETWORK_ERROR  • VALIDATION_ERROR                     │  │
│  │  • AUTH_ERROR     • FORBIDDEN_ERROR                      │  │
│  │  • NOT_FOUND_ERROR • SERVER_ERROR                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow - Login Example

```
User Input (Email & Password)
         │
         ▼
┌─────────────────────────┐
│  onChange Handler       │
│  - Update state         │
│  - If touched:          │
│    - Validate field     │
│    - Set errors         │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  validateEmail()        │
│  ├─ Check not empty     │
│  ├─ Check format        │
│  ├─ Check length        │
│  └─ Return result       │
└─────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
  Valid    Invalid
    │         │
    │         ▼
    │    setErrors({
    │      email: "Format email tidak valid"
    │    })
    │         │
    ├─────────┘
    │
    ▼
┌─────────────────────────┐
│  FormField Renders      │
│  - Shows error message  │
│  - Shows error icon     │
│  - Styles input         │
└─────────────────────────┘
         │
         ▼
  Display to User
    - Email input dengan border merah
    - Error message: "Format email tidak valid"
    - Error icon di sebelah kanan input
```

---

## 🔄 Validation Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                   VALIDATION FLOW                                │
└─────────────────────────────────────────────────────────────────┘

1. INITIAL STATE
   ├─ touched = { email: false, password: false }
   └─ errors = {}

2. USER FOCUS (onBlur)
   ├─ Mark field as touched
   └─ Validate field
      └─ Set error if invalid

3. USER TYPING (onChange)
   ├─ Update form data
   ├─ If field is touched:
   │  └─ Validate in real-time
   │     └─ Update errors
   └─ Display feedback immediately

4. USER SUBMIT (onSubmit)
   ├─ Mark ALL fields as touched
   ├─ Validate entire form
   ├─ If any errors:
   │  ├─ Show error summary
   │  ├─ Highlight all fields
   │  └─ Prevent submission
   └─ If valid:
      └─ Submit to server

5. SERVER RESPONSE
   ├─ Success:
   │  ├─ Show success message
   │  ├─ Clear form
   │  └─ Redirect or close dialog
   └─ Error:
      ├─ Parse error from response
      ├─ Update field errors
      └─ Show error message
```

---

## 🎯 Component Hierarchy

```
LoginPage
├─ FormField (Email)
│  ├─ FormInput
│  ├─ Error Message (conditionally)
│  ├─ Success Message (conditionally)
│  └─ Helper Text (conditionally)
│
├─ FormField (Password)
│  ├─ FormInput
│  ├─ Error Message
│  └─ Helper Text
│
├─ Alert (if errors exist)
│  ├─ AlertTitle
│  └─ AlertDescription
│
├─ Button (Submit)
│  └─ Loading state
│
└─ Sonner Toast
   ├─ Error notifications
   └─ Success notifications
```

---

## 🔑 Key Features

### 1. Real-time Validation
```typescript
✓ Validasi saat blur (ketika user meninggalkan field)
✓ Validasi saat typing (hanya jika user sudah pernah blur)
✓ Smooth feedback tanpa delay
✓ Error message langsung hilang saat diperbaiki
```

### 2. Visual Feedback
```typescript
✓ Green checkmark (✓) untuk field valid
✓ Red alert icon (!) untuk field invalid
✓ Red text untuk error message
✓ Green text untuk success message
✓ Disabled state saat loading
```

### 3. User-Friendly Messages
```typescript
✓ Spesifik error messages (bukan "Format salah")
✓ Constructive feedback ("Format: 08xx...")
✓ Helper text untuk guidance
✓ Multi-language ready
```

### 4. Loading States
```typescript
✓ Button disabled saat submit
✓ Inputs disabled saat loading
✓ Loading text pada button
✓ Prevent double submission
```

---

## 📱 Integration Points

### Pages Ready to Use

```
✅ Login.tsx
   └─ validateLoginForm()
   └─ validateEmail()
   └─ validatePassword()

✅ Register.tsx
   └─ validateRegisterForm()
   └─ validateName()
   └─ validateConfirmPassword()

⏳ Patients.tsx (siap dengan hook)
   └─ usePatientFormValidation()
   └─ validatePatientForm()

⏳ Pharmacy.tsx (siap dengan validators)
   └─ validateMedicineForm()
   └─ validateStock()
   └─ validatePrice()

⏳ Queue.tsx (siap dengan validators)
   └─ validateQueueForm()
   └─ validateComplaint()

⏳ Staff.tsx (siap dengan validators)
   └─ validateName()
   └─ validatePhone()
```

---

## 🛠️ Development Workflow

```
1. SETUP
   ├─ Import validators
   ├─ Import useFormValidation hook or create custom
   └─ Setup form state (formData, touched, errors)

2. RENDER
   ├─ Render FormField components
   ├─ Pass state to props
   └─ Setup onChange/onBlur handlers

3. VALIDATE
   ├─ Real-time on blur
   ├─ Real-time on change (if touched)
   └─ Full form on submit

4. FEEDBACK
   ├─ Show errors inline
   ├─ Show success indicators
   └─ Show toast messages

5. SUBMIT
   ├─ Send to API
   ├─ Handle response
   └─ Show appropriate feedback
```

---

## 📈 Performance Considerations

```
✓ Validators are pure functions (no side effects)
✓ Validation happens client-side (fast)
✓ No unnecessary re-renders
✓ Debouncing not needed (validation is instant)
✓ Errors cached in state
✓ Touched state prevents over-validation
```

---

## 🔐 Security Notes

```
✓ Client-side validation is for UX only
✓ ALWAYS validate on server too
✓ Password validation doesn't check backend
✓ Email uniqueness check requires backend
✓ Phone format validation is format-only
✓ No sensitive data logged to console in production
```

---

## 📚 Learning Resources

### How to Understand the Code

1. **Start with validators.ts**
   - Understand individual validator functions
   - See how ValidationResult works
   - Notice the pattern in all validators

2. **Check errorService.ts**
   - Understand error categorization
   - See message management
   - Learn error handling patterns

3. **Look at Login.tsx**
   - See how validators are used
   - Understand form state management
   - Check how feedback is displayed

4. **Review hooks/usePatientFormValidation.ts**
   - See reusable hook pattern
   - Understand full-form validation
   - Check example component usage

---

## 🚀 Deployment Checklist

- [ ] All validators tested
- [ ] Error messages reviewed by UX team
- [ ] Loading states tested
- [ ] Error scenarios tested
- [ ] Success scenarios tested
- [ ] Mobile responsiveness checked
- [ ] Accessibility checked (WCAG)
- [ ] Error logging configured
- [ ] Backend validation aligned
- [ ] Documentation complete

---

Last Updated: 2025-11-25
Version: 1.0
