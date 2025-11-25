import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, roles, Role } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField, FormInput } from '@/components/ui/form-field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/validation-feedback';
import { Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateLoginForm, validateEmail, validatePassword } from '@/lib/validators';
import { formatErrorMessage, getSuccessMessage } from '@/services/errorService';

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
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Klinik Sentosa</CardTitle>
          <CardDescription>Masuk ke sistem manajemen klinik</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                type="email"
                placeholder="nama@kliniksentosa.com"
                value={email}
                onChange={handleEmailChange}
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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                disabled={isLoading}
                autoComplete="current-password"
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
              {isLoading ? 'Sedang masuk...' : 'Masuk'}
            </Button>

            <Alert variant="info" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Demo</AlertTitle>
              <AlertDescription>
                Gunakan email dan password apa saja untuk login (fitur demo)
              </AlertDescription>
            </Alert>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Daftar di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
