import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Onboarding from "@/pages/Onboarding";
import PinScreen from "@/pages/PinScreen";
import SplashScreen from "@/pages/SplashScreen";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import OrderForm from "@/pages/OrderForm";
import OrderDetail from "@/pages/OrderDetail";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { screen } = useApp();

  if (screen === 'onboarding') return <Onboarding />;
  if (screen === 'pin') return <PinScreen />;
  if (screen === 'splash') return <SplashScreen />;

  return (
    <>
      <Navbar />
      <main className="pt-14 pb-16 sm:pb-0 min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/:id/edit" element={<OrderForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
