import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pill, Plus, Minus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Medicine {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
}

const Pharmacy = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 'M001', name: 'Paracetamol 500mg', stock: 150, minStock: 50, unit: 'Tablet', price: 500 },
    { id: 'M002', name: 'Amoxicillin 500mg', stock: 80, minStock: 30, unit: 'Kapsul', price: 2000 },
    { id: 'M003', name: 'Vitamin C 1000mg', stock: 200, minStock: 50, unit: 'Tablet', price: 1500 },
    { id: 'M004', name: 'OBH Sirup', stock: 25, minStock: 20, unit: 'Botol', price: 15000 },
    { id: 'M005', name: 'Betadine', stock: 40, minStock: 20, unit: 'Botol', price: 25000 },
  ]);

  const handleStockChange = (id: string, change: number) => {
    setMedicines(medicines.map(med =>
      med.id === id ? { ...med, stock: Math.max(0, med.stock + change) } : med
    ));
    toast.success(change > 0 ? 'Stok ditambahkan' : 'Stok dikurangi');
  };

  const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manajemen Apotek</h1>
        <p className="text-muted-foreground">Kelola stok obat dan inventory</p>
      </div>

      {lowStockMedicines.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Peringatan Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockMedicines.map(med => (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                  <div>
                    <p className="font-medium text-foreground">{med.name}</p>
                    <p className="text-sm text-muted-foreground">Sisa: {med.stock} {med.unit}</p>
                  </div>
                  <Badge variant="destructive">Stok Rendah</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-medical-green" />
              Daftar Obat
            </CardTitle>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Obat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Kode</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Nama Obat</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Stok</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Harga</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{med.id}</td>
                    <td className="p-4 text-foreground">{med.name}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{med.stock} {med.unit}</p>
                        <p className="text-xs text-muted-foreground">Min: {med.minStock}</p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">Rp {med.price.toLocaleString()}</td>
                    <td className="p-4">
                      {med.stock > med.minStock ? (
                        <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30">Aman</Badge>
                      ) : (
                        <Badge variant="destructive">Rendah</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockChange(med.id, 10)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          +10
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockChange(med.id, -1)}
                          disabled={med.stock === 0}
                        >
                          <Minus className="h-3 w-3 mr-1" />
                          -1
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pharmacy;
