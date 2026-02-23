import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import AnimatedPage from "@/components/AnimatedPage";
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

const screenVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.04 },
};

function AppContent() {
  const { screen } = useApp();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {screen === 'onboarding' && (
        <motion.div
          key="onboarding"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Onboarding />
        </motion.div>
      )}
      {screen === 'pin' && (
        <motion.div
          key="pin"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <PinScreen />
        </motion.div>
      )}
      {screen === 'splash' && (
        <motion.div key="splash">
          <SplashScreen />
        </motion.div>
      )}
      {screen === 'app' && (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Navbar />
          <main className="pt-14 pb-16 sm:pb-0 min-h-screen">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
                <Route path="/orders/new" element={<AnimatedPage><OrderForm /></AnimatedPage>} />
                <Route path="/orders/:id" element={<AnimatedPage><OrderDetail /></AnimatedPage>} />
                <Route path="/orders/:id/edit" element={<AnimatedPage><OrderForm /></AnimatedPage>} />
                <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
                <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
              </Routes>
            </AnimatePresence>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
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
