
import React from 'react';
import { Client, CartItem, PaymentMethod, Order } from '../types';

interface OrderTicketViewProps {
  client: Client;
  items: CartItem[];
  total: number;
  payment: PaymentMethod;
  onClose: () => void;
}

const OrderTicketView: React.FC<OrderTicketViewProps> = ({ client, items, total, payment, onClose }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPaymentName = (p: PaymentMethod) => {
    switch (p) {
      case 'nequi': return 'Nequi (312 999 8888)';
      case 'tarjeta_debito': return 'Tarjeta Débito (Punto)';
      case 'efectivo': return 'Efectivo';
      default: return p;
    }
  };

  const lastOrder = (() => {
    const rawOrders = localStorage.getItem('origen_orders');
    if (!rawOrders) return null;
    const orders = JSON.parse(rawOrders);
    return orders[orders.length - 1];
  })();

  const qrData = encodeURIComponent(
    `ORIGEN-ORDER|TICKET:${client.ticketCode}|TOTAL:${total}|PAY:${payment}`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}&bgcolor=1a1a1d&color=ff9f1c`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-sm bg-[#1a1a1d] border-t-8 border-[#ff9f1c] shadow-[0_0_100px_rgba(255,159,28,0.4)] rounded-b-3xl overflow-hidden animate-ticket-slide">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[#ff9f1c] italic tracking-tighter uppercase">ORIGEN BURGER</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">¡Pedido Confirmado!</p>
            <div className="inline-block bg-[#ff9f1c] text-black px-4 py-1 rounded font-black text-sm mt-2 shadow-lg">
              TICKET {client.ticketCode}
            </div>
          </div>

          <div className="bg-[#2ec4b6]/10 border border-[#2ec4b6]/30 p-4 rounded-2xl text-center space-y-1">
            <p className="text-[#2ec4b6] font-black text-lg italic uppercase tracking-tighter">¡GRACIAS POR TU COMPRA!</p>
            <p className="text-[9px] text-[#2ec4b6] font-bold uppercase tracking-widest">Es un honor servirte, guerrero.</p>
          </div>

          <div className="border-y border-dashed border-gray-800 py-4 space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
              <span>Cliente:</span>
              <span className="text-white italic">{client.name}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
              <span>Modo:</span>
              <span className="text-white uppercase">{lastOrder?.deliveryType === 'domicilio' ? '🚀 Domicilio' : '📍 Punto Físico'}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
              <span>Pago:</span>
              <span className="text-[#2ec4b6]">{getPaymentName(payment)}</span>
            </div>
          </div>

          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-400 font-bold tracking-tight">
                  {item.quantity}x <span className="text-white uppercase">{item.name}</span>
                </span>
                <span className="text-white font-mono">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-800 pt-4 flex flex-col items-end">
             <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Total del Pedido</span>
             <span className="text-3xl font-black text-white tracking-tighter font-mono italic leading-none">{formatCurrency(total)}</span>
          </div>

          <div className="flex flex-col items-center justify-center pt-4 border-t border-gray-900">
            <div className="p-2 bg-white rounded-xl shadow-inner mb-4">
              <img src={qrUrl} alt="Order QR Code" className="w-24 h-24" />
            </div>
            
            <button 
              onClick={onClose}
              className="w-full bg-[#ff9f1c] hover:bg-white text-black font-black py-4 rounded-xl transition-all shadow-lg uppercase italic text-sm tracking-tighter"
            >
              VOLVER AL MENÚ Y SEGUIR AGREGANDO ➔
            </button>
            <p className="mt-3 text-[8px] text-gray-600 uppercase font-black text-center italic">Conserva este ticket {client.ticketCode} para futuros pedidos</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-2 flex">
           {Array.from({length: 20}).map((_, i) => (
             <div key={i} className="flex-1 h-full bg-[#1a1a1d] rotate-45 transform translate-y-1"></div>
           ))}
        </div>
      </div>

      <style>{`
        @keyframes ticket-slide { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-ticket-slide { animation: ticket-slide 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
    </div>
  );
};

export default OrderTicketView;
