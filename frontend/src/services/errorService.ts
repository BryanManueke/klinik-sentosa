// Error handling and formatting service
export interface ErrorInfo {
  code?: string;
  message: string;
  details?: string;
  field?: string;
  timestamp: Date;
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// Categorize errors
export const categorizeError = (error: any): ErrorInfo => {
  const timestamp = new Date();

  // Network errors
  if (error?.message?.includes('Network') || error?.message?.includes('fetch')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Gagal terhubung ke server',
      details: 'Periksa koneksi internet Anda',
      timestamp,
    };
  }

  // Timeout errors
  if (error?.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT_ERROR',
      message: 'Permintaan timeout',
      details: 'Server memerlukan waktu terlalu lama untuk merespons',
      timestamp,
    };
  }

  // Authentication errors
  if (error?.status === 401) {
    return {
      code: 'AUTH_ERROR',
      message: 'Sesi Anda telah berakhir',
      details: 'Silakan login kembali',
      timestamp,
    };
  }

  // Authorization errors
  if (error?.status === 403) {
    return {
      code: 'FORBIDDEN_ERROR',
      message: 'Anda tidak memiliki akses',
      details: 'Hubungi administrator jika merasa ini adalah kesalahan',
      timestamp,
    };
  }

  // Not found errors
  if (error?.status === 404) {
    return {
      code: 'NOT_FOUND_ERROR',
      message: 'Data tidak ditemukan',
      details: 'Coba muat ulang halaman atau periksa URL',
      timestamp,
    };
  }

  // Validation errors
  if (error?.status === 400) {
    return {
      code: 'VALIDATION_ERROR',
      message: error?.data?.message || 'Data yang dikirim tidak valid',
      details: error?.data?.details,
      timestamp,
    };
  }

  // Server errors
  if (error?.status >= 500) {
    return {
      code: 'SERVER_ERROR',
      message: 'Terjadi kesalahan pada server',
      details: 'Tim teknis sedang menangani masalah ini',
      timestamp,
    };
  }

  // Generic error
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'Terjadi kesalahan yang tidak diketahui',
    details: 'Silakan coba lagi',
    timestamp,
  };
};

// Format error for user display
export const formatErrorMessage = (error: any): string => {
  const errorInfo = categorizeError(error);
  return errorInfo.message;
};

// Format error with details
export const formatErrorWithDetails = (error: any): { message: string; details?: string } => {
  const errorInfo = categorizeError(error);
  return {
    message: errorInfo.message,
    details: errorInfo.details,
  };
};

// Log error to console (development only)
export const logError = (error: any, context?: string): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'Error'}]`, error);
  }
};

// Retry logic for failed operations
export const retryOperation = async (
  operation: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Handle API response errors
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Terjadi kesalahan. Silakan coba lagi.';
};

// Validation error messages mapping
export const validationErrorMessages: Record<string, string> = {
  'REQUIRED_FIELD': 'Field ini wajib diisi',
  'INVALID_EMAIL': 'Format email tidak valid',
  'PASSWORD_TOO_SHORT': 'Password terlalu pendek',
  'PASSWORDS_NOT_MATCH': 'Password tidak cocok',
  'INVALID_PHONE': 'Format nomor telepon tidak valid',
  'INVALID_AGE': 'Usia tidak valid',
  'INVALID_STOCK': 'Stok tidak valid',
  'INVALID_PRICE': 'Harga tidak valid',
  'DUPLICATE_EMAIL': 'Email sudah terdaftar',
  'PATIENT_NOT_FOUND': 'Data pasien tidak ditemukan',
  'QUEUE_NOT_FOUND': 'Antrian tidak ditemukan',
  'PRESCRIPTION_NOT_FOUND': 'Resep tidak ditemukan',
  'MEDICINE_NOT_FOUND': 'Obat tidak ditemukan',
};

// Get validation error message
export const getValidationErrorMessage = (code: string): string => {
  return validationErrorMessages[code] || 'Terjadi kesalahan validasi';
};

// Parse validation errors from response
export const parseValidationErrors = (error: any): Record<string, string> => {
  if (error?.response?.data?.errors) {
    return error.response.data.errors;
  }
  
  if (error?.data?.errors) {
    return error.data.errors;
  }
  
  return {};
};

// Success messages
export const successMessages: Record<string, string> = {
  'PATIENT_ADDED': 'Data pasien berhasil ditambahkan',
  'PATIENT_UPDATED': 'Data pasien berhasil diperbarui',
  'PATIENT_DELETED': 'Data pasien berhasil dihapus',
  'QUEUE_REGISTERED': 'Berhasil mendaftar antrian',
  'QUEUE_CANCELLED': 'Antrian berhasil dibatalkan',
  'PRESCRIPTION_CREATED': 'Resep berhasil dibuat',
  'PRESCRIPTION_PAID': 'Pembayaran resep berhasil',
  'MEDICINE_ADDED': 'Data obat berhasil ditambahkan',
  'MEDICINE_UPDATED': 'Data obat berhasil diperbarui',
  'MEDICINE_DELETED': 'Data obat berhasil dihapus',
  'LOGIN_SUCCESS': 'Login berhasil',
  'LOGOUT_SUCCESS': 'Logout berhasil',
  'REGISTER_SUCCESS': 'Registrasi berhasil',
  'PROFILE_UPDATED': 'Profil berhasil diperbarui',
};

// Get success message
export const getSuccessMessage = (code: string, fallback = 'Operasi berhasil'): string => {
  return successMessages[code] || fallback;
};

// Error context provider for detailed error information
export class ErrorContext {
  private static errors: Map<string, ErrorInfo> = new Map();

  static addError(id: string, error: ErrorInfo): void {
    this.errors.set(id, error);
  }

  static getError(id: string): ErrorInfo | undefined {
    return this.errors.get(id);
  }

  static removeError(id: string): void {
    this.errors.delete(id);
  }

  static clearAll(): void {
    this.errors.clear();
  }

  static getAllErrors(): ErrorInfo[] {
    return Array.from(this.errors.values());
  }
}

// Warning messages
export const warningMessages: Record<string, string> = {
  'LOW_STOCK': 'Stok obat menipis',
  'QUEUE_FULL': 'Antrian penuh, coba waktu lain',
  'PRESCRIPTION_EXPIRED': 'Resep sudah kadaluarsa',
  'PAYMENT_PENDING': 'Pembayaran masih pending',
  'SESSION_EXPIRING': 'Sesi Anda akan berakhir dalam 5 menit',
};

// Get warning message
export const getWarningMessage = (code: string): string | undefined => {
  return warningMessages[code];
};
