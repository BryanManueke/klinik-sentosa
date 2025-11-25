import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, DollarSign, Calendar } from 'lucide-react';

interface PrescriptionCardProps {
    prescriptions: any[];
}

export const PrescriptionCard = ({ prescriptions }: PrescriptionCardProps) => {
    if (prescriptions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Resep Obat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Belum ada resep obat.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-500/20 text-yellow-600">Menunggu</Badge>;
            case 'processed':
                return <Badge className="bg-blue-500/20 text-blue-600">Diproses</Badge>;
            case 'paid':
                return <Badge className="bg-green-500/20 text-green-600">Lunas</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Resep Obat
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                        <div key={prescription.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{prescription.date}</span>
                                </div>
                                {getStatusBadge(prescription.status)}
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Obat yang diresepkan:</p>
                                <ul className="space-y-1">
                                    {prescription.items.map((item: any, index: number) => (
                                        <li key={index} className="text-sm">
                                            • {item.medicineName} - {item.amount} {item.instructions ? `(${item.instructions})` : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Total</span>
                                </div>
                                <span className="font-bold">{formatCurrency(prescription.totalPrice)}</span>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Dokter: {prescription.doctorName}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
