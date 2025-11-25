import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar } from 'lucide-react';

interface MedicalRecordsCardProps {
    records: any[];
}

export const MedicalRecordsCard = ({ records }: MedicalRecordsCardProps) => {
    if (records.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Riwayat Pemeriksaan
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Belum ada riwayat pemeriksaan.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Riwayat Pemeriksaan
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {records.slice(0, 5).map((record) => (
                        <div key={record.id} className="border-l-4 border-primary pl-4 py-2">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium">{record.diagnosis}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {record.date}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                                <span className="font-medium">Keluhan:</span> {record.complaint}
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                                <span className="font-medium">Pengobatan:</span> {record.treatment}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Dokter: {record.doctorName}
                            </p>
                        </div>
                    ))}
                    {records.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                            Dan {records.length - 5} riwayat lainnya...
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
