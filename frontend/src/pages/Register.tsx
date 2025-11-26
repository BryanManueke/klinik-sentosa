import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField, FormInput } from '@/components/ui/form-field';
import { UserPlus } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        { value: roles.ADMIN, label: 'Admin' },
        { value: roles.DOCTOR, label: 'Dokter' },
        { value: roles.NURSE, label: 'Perawat' },
        { value: roles.PHARMACY, label: 'Apoteker' },
        { value: roles.OWNER, label: 'Pemilik' },
        { value: roles.PATIENT, label: 'Pasien' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
            <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardHeader className="space-y-2 text-center pb-6 pt-8">
                    <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2 shadow-lg shadow-blue-200">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight">Daftar Akun Baru</CardTitle>
                    <CardDescription className="text-slate-500 text-base">Buat akun untuk mengakses sistem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8">
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Validation */}
                        <FormField
                            label="Nama Lengkap"
                            error={errors.name}
                            touched={touched.name}
                            required
                            showValidIcon
                            showErrorIcon
                            className="space-y-1.5"
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
                                className="h-12 bg-blue-50/30 border-blue-100 focus:border-blue-500 focus:ring-blue-200 transition-all rounded-xl"
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
                            className="space-y-1.5"
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
                                className="h-12 bg-blue-50/30 border-blue-100 focus:border-blue-500 focus:ring-blue-200 transition-all rounded-xl"
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
                            className="space-y-1.5"
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
                                className="h-12 bg-blue-50/30 border-blue-100 focus:border-blue-500 focus:ring-blue-200 transition-all rounded-xl"
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
                            className="space-y-1.5"
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
                                className="h-12 bg-blue-50/30 border-blue-100 focus:border-blue-500 focus:ring-blue-200 transition-all rounded-xl"
                            />
                        </FormField>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 leading-none">
                                Role
                            </label>
                            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
                                <SelectTrigger className="h-12 bg-blue-50/30 border-blue-100 focus:border-blue-500 focus:ring-blue-200 transition-all rounded-xl">
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roleOptions.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sedang mendaftar...' : 'Daftar'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <p className="text-sm text-slate-500">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
