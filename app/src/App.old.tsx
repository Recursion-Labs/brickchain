'use client';

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from '@/components/ui/toast-context';

// Import pages
import LandingPage from './pages/landing';
import Dashboard from './components/Dashboard';
import RegisterProperty from './components/RegisterProperty';
import TokenizeProperty from './components/TokenizeProperty';
import TransferTokens from './components/TransferTokens';
import VerifyOwnership from './components/VerifyOwnership';
import NotFound from './pages/404';
import WalletConnectionTest from "./components/WalletConnectionTest";


const queryClient = new QueryClient();



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterProperty />} />
            <Route path="/tokenize" element={<TokenizeProperty />} />
            <Route path="/transfer" element={<TransferTokens />} />
            <Route path="/verify" element={<VerifyOwnership />} />
            <Route path="/wallet-test" element={<WalletConnectionTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 