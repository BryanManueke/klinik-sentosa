import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Save, Building2, User, Bell, Shield, Database, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  const [clinicInfo, setClinicInfo] = useState({
    name: 'Klinik Sentosa',
    address: 'Jl. Raya Airmadidi No. 123, Airmadidi',
    phone: '(0431) 123456',
    email: 'info@kliniksentosa.com',
    operatingHours: '08:00 - 17:00',
    license: 'KL-001/2024',
  });

  const [profileInfo, setProfileInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    position: user?.role || ''
  });

  const [notifications, setNotifications] = useState({
    emailNotif: true,
    smsNotif: false,
    queueAlert: true,
    lowStockAlert: true,
    appointmentReminder: true
  });

  const [theme, setTheme] = useState('light');

  const handleSaveClinic = () => {
    toast.success('Informasi klinik berhasil disimpan!');
  };

  const handleSaveProfile = () => {
    toast.success('Profil berhasil diperbarui!');
  };

  const handleSaveNotifications = () => {
    toast.success('Pengaturan notifikasi berhasil disimpan!');
  };

  const handleBackup = () => {
    toast.success('Backup database sedang diproses...');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SettingsIcon className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Pengaturan</h1>
              </div>
              <p className="text-white/90 text-lg">Kelola konfigurasi sistem klinik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="clinic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-14">
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Klinik</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sistem</span>
          </TabsTrigger>
        </TabsList>

        {/* Clinic Settings */}
        <TabsContent value="clinic">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                Informasi Klinik
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinic-name">Nama Klinik *</Label>
                  <Input
                    id="clinic-name"
                    value={clinicInfo.name}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Nomor Izin *</Label>
                  <Input
                    id="license"
                    value={clinicInfo.license}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, license: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Input
                  id="address"
                  value={clinicInfo.address}
                  onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    value={clinicInfo.phone}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clinicInfo.email}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Jam Operasional *</Label>
                  <Input
                    id="hours"
                    value={clinicInfo.operatingHours}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, operatingHours: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveClinic} size="lg" className="gap-2">
                  <Save className="h-5 w-5" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-purple-600" />
                Profil Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-muted/50 rounded-xl">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.role}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Nama Lengkap *</Label>
                  <Input
                    id="profile-name"
                    value={profileInfo.name}
                    onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-position">Jabatan</Label>
                  <Input
                    id="profile-position"
                    value={profileInfo.position}
                    disabled
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email *</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={profileInfo.email}
                    onChange={(e) => setProfileInfo({ ...profileInfo, email: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Nomor Telepon</Label>
                  <Input
                    id="profile-phone"
                    value={profileInfo.phone}
                    onChange={(e) => setProfileInfo({ ...profileInfo, phone: e.target.value })}
                    className="h-12"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} size="lg" className="gap-2">
                  <Save className="h-5 w-5" />
                  Simpan Profil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Bell className="h-6 w-6 text-orange-600" />
                Preferensi Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Notifikasi Email</p>
                    <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotif}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotif: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Notifikasi SMS</p>
                    <p className="text-sm text-muted-foreground">Terima notifikasi melalui SMS</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotif}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotif: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Alert Antrian</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat ada pasien baru dalam antrian</p>
                  </div>
                  <Switch
                    checked={notifications.queueAlert}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, queueAlert: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Alert Stok Rendah</p>
                    <p className="text-sm text-muted-foreground">Notifikasi saat stok obat menipis</p>
                  </div>
                  <Switch
                    checked={notifications.lowStockAlert}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, lowStockAlert: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Pengingat Janji Temu</p>
                    <p className="text-sm text-muted-foreground">Reminder untuk appointment pasien</p>
                  </div>
                  <Switch
                    checked={notifications.appointmentReminder}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminder: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} size="lg" className="gap-2">
                  <Save className="h-5 w-5" />
                  Simpan Preferensi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Ubah Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">Pastikan password Anda kuat dan unik</p>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Password saat ini" className="h-12" />
                    <Input type="password" placeholder="Password baru" className="h-12" />
                    <Input type="password" placeholder="Konfirmasi password baru" className="h-12" />
                  </div>
                  <Button className="mt-4">Ubah Password</Button>
                </div>

                <div className="p-6 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 rounded-xl">
                  <h3 className="font-semibold text-lg mb-2">Zona Bahaya</h3>
                  <p className="text-sm text-muted-foreground mb-4">Tindakan berikut tidak dapat dibatalkan</p>
                  <Button variant="destructive">Hapus Semua Data</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Database className="h-6 w-6 text-green-600" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Versi Sistem</p>
                    <p className="text-sm text-muted-foreground">v1.0.0</p>
                  </div>
                  <Button variant="outline">Check Update</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Database</p>
                    <p className="text-sm text-muted-foreground">JSON Server</p>
                  </div>
                  <Button variant="outline" onClick={handleBackup}>Backup Data</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Terakhir Diperbarui</p>
                    <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-white to-muted/20 dark:from-background dark:to-muted/10">
                  <div>
                    <p className="font-semibold">Mode Tema</p>
                    <p className="text-sm text-muted-foreground">Pilih tema tampilan</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
