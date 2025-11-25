// Validation utilities for all form inputs
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: Record<string, string>;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email tidak boleh kosong' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Format email tidak valid' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Email terlalu panjang (maksimal 100 karakter)' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string, minLength = 6): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password tidak boleh kosong' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `Password minimal ${minLength} karakter` };
  }
  
  if (password.length > 50) {
    return { isValid: false, error: 'Password terlalu panjang (maksimal 50 karakter)' };
  }
  
  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Konfirmasi password tidak boleh kosong' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Password tidak cocok' };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name: string, fieldName = 'Nama'): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} tidak boleh kosong` };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldName} minimal 2 karakter` };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: `${fieldName} maksimal 100 karakter` };
  }
  
  if (!/^[a-zA-Z\s\-'ïêèé]+$/i.test(trimmed)) {
    return { isValid: false, error: `${fieldName} hanya boleh berisi huruf, spasi, dan tanda hubung` };
  }
  
  return { isValid: true };
};

// Phone number validation
export const validatePhone = (phone: string): ValidationResult => {
  const trimmed = phone.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Nomor telepon tidak boleh kosong' };
  }
  
  // Indonesian phone format
  const phoneRegex = /^(\+62|0)[0-9]{7,12}$/;
  if (!phoneRegex.test(trimmed.replace(/[- ]/g, ''))) {
    return { isValid: false, error: 'Format nomor telepon tidak valid. Gunakan format: 08xx... atau +62xx...' };
  }
  
  return { isValid: true };
};

// Age validation
export const validateAge = (age: number | string): ValidationResult => {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  
  if (!age || isNaN(ageNum)) {
    return { isValid: false, error: 'Usia tidak boleh kosong' };
  }
  
  if (ageNum < 0 || ageNum > 150) {
    return { isValid: false, error: 'Usia harus antara 0-150 tahun' };
  }
  
  return { isValid: true };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  const trimmed = address.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Alamat tidak boleh kosong' };
  }
  
  if (trimmed.length < 5) {
    return { isValid: false, error: 'Alamat minimal 5 karakter' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Alamat maksimal 200 karakter' };
  }
  
  return { isValid: true };
};

// Gender validation
export const validateGender = (gender: string): ValidationResult => {
  const validGenders = ['Laki-laki', 'Perempuan'];
  
  if (!gender) {
    return { isValid: false, error: 'Jenis kelamin harus dipilih' };
  }
  
  if (!validGenders.includes(gender)) {
    return { isValid: false, error: 'Jenis kelamin tidak valid' };
  }
  
  return { isValid: true };
};

// Complaint validation
export const validateComplaint = (complaint: string): ValidationResult => {
  const trimmed = complaint.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Keluhan tidak boleh kosong' };
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Keluhan minimal 3 karakter' };
  }
  
  if (trimmed.length > 500) {
    return { isValid: false, error: 'Keluhan maksimal 500 karakter' };
  }
  
  return { isValid: true };
};

// Doctor name validation
export const validateDoctorName = (name: string): ValidationResult => {
  return validateName(name, 'Nama Dokter');
};

// Medicine validation
export const validateMedicineName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Nama obat tidak boleh kosong' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Nama obat minimal 2 karakter' };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: 'Nama obat maksimal 100 karakter' };
  }
  
  return { isValid: true };
};

// Stock validation
export const validateStock = (stock: number | string): ValidationResult => {
  const stockNum = typeof stock === 'string' ? parseInt(stock, 10) : stock;
  
  if (stock === '' || stock === undefined) {
    return { isValid: false, error: 'Stok tidak boleh kosong' };
  }
  
  if (isNaN(stockNum)) {
    return { isValid: false, error: 'Stok harus berupa angka' };
  }
  
  if (stockNum < 0) {
    return { isValid: false, error: 'Stok tidak boleh negatif' };
  }
  
  if (!Number.isInteger(stockNum)) {
    return { isValid: false, error: 'Stok harus berupa angka bulat' };
  }
  
  return { isValid: true };
};

// Price validation
export const validatePrice = (price: number | string): ValidationResult => {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  
  if (price === '' || price === undefined) {
    return { isValid: false, error: 'Harga tidak boleh kosong' };
  }
  
  if (isNaN(priceNum)) {
    return { isValid: false, error: 'Harga harus berupa angka' };
  }
  
  if (priceNum < 0) {
    return { isValid: false, error: 'Harga tidak boleh negatif' };
  }
  
  if (priceNum > 999999999) {
    return { isValid: false, error: 'Harga terlalu besar' };
  }
  
  return { isValid: true };
};

