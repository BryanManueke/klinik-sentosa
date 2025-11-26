import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, Users, Activity, XCircle, Play, StopCircle, UserCheck, ClipboardList, Bell, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

const Queue = () => {
  const { queue, updateQueueStatus, patients } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const handleStatusChange = (id: string, newStatus: 'waiting' | 'in-progress' | 'completed' | 'cancelled') => {
    updateQueueStatus(id, newStatus);

    const statusMessages = {
      'in-progress': 'Pasien sedang diperiksa',
      'completed': 'Pemeriksaan selesai',
      'cancelled': 'Antrian dibatalkan',
      'waiting': 'Pasien kembali ke antrian'
    };

    toast.success(statusMessages[newStatus]);

    if (newStatus === 'in-progress') {
      const item = queue.find(q => q.id === id);
      if (item) {
        navigate(`/examination?patientId=${item.patientId}`);
      }
    }
  };

  const waitingQueue = queue.filter(q => q.status === 'waiting');
  const inProgressQueue = queue.filter(q => q.status === 'in-progress');
  const completedQueue = queue.filter(q => q.status === 'completed');
  const cancelledQueue = queue.filter(q => q.status === 'cancelled');

  const getPatientInfo = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  const QueueCard = ({ item, showActions = true }: any) => {
    const patient = getPatientInfo(item.patientId);
    const queueNumber = item.id.replace('Q', '');

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {/* Queue Number */}
              <div className={`h-16 w-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg ${item.status === 'waiting' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                item.status === 'in-progress' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  item.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                <span className="text-xs opacity-80">No.</span>
                <span className="text-2xl">{queueNumber}</span>
              </div>

              {/* Patient Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{item.patientName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {item.patientId}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <UserCheck className="h-3 w-3" />
                    {item.doctor}
                  </p>
                  {item.complaint && (
                    <p className="flex items-center gap-2">
                      <ClipboardList className="h-3 w-3" />
                      {item.complaint}
                    </p>
                  )}
                  {patient && (
                    <p className="text-xs">
                      {patient.age} tahun • {patient.gender} • {patient.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <Badge className={`
              ${item.status === 'waiting' ? 'bg-orange-500' : ''}
              ${item.status === 'in-progress' ? 'bg-blue-600' : ''}
              ${item.status === 'completed' ? 'bg-green-600' : ''}
              ${item.status === 'cancelled' ? 'bg-gray-600' : ''}
            `}>
              {item.status === 'waiting' ? '⏳ Menunggu' :
                item.status === 'in-progress' ? '🩺 Diperiksa' :
                  item.status === 'completed' ? '✓ Selesai' : '✕ Batal'}
            </Badge>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2 mt-4 pt-4 border-t">
              {item.status === 'waiting' && (
                <>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(item.id, 'in-progress')}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Mulai Periksa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleStatusChange(item.id, 'cancelled')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
              {item.status === 'in-progress' && (
                <>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/examination?patientId=${item.patientId}`)}
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Periksa
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(item.id, 'completed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selesai
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(item.id, 'waiting')}
                  >
                    <StopCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
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
                <Activity className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Antrian Pasien</h1>
              </div>
              <p className="text-white/90 text-lg">Manajemen antrian pemeriksaan real-time</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-white/70">Total Antrian Hari Ini</p>
                <p className="text-5xl font-black">{queue.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background border-2 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Menunggu
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-orange-600">{waitingQueue.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pasien dalam antrian</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-2 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sedang Diperiksa
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-blue-600">{inProgressQueue.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pasien dalam pemeriksaan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selesai
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-600">{completedQueue.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pemeriksaan selesai</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/20 dark:to-background border-2 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dibatalkan
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-600">{cancelledQueue.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Antrian dibatalkan</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="all" className="text-sm">
            Semua ({queue.length})
          </TabsTrigger>
          <TabsTrigger value="waiting" className="text-sm">
            Menunggu ({waitingQueue.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="text-sm">
            Diperiksa ({inProgressQueue.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-sm">
            Selesai ({completedQueue.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-sm">
            Batal ({cancelledQueue.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {queue.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Activity className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada antrian</h3>
                <p className="text-muted-foreground">Belum ada pasien dalam antrian hari ini</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {queue.map(item => <QueueCard key={item.id} item={item} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
          {waitingQueue.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada antrian menunggu</h3>
                <p className="text-muted-foreground">Semua pasien sudah dipanggil</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {waitingQueue.map(item => <QueueCard key={item.id} item={item} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressQueue.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada pemeriksaan berlangsung</h3>
                <p className="text-muted-foreground">Belum ada pasien yang sedang diperiksa</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {inProgressQueue.map(item => <QueueCard key={item.id} item={item} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQueue.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Belum ada pemeriksaan selesai</h3>
                <p className="text-muted-foreground">Pemeriksaan yang selesai akan muncul di sini</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedQueue.map(item => <QueueCard key={item.id} item={item} showActions={false} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledQueue.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <XCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada antrian dibatalkan</h3>
                <p className="text-muted-foreground">Antrian yang dibatalkan akan muncul di sini</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cancelledQueue.map(item => <QueueCard key={item.id} item={item} showActions={false} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Next Patient Alert */}
      {waitingQueue.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-2 border-orange-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Bell className="h-7 w-7 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Pasien Selanjutnya</h3>
                  <p className="text-sm text-muted-foreground">
                    {waitingQueue[0].patientName} - No. {waitingQueue[0].id.replace('Q', '')}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => handleStatusChange(waitingQueue[0].id, 'in-progress')}
              >
                <Play className="h-5 w-5 mr-2" />
                Panggil Pasien
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Queue;
