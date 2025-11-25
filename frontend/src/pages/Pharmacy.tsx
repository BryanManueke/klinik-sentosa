import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Plus, Minus, AlertTriangle, ClipboardList, Check, DollarSign, Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useData, Prescription } from '@/contexts/DataContext';
import { toast } from 'sonner';

const Pharmacy = () => {
  const { medicines, updateMedicineStock, prescriptions, processPrescription, payPrescription } = useData();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof medicines[0] | 'status'; direction: 'asc' | 'desc' } | null>(null);

  const handleStockChange = (id: string, change: number) => {
    updateMedicineStock(id, change);
  };

  const handlePay = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsPaymentDialogOpen(true);
  };

  const confirmPayment = () => {
    if (selectedPrescription) {
      payPrescription(selectedPrescription.id);
      setIsPaymentDialogOpen(false);
      setSelectedPrescription(null);
    }
  };

  const handleSort = (key: keyof typeof medicines[0] | 'status') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const processedPrescriptions = prescriptions.filter(p => p.status === 'processed');

  const filteredMedicines = [...medicines]
    .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const { key, direction } = sortConfig;

      if (key === 'status') {
        const statusA = a.stock > a.minStock ? 'Aman' : 'Rendah';
        const statusB = b.stock > b.minStock ? 'Aman' : 'Rendah';
        if (statusA < statusB) return direction === 'asc' ? -1 : 1;
        if (statusA > statusB) return direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Apotek</h1>
          <p className="text-muted-foreground">Kelola stok obat dan resep masuk</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Obat
        </Button>
      </div>

      {pendingPrescriptions.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ClipboardList className="h-5 w-5" />
              Resep Masuk ({pendingPrescriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPrescriptions.map(prescription => (
                <div key={prescription.id} className="bg-card border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                      <p className="text-sm text-muted-foreground">Dr. {prescription.doctorName} • {prescription.date}</p>
                    </div>
                    <Button size="sm" onClick={() => processPrescription(prescription.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Proses Resep
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {prescription.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-1 last:border-0">
                        <span>{item.medicineName} x {item.amount}</span>
                        <span className="text-muted-foreground">{item.instructions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {processedPrescriptions.length > 0 && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <DollarSign className="h-5 w-5" />
              Menunggu Pembayaran ({processedPrescriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedPrescriptions.map(prescription => (
                <div key={prescription.id} className="bg-card border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                      <p className="text-sm text-muted-foreground">Total: Rp {prescription.totalPrice.toLocaleString()}</p>
                    </div>
                    <Button size="sm" onClick={() => handlePay(prescription)} className="bg-green-600 hover:bg-green-700">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Bayar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {prescription.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm border-b pb-1 last:border-0">
                        <span>{item.medicineName} x {item.amount}</span>
                        <span className="text-muted-foreground">{item.instructions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground mb-4">Total Tagihan</p>
            <p className="text-center text-4xl font-bold text-green-600">
              Rp {selectedPrescription?.totalPrice.toLocaleString()}
            </p>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Pasien: {selectedPrescription?.patientName}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Batal</Button>
            <Button onClick={confirmPayment} className="bg-green-600 hover:bg-green-700">Konfirmasi Lunas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari obat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">Kode <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">Nama Obat <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('stock')}>
                    <div className="flex items-center gap-1">Stok <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">Harga <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      Tidak ada obat yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((med) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pharmacy;
