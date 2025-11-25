import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField, FormInput } from '@/components/ui/form-field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/validation-feedback';
import { UserPlus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { roles, Role } from '@/contexts/AuthContext';
import { 
  validateRegisterForm, 
  validateName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from '@/lib/validators';
import { formatErrorMessage, getSuccessMessage } from '@/services/errorService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [selectedRole, setSelectedRole] = useState<Role>(roles.PATIENT);
    const [touched, setTouched] = useState({ 
        name: false, 
        email: false, 
        password: false, 
        confirmPassword: false 
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (field: string, value: string) => {
        const newErrors = { ...errors };
        
        if (field === 'name') {
            const nameValidation = validateName(value, 'Nama');
            if (!nameValidation.isValid) {
                newErrors.name = nameValidation.error || '';
            } else {
                delete newErrors.name;
            }
        } else if (field === 'email') {
            const emailValidation = validateEmail(value);
            if (!emailValidation.isValid) {
                newErrors.email = emailValidation.error || '';
            } else {
                delete newErrors.email;
            }
        } else if (field === 'password') {
            const passwordValidation = validatePassword(value);
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.error || '';
            } else {
                delete newErrors.password;
            }
        } else if (field === 'confirmPassword') {
            const confirmValidation = validateConfirmPassword(formData.password, value);
            if (!confirmValidation.isValid) {
                newErrors.confirmPassword = confirmValidation.error || '';
            } else {
                delete newErrors.confirmPassword;
            }
        }
        
        setErrors(newErrors);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name as keyof typeof touched]) {
            validateField(name, value);
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field as keyof typeof formData]);
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({ name: true, email: true, password: true, confirmPassword: true });

        // Validate form
        const validation = validateRegisterForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors || {});
            toast.error('Mohon periksa kembali form Anda');
            return;
        }

        setIsLoading(true);
        try {
            // Mock registration logic
            console.log('Registering:', { ...formData, role: selectedRole });
            toast.success(getSuccessMessage('REGISTER_SUCCESS'));
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            const errorMsg = formatErrorMessage(error);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const roleOptions = [
        { value: roles.ADMIN, label: 'Admin', color: 'bg-primary' },
        { value: roles.DOCTOR, label: 'Dokter', color: 'bg-secondary' },
        { value: roles.NURSE, label: 'Perawat', color: 'bg-accent' },
        { value: roles.PHARMACY, label: 'Apoteker', color: 'bg-medical-green' },
        { value: roles.OWNER, label: 'Pemilik', color: 'bg-medical-teal' },
        { value: roles.PATIENT, label: 'Pasien', color: 'bg-blue-500' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                        <UserPlus className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
                    <CardDescription>Buat akun untuk mengakses sistem</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Name Validation */}
                        <FormField
                            label="Nama Lengkap"
                            error={errors.name}
                            touched={touched.name}
                            required
                            showValidIcon
                            showErrorIcon
                        >
                            <FormInput
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nama Lengkap Anda"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('name')}
                                disabled={isLoading}
                                autoComplete="name"
                            />
                        </FormField>

                        {/* Email Validation */}
                        <FormField
                            label="Email"
                            error={errors.email}
                            touched={touched.email}
                            required
                            showValidIcon
                            showErrorIcon
                        >
                            <FormInput
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                        </FormField>

                        {/* Password Validation */}
                        <FormField
                            label="Password"
                            error={errors.password}
                            touched={touched.password}
                            required
                            showValidIcon
                            showErrorIcon
                            helperText="Minimal 6 karakter"
                        >
                            <FormInput
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={() => handleBlur('password')}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                        </FormField>

                        {/* Confirm Password Validation */}
                        <FormField
                            label="Konfirmasi Password"
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                            required
                            showValidIcon
                            showErrorIcon
                        >
                            <FormInput
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={() => handleBlur('confirmPassword')}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                        </FormField>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Pilih Role
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {roleOptions.map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setSelectedRole(role.value)}
                                        disabled={isLoading}
                                        className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${selectedRole === role.value
                                                ? `${role.color} text-white shadow-md scale-105`
                                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sedang mendaftar...' : 'Daftar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Masuk di sini
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
