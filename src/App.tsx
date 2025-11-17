import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleGuard } from "@/components/RoleGuard";
import { AppLayout } from "@/components/AppLayout";
import { roles } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Queue from "./pages/Queue";
import Examination from "./pages/Examination";
import Pharmacy from "./pages/Pharmacy";
import Staff from "./pages/Staff";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <RoleGuard allowedRoles={[roles.ADMIN, roles.DOCTOR, roles.NURSE, roles.PHARMACY, roles.OWNER]}>
                  <AppLayout><Dashboard /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/patients"
              element={
                <RoleGuard allowedRoles={[roles.ADMIN, roles.OWNER]}>
                  <AppLayout><Patients /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/queue"
              element={
                <RoleGuard allowedRoles={[roles.ADMIN, roles.DOCTOR, roles.NURSE]}>
                  <AppLayout><Queue /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/examination"
              element={
                <RoleGuard allowedRoles={[roles.DOCTOR]}>
                  <AppLayout><Examination /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/pharmacy"
              element={
                <RoleGuard allowedRoles={[roles.PHARMACY, roles.ADMIN]}>
                  <AppLayout><Pharmacy /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/staff"
              element={
                <RoleGuard allowedRoles={[roles.OWNER, roles.ADMIN]}>
                  <AppLayout><Staff /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/reports"
              element={
                <RoleGuard allowedRoles={[roles.OWNER, roles.ADMIN]}>
                  <AppLayout><Reports /></AppLayout>
                </RoleGuard>
              }
            />
            
            <Route
              path="/settings"
              element={
                <RoleGuard allowedRoles={[roles.OWNER, roles.ADMIN]}>
                  <AppLayout><Settings /></AppLayout>
                </RoleGuard>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
