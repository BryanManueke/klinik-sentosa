import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Klinik Sentosa',
    address: 'Jl. Raya Airmadidi No. 123, Airmadidi',
    phone: '(0431) 123456',
    email: 'info@kliniksentosa.com',
    operatingHours: '08:00 - 17:00',
    license: 'KL-001/2024',
  });

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola konfigurasi sistem klinik</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Informasi Klinik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Klinik</Label>
              <Input
                id="name"
                value={clinicInfo.name}
                onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license">Nomor Izin</Label>
              <Input
                id="license"
                value={clinicInfo.license}
                onChange={(e) => setClinicInfo({ ...clinicInfo, license: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={clinicInfo.address}
              onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={clinicInfo.phone}
                onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clinicInfo.email}
                onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Jam Operasional</Label>
            <Input
              id="hours"
              value={clinicInfo.operatingHours}
              onChange={(e) => setClinicInfo({ ...clinicInfo, operatingHours: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium text-foreground">Versi Sistem</p>
                <p className="text-sm text-muted-foreground">v1.0.0</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium text-foreground">Database</p>
                <p className="text-sm text-muted-foreground">PostgreSQL 14.5</p>
              </div>
              <Button variant="outline" size="sm">Backup</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium text-foreground">Terakhir Diperbarui</p>
                <p className="text-sm text-muted-foreground">15 Januari 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
