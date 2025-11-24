import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, roles, Role } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(roles.ADMIN);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (login(email, password, selectedRole)) {
      toast.success('Login berhasil!');
      navigate('/');
    } else {
      toast.error('Login gagal! Periksa email dan password Anda.');
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@kliniksentosa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Pilih Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${selectedRole === role.value
                        ? `${role.color} text-white shadow-md scale-105`
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Masuk
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo: Gunakan email dan password apa saja untuk login
            </p>
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
