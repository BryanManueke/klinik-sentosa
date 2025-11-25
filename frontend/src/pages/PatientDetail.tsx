import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, FileText, Pill, Calendar } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const PatientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getPatient, medicalRecords, prescriptions } = useData();

    const patient = id ? getPatient(id) : null;

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h2 className="text-2xl font-bold">Pasien tidak ditemukan</h2>
                <Button onClick={() => navigate('/patients')}>Kembali ke Daftar Pasien</Button>
            </div>
        );
    }

    const patientRecords = medicalRecords.filter(r => r.patientId === patient.id);
    const patientPrescriptions = prescriptions.filter(p => p.patientId === patient.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Detail Pasien</h1>
                    <p className="text-muted-foreground">Informasi lengkap dan riwayat medis</p>
                </div>
            </div>

            {/* Patient Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Identitas Pasien
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">ID Pasien</p>
                            <p className="font-semibold text-lg">{patient.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                            <p className="font-semibold text-lg">{patient.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Umur</p>
                            <p className="font-semibold text-lg">{patient.age} tahun</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                            <p className="font-semibold text-lg">{patient.gender}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">No. Telepon</p>
                            <p className="font-semibold text-lg">{patient.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Alamat</p>
                            <p className="font-semibold text-lg">{patient.address}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Medical History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-accent" />
                            Riwayat Pemeriksaan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {patientRecords.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Belum ada riwayat pemeriksaan.</p>
                            ) : (
                                patientRecords.map((record) => (
                                    <div key={record.id} className="border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold text-foreground">{record.date}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">Dr. {record.doctorName}</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium text-muted-foreground">Keluhan:</span>
                                                <p className="text-foreground">{record.complaint}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Diagnosis:</span>
                                                <p className="text-foreground">{record.diagnosis}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Tindakan/Resep:</span>
                                                <p className="text-foreground">{record.treatment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Prescription History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-medical-green" />
                            Riwayat Resep Obat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {patientPrescriptions.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Belum ada riwayat resep.</p>
                            ) : (
                                patientPrescriptions.map((prescription) => (
                                    <div key={prescription.id} className="border rounded-lg p-4 bg-card hover:bg-medical-green/5 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-semibold text-foreground">{prescription.date}</p>
                                                <p className="text-sm text-muted-foreground">Dr. {prescription.doctorName}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${prescription.status === 'processed'
                                                    ? 'bg-green-500/20 text-green-600'
                                                    : 'bg-yellow-500/20 text-yellow-600'
                                                }`}>
                                                {prescription.status === 'processed' ? 'Sudah Diambil' : 'Menunggu'}
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {prescription.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm border-b border-dashed pb-1 last:border-0 last:pb-0">
                                                    <span>{item.medicineName} x {item.amount}</span>
                                                    <span className="text-muted-foreground italic">{item.instructions}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PatientDetail;
