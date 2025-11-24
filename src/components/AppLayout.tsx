import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, roles } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  Stethoscope,
  Pill,
  UserCog,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [roles.ADMIN, roles.DOCTOR, roles.NURSE, roles.PHARMACY, roles.OWNER, roles.PATIENT] },
    { name: 'Pasien', href: '/patients', icon: Users, roles: [roles.ADMIN, roles.OWNER] },
    { name: 'Antrian', href: '/queue', icon: Clock, roles: [roles.ADMIN, roles.DOCTOR, roles.NURSE] },
    { name: 'Pemeriksaan', href: '/examination', icon: Stethoscope, roles: [roles.DOCTOR] },
    { name: 'Apotek', href: '/pharmacy', icon: Pill, roles: [roles.PHARMACY, roles.ADMIN, roles.DOCTOR] },
    { name: 'Staff', href: '/staff', icon: UserCog, roles: [roles.OWNER, roles.ADMIN] },
    { name: 'Laporan', href: '/reports', icon: FileText, roles: [roles.OWNER, roles.ADMIN] },
    { name: 'Pengaturan', href: '/settings', icon: Settings, roles: [roles.OWNER, roles.ADMIN] },
  ];

  const filteredNav = navigation.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Klinik Sentosa</h1>
              <p className="text-xs text-muted-foreground">Sistem Manajemen Klinik</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <nav className="flex flex-col gap-1 p-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-colors duration-200
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
