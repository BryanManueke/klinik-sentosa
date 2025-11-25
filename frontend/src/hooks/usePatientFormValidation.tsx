import { useState } from "react";
import { FormField, FormInput, FormTextarea } from "@/components/ui/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { validatePatientForm } from "@/lib/validators";
import { formatErrorMessage, getSuccessMessage } from "@/services/errorService";

export const usePatientFormValidation = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    age: false,
    gender: false,
    phone: false,
    address: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (field: string, value: string | number) => {
    const newErrors = { ...errors };
    switch (field) {
      case "name":
        if (!value || !value.toString().trim()) {
          newErrors.name = "Nama tidak boleh kosong";
        } else if (value.toString().length < 2) {
          newErrors.name = "Nama minimal 2 karakter";
        } else {
          delete newErrors.name;
        }
        break;
      case "age":
        if (value === "" || value === null || value === undefined) {
          newErrors.age = "Umur tidak boleh kosong";
        } else if (isNaN(Number(value))) {
          newErrors.age = "Umur harus berupa angka";
        } else if (Number(value) < 0 || Number(value) > 150) {
          newErrors.age = "Umur harus antara 0-150 tahun";
        } else {
          delete newErrors.age;
        }
        break;
      case "gender":
        if (!value) {
          newErrors.gender = "Jenis kelamin harus dipilih";
        } else {
          delete newErrors.gender;
        }
        break;
      case "phone":
        if (!value || !value.toString().trim()) {
          newErrors.phone = "Nomor telepon tidak boleh kosong";
        } else {
          const phoneRegex = /^(\+62|0)[0-9]{7,12}$/;
          if (!phoneRegex.test(value.toString().replace(/[- ]/g, ""))) {
            newErrors.phone = "Format nomor telepon tidak valid (08xx... atau +62xx...)";
          } else {
            delete newErrors.phone;
          }
        }
        break;
      case "address":
        if (!value || !value.toString().trim()) {
          newErrors.address = "Alamat tidak boleh kosong";
        } else if (value.toString().length < 5) {
          newErrors.address = "Alamat minimal 5 karakter";
        } else if (value.toString().length > 200) {
          newErrors.address = "Alamat maksimal 200 karakter";
        } else {
          delete newErrors.address;
        }
        break;
    }
    setErrors(newErrors);
  };

  const handleFieldChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field as string, value);
    }
  };

  const handleFieldBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field as string, formData[field as keyof typeof formData]);
  };

  const validateFormFull = (): boolean => {
    const newTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof typeof formData] = true;
      return acc;
    }, {} as typeof touched);
    setTouched(newTouched);

    const validation = validatePatientForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors || {});
      return false;
    }
    return true;
  };

  return {
    formData,
    setFormData,
    touched,
    errors,
    isLoading,
    setIsLoading,
    handleFieldChange,
    handleFieldBlur,
    validateFormFull,
  };
};

export const PatientFormFields = ({
  formData,
  touched,
  errors,
  isLoading,
  onFieldChange,
  onFieldBlur,
}: {
  formData: Record<string, any>;
  touched: Record<string, any>;
  errors: Record<string, string>;
  isLoading: boolean;
  onFieldChange: (field: string, value: any) => void;
  onFieldBlur: (field: string) => void;
}) => {
  const genderOptions = ["Laki-laki", "Perempuan"];
  return (
    <div className="space-y-4">
      <FormField label="Nama Lengkap" error={errors.name} touched={touched.name} required>
        <FormInput
          id="name"
          type="text"
          placeholder="Contoh: Budi Santoso"
          value={formData.name}
          onChange={(e: any) => onFieldChange("name", e.target.value)}
          onBlur={() => onFieldBlur("name")}
          disabled={isLoading}
          autoComplete="name"
        />
      </FormField>

      <FormField label="Umur" error={errors.age} touched={touched.age} required helperText="Masukkan dalam tahun">
        <FormInput
          id="age"
          type="number"
          placeholder="Contoh: 25"
          value={formData.age}
          onChange={(e: any) => onFieldChange("age", e.target.value)}
          onBlur={() => onFieldBlur("age")}
          disabled={isLoading}
          min={0}
          max={150}
        />
      </FormField>

      <FormField label="Jenis Kelamin" error={errors.gender} touched={touched.gender} required>
        <select
          id="gender"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.gender}
          onChange={(e: any) => onFieldChange("gender", e.target.value)}
          onBlur={() => onFieldBlur("gender")}
          disabled={isLoading}
        >
          <option value="">-- Pilih Jenis Kelamin --</option>
          {genderOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Nomor Telepon" error={errors.phone} touched={touched.phone} required helperText="Format: 08xx... atau +62xx...">
        <FormInput
          id="phone"
          type="tel"
          placeholder="Contoh: 081234567890"
          value={formData.phone}
          onChange={(e: any) => onFieldChange("phone", e.target.value)}
          onBlur={() => onFieldBlur("phone")}
          disabled={isLoading}
          autoComplete="tel"
        />
      </FormField>

      <FormField label="Alamat" error={errors.address} touched={touched.address} required>
        <FormTextarea
          id="address"
          placeholder="Contoh: Jl. Merdeka No. 123, Jakarta Pusat"
          value={formData.address}
          onChange={(e: any) => onFieldChange("address", e.target.value)}
          onBlur={() => onFieldBlur("address")}
          disabled={isLoading}
          rows={3}
        />
      </FormField>
    </div>
  );
};

export default usePatientFormValidation;
