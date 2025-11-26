import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, roles, Role } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField, FormInput } from '@/components/ui/form-field';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { validateLoginForm, validateEmail, validatePassword } from '@/lib/validators';
import { formatErrorMessage, getSuccessMessage } from '@/services/errorService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(roles.ADMIN);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === 'email') {
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
    }

    setErrors(newErrors);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      validateField('email', value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      validateField('password', value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'email' ? email : password);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate form
    const validation = validateLoginForm({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors || {});
      toast.error('Mohon periksa kembali form Anda');
      return;
    }

    setIsLoading(true);
    try {
      if (login(email, password, selectedRole)) {
        toast.success(getSuccessMessage('LOGIN_SUCCESS'));
        navigate('/');
      } else {
        toast.error('Login gagal! Periksa email dan password Anda.');
      }
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
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight">Klinik Sentosa</CardTitle>
          <CardDescription className="text-slate-500 text-base">Masuk ke sistem manajemen klinik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <form onSubmit={handleLogin} className="space-y-5">
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
                type="email"
                placeholder="nama@kliniksentosa.com"
                value={email}
                onChange={handleEmailChange}
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                disabled={isLoading}
                autoComplete="current-password"
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
              {isLoading ? 'Sedang masuk...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <p className="text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors">
              Daftar di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
