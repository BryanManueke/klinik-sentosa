import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, FileText } from 'lucide-react';

interface QueueStatusCardProps {
    queueData: any[];
}

export const QueueStatusCard = ({ queueData }: QueueStatusCardProps) => {
    const activeQueue = queueData.find(q => q.status === 'waiting' || q.status === 'in-progress');

    if (!activeQueue) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Status Antrian Anda
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground text-lg">Anda tidak sedang dalam antrian.</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Silahkan daftar ke resepsionis untuk mendaftar.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'waiting':
                return <Badge className="bg-yellow-500/20 text-yellow-600">Menunggu</Badge>;
            case 'in-progress':
                return <Badge className="bg-blue-500/20 text-blue-600">Sedang Diperiksa</Badge>;
            case 'completed':
                return <Badge className="bg-green-500/20 text-green-600">Selesai</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Status Antrian Anda
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Nomor Antrian</p>
                        <p className="text-2xl font-bold">{activeQueue.id}</p>
                    </div>
                    {getStatusBadge(activeQueue.status)}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Dokter</p>
                            <p className="font-medium">{activeQueue.doctor}</p>
                        </div>
                    </div>

                    {activeQueue.complaint && (
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Keluhan</p>
                                <p className="font-medium">{activeQueue.complaint}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Waktu Daftar</p>
                            <p className="font-medium">{activeQueue.time}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
