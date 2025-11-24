import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { roles, Role } from '@/contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [selectedRole, setSelectedRole] = useState<Role>(roles.PATIENT); // Default role
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password tidak cocok!');
            return;
        }

        // Mock registration logic
        console.log('Registering:', { ...formData, role: selectedRole });
        toast.success('Registrasi berhasil! Silakan login.');
        navigate('/login');
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
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Nama Lengkap Anda"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                            Daftar
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
