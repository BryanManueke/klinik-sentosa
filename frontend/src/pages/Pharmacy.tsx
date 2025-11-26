import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, Plus, Minus, AlertTriangle, ClipboardList, Check, DollarSign, Search, ArrowUpDown, ShoppingCart, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useData, Prescription, Medicine } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Pharmacy = () => {
  const {
    medicines,
    updateMedicineStock,
    prescriptions,
    markPrescriptionReady,
    dispensePrescription,
    addMedicine,
    deleteMedicine,
    addPrescription,
    patients
  } = useData();

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof medicines[0] | 'status'; direction: 'asc' | 'desc' } | null>(null);

  // Add Medicine State
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Partial<Medicine>>({
    name: '',
    stock: 0,
    minStock: 10,
    unit: 'Tablet',
    price: 0,
    category: 'Umum'
  });

  // Direct Dispense State
  const [isDirectDispenseOpen, setIsDirectDispenseOpen] = useState(false);
  const [directDispenseData, setDirectDispenseData] = useState({
    patientId: '',
    items: [] as { medicineId: string; amount: number; instructions: string }[]
  });
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(1);

  const handleStockChange = (id: string, change: number) => {
    updateMedicineStock(id, change);
  };

  const handlePay = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsPaymentDialogOpen(true);
  };

  const confirmPayment = () => {
    if (selectedPrescription) {
      dispensePrescription(selectedPrescription.id);
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

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.price) {
      toast.error('Nama dan harga obat wajib diisi');
      return;
    }
    addMedicine(newMedicine as Omit<Medicine, 'id'>);
    setIsAddMedicineOpen(false);
    setNewMedicine({ name: '', stock: 0, minStock: 10, unit: 'Tablet', price: 0, category: 'Umum' });
  };

  const handleAddToDirectDispense = () => {
    if (!selectedMedicineId) return;
    const med = medicines.find(m => m.id === selectedMedicineId);
    if (!med) return;

    if (med.stock < selectedAmount) {
      toast.error('Stok tidak mencukupi');
      return;
    }

    setDirectDispenseData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { medicineId: selectedMedicineId, amount: selectedAmount, instructions: 'Langsung' }
      ]
    }));
    setSelectedMedicineId('');
    setSelectedAmount(1);
  };

  const handleRemoveFromDirectDispense = (index: number) => {
    setDirectDispenseData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const submitDirectDispense = () => {
    if (!directDispenseData.patientId) {
      toast.error('Pilih pasien terlebih dahulu');
      return;
    }
    if (directDispenseData.items.length === 0) {
      toast.error('Pilih obat terlebih dahulu');
      return;
    }

    const patient = patients.find(p => p.id === directDispenseData.patientId);
    if (!patient) return;

    addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctorName: 'Apotek (Langsung)',
      items: directDispenseData.items.map(item => {
        const med = medicines.find(m => m.id === item.medicineId);
        return {
          medicineId: item.medicineId,
          medicineName: med?.name || 'Unknown',
          amount: item.amount,
          instructions: item.instructions
        };
      }),
      status: 'ready' // Directly go to payment/ready
    });

    setIsDirectDispenseOpen(false);
    setDirectDispenseData({ patientId: '', items: [] });
  };

  const lowStockMedicines = medicines.filter(m => m.stock <= m.minStock);
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending');
  const processedPrescriptions = prescriptions.filter(p => p.status === 'ready');

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

      // @ts-ignore
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      // @ts-ignore
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Apotek</h1>
          <p className="text-muted-foreground">Kelola stok obat dan transaksi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsDirectDispenseOpen(true)} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Transaksi Langsung
          </Button>
          <Button onClick={() => setIsAddMedicineOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Obat
          </Button>
        </div>
      </div>

      {/* Pending Prescriptions */}
      {pendingPrescriptions.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ClipboardList className="h-5 w-5" />
              Resep Masuk ({pendingPrescriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingPrescriptions.map(prescription => (
                <div key={prescription.id} className="bg-card border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                      <p className="text-sm text-muted-foreground">Dr. {prescription.doctorName}</p>
                    </div>
                    <Button size="sm" onClick={() => markPrescriptionReady(prescription.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Proses
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {prescription.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.medicineName} x {item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Queue */}
      {processedPrescriptions.length > 0 && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <DollarSign className="h-5 w-5" />
              Menunggu Pembayaran ({processedPrescriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {processedPrescriptions.map(prescription => (
                <div key={prescription.id} className="bg-card border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.patientName}</h3>
                      <p className="text-sm text-muted-foreground">Total: Rp {prescription.totalPrice.toLocaleString()}</p>
                    </div>
                    <Button size="sm" onClick={() => handlePay(prescription)} className="bg-green-600 hover:bg-green-700">
                      Bayar
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {prescription.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.medicineName} x {item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Alert */}
      {lowStockMedicines.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Peringatan Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Medicine List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-600" />
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
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer" onClick={() => handleSort('id')}>Kode</th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer" onClick={() => handleSort('name')}>Nama Obat</th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer" onClick={() => handleSort('stock')}>Stok</th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer" onClick={() => handleSort('price')}>Harga</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
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
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Aman</Badge>
                        ) : (
                          <Badge variant="destructive">Rendah</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleStockChange(med.id, 10)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleStockChange(med.id, -1)} disabled={med.stock === 0}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteMedicine(med.id)}>
                            <Trash2 className="h-3 w-3" />
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

      {/* Add Medicine Dialog */}
      <Dialog open={isAddMedicineOpen} onOpenChange={setIsAddMedicineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Obat Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nama Obat</Label>
              <Input
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                placeholder="Contoh: Paracetamol 500mg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stok Awal</Label>
                <Input
                  type="number"
                  value={newMedicine.stock}
                  onChange={(e) => setNewMedicine({ ...newMedicine, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Satuan</Label>
                <Input
                  value={newMedicine.unit}
                  onChange={(e) => setNewMedicine({ ...newMedicine, unit: e.target.value })}
                  placeholder="Tablet/Botol"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Harga (Rp)</Label>
                <Input
                  type="number"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Min. Stok</Label>
                <Input
                  type="number"
                  value={newMedicine.minStock}
                  onChange={(e) => setNewMedicine({ ...newMedicine, minStock: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMedicineOpen(false)}>Batal</Button>
            <Button onClick={handleAddMedicine}>Simpan Obat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Direct Dispense Dialog */}
      <Dialog open={isDirectDispenseOpen} onOpenChange={setIsDirectDispenseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaksi Langsung (Tanpa Resep)</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Pilih Pasien</Label>
              <Select onValueChange={(val) => setDirectDispenseData({ ...directDispenseData, patientId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Cari nama pasien..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} - {p.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
              <h4 className="font-medium text-sm">Tambah Item Obat</h4>
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Obat</Label>
                  <Select value={selectedMedicineId} onValueChange={setSelectedMedicineId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih obat..." />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} (Sisa: {m.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24 space-y-2">
                  <Label>Jumlah</Label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button onClick={handleAddToDirectDispense}>Tambah</Button>
              </div>
            </div>

            {directDispenseData.items.length > 0 && (
              <div className="space-y-2">
                <Label>Daftar Item</Label>
                <div className="border rounded-lg divide-y">
                  {directDispenseData.items.map((item, idx) => {
                    const med = medicines.find(m => m.id === item.medicineId);
                    return (
                      <div key={idx} className="flex justify-between items-center p-3 text-sm">
                        <span>{med?.name} x {item.amount}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">Rp {((med?.price || 0) * item.amount).toLocaleString()}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveFromDirectDispense(idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="p-3 bg-muted/50 flex justify-between font-medium">
                    <span>Total Estimasi</span>
                    <span>Rp {directDispenseData.items.reduce((sum, item) => {
                      const med = medicines.find(m => m.id === item.medicineId);
                      return sum + ((med?.price || 0) * item.amount);
                    }, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDirectDispenseOpen(false)}>Batal</Button>
            <Button onClick={submitDirectDispense} disabled={directDispenseData.items.length === 0 || !directDispenseData.patientId}>
              Proses Transaksi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pembayaran Resep</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Order Summary */}
            <div className="space-y-4 border-r pr-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">Ringkasan Pesanan</h3>
                <p className="text-sm text-muted-foreground">Pasien: {selectedPrescription?.patientName}</p>
                <p className="text-sm text-muted-foreground">ID: {selectedPrescription?.id}</p>
              </div>

              <div className="border rounded-lg p-3 bg-muted/30 space-y-2 max-h-[300px] overflow-y-auto">
                {selectedPrescription?.items.map((item, idx) => {
                  const med = medicines.find(m => m.id === item.medicineId);
                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.medicineName} x {item.amount}</span>
                      <span className="font-medium">Rp {((med?.price || 0) * item.amount).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold text-lg">Total Tagihan</span>
                <span className="font-bold text-2xl text-primary">Rp {selectedPrescription?.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Metode Pembayaran</h3>

              <Tabs defaultValue="cash" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="cash">Tunai</TabsTrigger>
                  <TabsTrigger value="transfer">Transfer</TabsTrigger>
                  <TabsTrigger value="qris">QRIS</TabsTrigger>
                </TabsList>

                <TabsContent value="cash" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Jumlah Uang Diterima</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                      <Input
                        type="number"
                        className="pl-10 text-lg"
                        placeholder="0"
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          // Calculate change logic could be added here if we had state for it
                          // For now just visual input
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 dark:text-green-400 font-medium">Kembalian</span>
                      <span className="text-xl font-bold text-green-700 dark:text-green-400">Rp 0</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transfer" className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">BCA</div>
                      <div>
                        <p className="font-medium">Klinik Sentosa</p>
                        <p className="text-sm text-muted-foreground">8830-1234-5678</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Salin</Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs">MANDIRI</div>
                      <div>
                        <p className="font-medium">Klinik Sentosa</p>
                        <p className="text-sm text-muted-foreground">123-00-9876543-2</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Salin</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Bukti Transfer</Label>
                    <Input type="file" />
                  </div>
                </TabsContent>

                <TabsContent value="qris" className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-white dark:bg-black">
                    <div className="h-48 w-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      {/* Placeholder for QR Code */}
                      <div className="text-center">
                        <div className="grid grid-cols-4 gap-1 mb-2">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className={`h-3 w-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                          ))}
                        </div>
                        <span className="text-xs font-mono">QRIS SCAN</span>
                      </div>
                    </div>
                    <p className="font-medium">Scan QRIS untuk membayar</p>
                    <p className="text-sm text-muted-foreground">NMID: ID102003004005</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Stok obat akan otomatis berkurang
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Batal</Button>
              <Button onClick={confirmPayment} className="bg-green-600 hover:bg-green-700 w-32">
                Bayar Lunas
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pharmacy;
