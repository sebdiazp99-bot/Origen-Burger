
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';
import RegistrationForm from './components/RegistrationForm';
import MapSection from './components/MapSection';
import AIChatbot from './components/AIChatbot';
import CartDrawer from './components/CartDrawer';
import FloatingBurger from './components/FloatingBurger';
import DartsGame from './components/DartsGame';
import ClientReports from './components/ClientReports';
import OrderTicketView from './components/OrderTicketView';
import OrderTracking from './components/OrderTracking';
import KitchenPanel from './components/KitchenPanel';
import { CartProvider } from './context/CartContext';
import { Client, CartItem, PaymentMethod } from './types';

const AppContent: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDartsOpen, setIsDartsOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{client: Client, items: CartItem[], total: number, payment: PaymentMethod} | null>(null);

  const handleOrderComplete = (client: Client, items: CartItem[], total: number, payment: PaymentMethod) => {
    setOrderSummary({ client, items, total, payment });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1d] text-white pb-20 selection:bg-[#ff9f1c] selection:text-black relative overflow-x-hidden">
      <FloatingBurger />

      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenDarts={() => setIsDartsOpen(true)}
      />
      
      <Dashboard />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* Sistema de Turnos / Rastreo */}
        <OrderTracking />

        <Menu />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 pt-12 border-t border-gray-800">
          <div className="space-y-8">
            <RegistrationForm />
          </div>
          <MapSection />
        </div>

        <ClientReports />
      </main>

      <AIChatbot />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onOrderComplete={handleOrderComplete}
      />

      {isDartsOpen && <DartsGame onClose={() => setIsDartsOpen(false)} />}

      {orderSummary && (
        <OrderTicketView 
          client={orderSummary.client}
          items={orderSummary.items}
          total={orderSummary.total}
          payment={orderSummary.payment}
          onClose={() => setOrderSummary(null)}
        />
      )}

      {/* Acceso oculto para Cocina */}
      <KitchenPanel />

      <footer className="py-12 border-t border-gray-900 mt-20 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 items-center">
            <a 
              href="https://instagram.com/origenburgercol" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">📸</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Instagram</span>
                <span className="text-xs font-bold text-white group-hover:text-[#ff9f1c] transition-colors">@origenburgercol</span>
              </div>
            </a>
            <a 
              href="https://facebook.com/origenburger" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">👤</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">Facebook</span>
                <span className="text-xs font-bold text-white group-hover:text-[#2ec4b6] transition-colors">Origen Burger</span>
              </div>
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black italic mb-2">
              ORIGEN BURGER — Cocina Oculta Premium — {new Date().getFullYear()}
            </p>
            <p className="text-[8px] text-gray-800 uppercase font-bold tracking-widest">
              Calidad Artesanal • Sabor de Origen • Bogotá, Colombia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
