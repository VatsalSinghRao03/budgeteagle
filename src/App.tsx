
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { BillProvider } from "@/contexts/BillContext";

import MainLayout from "@/components/Layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Bills from "./pages/Bills";
import SubmitBill from "./pages/SubmitBill";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import Budgets from "./pages/Budgets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <BillProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/submit-bill" element={<SubmitBill />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/budgets" element={<Budgets />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BillProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
