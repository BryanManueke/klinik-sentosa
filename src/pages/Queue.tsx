import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  doctor: string;
}

const Queue = () => {
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 'Q001', patientId: 'P001', patientName: 'Budi Santoso', time: '09:30', status: 'completed', doctor: 'Dr. Sarah' },
    { id: 'Q002', patientId: 'P002', patientName: 'Siti Nurhaliza', time: '10:15', status: 'in-progress', doctor: 'Dr. Ahmad' },
    { id: 'Q003', patientId: 'P003', patientName: 'Ahmad Fauzi', time: '10:45', status: 'waiting', doctor: 'Dr. Sarah' },
    { id: 'Q004', patientId: 'P004', patientName: 'Dewi Lestari', time: '11:00', status: 'waiting', doctor: 'Dr. Ahmad' },
    { id: 'Q005', patientId: 'P005', patientName: 'Rudi Hartono', time: '11:15', status: 'waiting', doctor: 'Dr. Linda' },
  ]);

  const handleStatusChange = (id: string, newStatus: QueueItem['status']) => {
    setQueue(queue.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    ));
    
    const statusMessages = {
      'in-progress': 'Pasien sedang diperiksa',
      'completed': 'Pemeriksaan selesai',
      'cancelled': 'Antrian dibatalkan',
    };
    
    toast.success(statusMessages[newStatus as keyof typeof statusMessages]);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      waiting: 'bg-muted text-muted-foreground',
      'in-progress': 'bg-primary/20 text-primary',
      completed: 'bg-secondary/20 text-secondary',
      cancelled: 'bg-destructive/20 text-destructive',
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      waiting: 'Menunggu',
      'in-progress': 'Sedang Diperiksa',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return labels[status as keyof typeof labels];
  };

  const waitingCount = queue.filter(q => q.status === 'waiting').length;
  const inProgressCount = queue.filter(q => q.status === 'in-progress').length;
  const completedCount = queue.filter(q => q.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Antrian Pasien</h1>
        <p className="text-muted-foreground">Kelola antrian pemeriksaan pasien</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Diperiksa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai Hari Ini</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Antrian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {item.id.slice(-2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.patientId} • {item.time} • {item.doctor}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {item.status === 'waiting' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(item.id, 'in-progress')}
                    >
                      Mulai Periksa
                    </Button>
                  )}
                  {item.status === 'in-progress' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStatusChange(item.id, 'completed')}
                    >
                      Selesai
                    </Button>
                  )}
                  {(item.status === 'waiting' || item.status === 'in-progress') && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusChange(item.id, 'cancelled')}
                    >
                      Batalkan
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Queue;
