import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCog, Pencil, Trash2 } from 'lucide-react';
import { Staff } from '@/contexts/DataContext';

interface StaffListProps {
    staff: Staff[];
    onEdit: (staff: Staff) => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (id: string, status: 'active' | 'inactive') => void;
}

export const StaffList = ({ staff, onEdit, onDelete, onUpdateStatus }: StaffListProps) => {
    if (staff.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-muted/10">
                <p className="text-muted-foreground text-lg">Tidak ada staff yang ditemukan.</p>
                <p className="text-sm text-muted-foreground mt-1">Coba kata kunci pencarian lain atau tambahkan staff baru.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => (
                <Card key={member.id} className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <CardTitle className="text-base">{member.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{member.id}</p>
                                </div>
                            </div>
                            <Badge
                                variant={member.status === 'active' ? 'default' : 'secondary'}
                                className={member.status === 'active' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' : ''}
                            >
                                {member.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{member.role}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Email: {member.email}</p>
                            <p className="text-xs text-muted-foreground">Telp: {member.phone}</p>
                        </div>
                        <div className="pt-3 flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => onUpdateStatus(member.id, member.status === 'active' ? 'inactive' : 'active')}
                            >
                                {member.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onEdit(member)}>
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(member.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