// Unit validation
export const validateUnit = (unit: string): ValidationResult => {
  const trimmed = unit.trim();
  const validUnits = ['tablet', 'kaplet', 'kapsul', 'ml', 'botol', 'gram', 'box'];
  
  if (!trimmed) {
    return { isValid: false, error: 'Satuan tidak boleh kosong' };
  }
  
  if (!validUnits.includes(trimmed.toLowerCase())) {
    return { isValid: false, error: `Satuan harus salah satu dari: ${validUnits.join(', ')}` };
  }
  
  return { isValid: true };
};

// Dosage instruction validation
export const validateDosage = (dosage: string): ValidationResult => {
  const trimmed = dosage.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'Instruksi dosis tidak boleh kosong' };
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Instruksi dosis minimal 3 karakter' };
  }
  
  if (trimmed.length > 200) {
    return { isValid: false, error: 'Instruksi dosis maksimal 200 karakter' };
  }
  
  return { isValid: true };
};

// Amount/Quantity validation
export const validateAmount = (amount: number | string): ValidationResult => {
  const amountNum = typeof amount === 'string' ? parseInt(amount, 10) : amount;
  
  if (amount === '' || amount === undefined) {
    return { isValid: false, error: 'Jumlah tidak boleh kosong' };
  }
  
  if (isNaN(amountNum)) {
    return { isValid: false, error: 'Jumlah harus berupa angka' };
  }
  
  if (amountNum <= 0) {
    return { isValid: false, error: 'Jumlah harus lebih dari 0' };
  }
  
  if (!Number.isInteger(amountNum)) {
    return { isValid: false, error: 'Jumlah harus berupa angka bulat' };
  }
  
  return { isValid: true };
};

// Form data validation for patient
export const validatePatientForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) errors.name = nameValidation.error || '';
  
  // Validate age
  const ageValidation = validateAge(data.age);
  if (!ageValidation.isValid) errors.age = ageValidation.error || '';
  
  // Validate gender
  const genderValidation = validateGender(data.gender);
  if (!genderValidation.isValid) errors.gender = genderValidation.error || '';
  
  // Validate address
  const addressValidation = validateAddress(data.address);
  if (!addressValidation.isValid) errors.address = addressValidation.error || '';
  
  // Validate phone
  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) errors.phone = phoneValidation.error || '';
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  return { isValid: true };
};

// Form data validation for login
export const validateLoginForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error || '';
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.error || '';
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  return { isValid: true };
};

// Form data validation for registration
export const validateRegisterForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) errors.name = nameValidation.error || '';
  
  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.error || '';
  
  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) errors.password = passwordValidation.error || '';
  
  // Validate confirm password
  const confirmValidation = validateConfirmPassword(data.password, data.confirmPassword);
  if (!confirmValidation.isValid) errors.confirmPassword = confirmValidation.error || '';
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  return { isValid: true };
};

// Form data validation for queue/appointment
export const validateQueueForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate doctor name
  const doctorValidation = validateDoctorName(data.doctorName);
  if (!doctorValidation.isValid) errors.doctorName = doctorValidation.error || '';
  
  // Validate complaint
  const complaintValidation = validateComplaint(data.complaint);
  if (!complaintValidation.isValid) errors.complaint = complaintValidation.error || '';
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  return { isValid: true };
};

// Form data validation for medicine
export const validateMedicineForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Validate medicine name
  const nameValidation = validateMedicineName(data.name);
  if (!nameValidation.isValid) errors.name = nameValidation.error || '';
  
  // Validate stock
  const stockValidation = validateStock(data.stock);
  if (!stockValidation.isValid) errors.stock = stockValidation.error || '';
  
  // Validate min stock
  const minStockValidation = validateStock(data.minStock);
  if (!minStockValidation.isValid) errors.minStock = minStockValidation.error || '';
  
  // Validate unit
  const unitValidation = validateUnit(data.unit);
  if (!unitValidation.isValid) errors.unit = unitValidation.error || '';
  
  // Validate price
  const priceValidation = validatePrice(data.price);
  if (!priceValidation.isValid) errors.price = priceValidation.error || '';
  
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }
  
  return { isValid: true };
};

// Check for field changes (for dirty form detection)
export const isFieldDirty = (originalValue: any, currentValue: any): boolean => {
  return originalValue !== currentValue;
};

// Format validation errors for display
export const formatValidationErrors = (errors: Record<string, string>): string => {
  const errorMessages = Object.values(errors).filter(Boolean);
  if (errorMessages.length === 0) return '';
  return errorMessages.join('\n');
};
