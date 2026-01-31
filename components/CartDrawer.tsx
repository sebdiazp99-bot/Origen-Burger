
import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Client, CartItem, PaymentMethod, Order, DeliveryType } from '../types';
import BurgerWarriorLogo from './BurgerWarriorLogo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (client: Client, items: CartItem[], total: number, payment: PaymentMethod) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderComplete }) => {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('domicilio');
  const [showFidelityAlert, setShowFidelityAlert] = useState(false);

  // Fetch active client
  const activeClient = useMemo(() => {
    const clientId = localStorage.getItem('current_client_id');
    const rawClients = localStorage.getItem('origen_clients');
    if (clientId && rawClients) {
      const clients: Client[] = JSON.parse(rawClients);
      return clients.find(c => c.id === clientId);
    }
    return null;
  }, [isOpen]);

  const isFidelityOrder = useMemo(() => {
    return activeClient && activeClient.purchaseCount === 5;
  }, [activeClient]);

  useEffect(() => {
    if (isOpen && isFidelityOrder) {
      setShowFidelityAlert(true);
    }
  }, [isOpen, isFidelityOrder]);

  const deliveryFee = deliveryType === 'domicilio' ? 7000 : 0;

  const orderCalculations = useMemo(() => {
    let subtotal = totalPrice;
    let discount = 0;
    let appliedDeliveryFee = deliveryFee;
    let prizeMessage = '';

    if (isFidelityOrder) {
      discount = subtotal;
      prizeMessage = '🎁 PREMIO FIDELIDAD: COMBO GRATIS';
    } else if (activeClient?.activePrize) {
      if (activeClient.activePrize.includes('-10%')) {
        discount = subtotal * 0.10;
        prizeMessage = 'Premio Dardo: 10% Descuento Aplicado';
      } else if (activeClient.activePrize.includes('-50%')) {
        discount = subtotal * 0.50;
        prizeMessage = 'Premio Dardo: 50% Descuento Aplicado';
      } else if (activeClient.activePrize.includes('gratis')) {
        appliedDeliveryFee = 0;
        prizeMessage = 'Premio Dardo: Domicilio Gratis';
      }
    }

    return {
      subtotal,
      discount,
      delivery: appliedDeliveryFee,
      finalTotal: Math.max(0, subtotal - discount + appliedDeliveryFee),
      prizeMessage
    };
  }, [totalPrice, activeClient, deliveryFee, isFidelityOrder]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSendOrder = () => {
    const clientId = localStorage.getItem('current_client_id');
    const rawClients = localStorage.getItem('origen_clients');
    
    let finalClient: Client | undefined;

    if (clientId && rawClients) {
      const clients: Client[] = JSON.parse(rawClients);
      const updatedClients = clients.map(c => {
        if (c.id === clientId) {
          const newCount = c.purchaseCount === 5 ? 0 : c.purchaseCount + 1;
          finalClient = { ...c, purchaseCount: newCount, activePrize: undefined };
          return finalClient;
        }
        return c;
      });
      localStorage.setItem('origen_clients', JSON.stringify(updatedClients));
      window.dispatchEvent(new Event('storage'));
    }

    if (!finalClient) {
      alert('Por favor regístrate antes de realizar un pedido para generar tu ticket.');
      return;
    }

    const newOrder: Order = {
      id: crypto.randomUUID(),
      ticketCode: finalClient.ticketCode,
      clientName: finalClient.name,
      items: [...cart],
      total: orderCalculations.finalTotal,
      paymentMethod: paymentMethod,
      deliveryType: deliveryType,
      status: 'En cola', // Sistema de turnos: Inicia en cola
      createdAt: new Date().toISOString()
    };

    const rawOrders = localStorage.getItem('origen_orders');
    const orders: Order[] = rawOrders ? JSON.parse(rawOrders) : [];
    localStorage.setItem('origen_orders', JSON.stringify([...orders, newOrder]));

    onOrderComplete(finalClient, [...cart], orderCalculations.finalTotal, paymentMethod);
    
    clearCart();
    onClose();
    window.dispatchEvent(new Event('storage'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-[#111111] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col h-full animate-slide-in-right border-l border-gray-800">
        
        {showFidelityAlert && (
          <div className="absolute inset-0 z-[110] bg-black/90 flex items-center justify-center p-6 text-center animate-fade-in">
             <div className="space-y-6">
                <BurgerWarriorLogo size="xl" className="mx-auto drop-shadow-[0_0_30px_rgba(255,159,28,0.6)]" />
                <h3 className="text-3xl font-black text-[#ff9f1c] italic tracking-tighter uppercase leading-none">¡HAS GANADO POR TU FIDELIDAD!</h3>
                <p className="text-white text-sm font-bold uppercase tracking-widest leading-relaxed">
                  Has completado 5 pedidos. Tu 6to pedido es <span className="text-[#2ec4b6]">TOTALMENTE GRATIS</span>.<br/>
                  <span className="text-xs text-gray-500 mt-2 block">(Combo: Burger Clásica + Mr. Papitas)</span>
                </p>
                <div className="bg-[#2ec4b6] text-black p-4 rounded-xl font-black italic uppercase text-xs">
                  SOLO DEBES PAGAR EL DOMICILIO: {formatCurrency(7000)}
                </div>
                <button 
                  onClick={() => setShowFidelityAlert(false)}
                  className="bg-[#ff9f1c] text-black w-full py-4 rounded-xl font-black uppercase italic hover:bg-white transition-all"
                >
                  ¡RECLAMAR MI COMBO!
                </button>
             </div>
          </div>
        )}

        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black">
          <div>
            <h2 className="text-2xl font-black text-[#ff9f1c] italic tracking-tighter uppercase">Tu Pedido</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Origen Burger • Cocina Oculta</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#ff9f1c] transition-colors p-2 text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-[#222] rounded-full flex items-center justify-center text-5xl grayscale opacity-30">🛒</div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Tu bolsa está vacía</p>
              <button onClick={onClose} className="bg-[#ff9f1c] text-black px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-white transition-all italic">Explorar Menú</button>
            </div>
          ) : (
            <>
              {orderCalculations.prizeMessage && (
                <div className="bg-[#ff9f1c]/10 border border-[#ff9f1c]/30 p-3 rounded-xl flex items-center space-x-3 animate-pulse">
                  <span className="text-xl">🎁</span>
                  <span className="text-[10px] font-black text-[#ff9f1c] uppercase tracking-widest italic">{orderCalculations.prizeMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Método de Entrega</label>
                <div className="grid grid-cols-2 gap-2 bg-[#1a1a1d] p-1 rounded-2xl border border-gray-800">
                  <button 
                    onClick={() => setDeliveryType('domicilio')}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${deliveryType === 'domicilio' ? 'bg-[#ff9f1c] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    🚀 Domicilio ($7.000)
                  </button>
                  <button 
                    onClick={() => setDeliveryType('punto_fisico')}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase italic transition-all ${deliveryType === 'punto_fisico' ? 'bg-[#ff9f1c] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    📍 Recoger (Gratis)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex space-x-4 bg-[#1a1a1d] p-4 rounded-2xl border border-gray-800 transition-all hover:border-gray-600">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-800">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start text-xs">
                        <h3 className="font-bold text-white uppercase tracking-tight">{item.name}</h3>
                        {!isFidelityOrder && (
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500">Remover</button>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center bg-[#252525] rounded-lg border border-gray-800">
                          <button onClick={() => !isFidelityOrder && updateQuantity(item.id, -1)} className="px-2 py-1 text-[#ff9f1c]" disabled={isFidelityOrder}>-</button>
                          <span className="px-2 text-white text-xs">{item.quantity}</span>
                          <button onClick={() => !isFidelityOrder && updateQuantity(item.id, 1)} className="px-2 py-1 text-[#ff9f1c]" disabled={isFidelityOrder}>+</button>
                        </div>
                        <span className={`font-black text-xs ${isFidelityOrder ? 'text-[#2ec4b6] line-through' : 'text-[#ff9f1c]'}`}>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Método de Pago</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => setPaymentMethod('tarjeta_debito')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${paymentMethod === 'tarjeta_debito' ? 'bg-[#ff9f1c] text-black border-[#ff9f1c]' : 'bg-[#1a1a1d] text-gray-400 border-gray-800'}`}
                  >
                    <span>💳 Tarjeta Débito (Punto Físico)</span>
                    {paymentMethod === 'tarjeta_debito' && <span>✓</span>}
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('nequi')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${paymentMethod === 'nequi' ? 'bg-[#ff9f1c] text-black border-[#ff9f1c]' : 'bg-[#1a1a1d] text-gray-400 border-gray-800'}`}
                  >
                    <div className="flex flex-col items-start">
                      <span>📱 Transferencia NEQUI</span>
                      <span className="text-[8px] opacity-70">312 999 8888</span>
                    </div>
                    {paymentMethod === 'nequi' && <span>✓</span>}
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`flex items-center justify-between p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${paymentMethod === 'efectivo' ? 'bg-[#ff9f1c] text-black border-[#ff9f1c]' : 'bg-[#1a1a1d] text-gray-400 border-gray-800'}`}
                  >
                    <span>💵 Efectivo</span>
                    {paymentMethod === 'efectivo' && <span>✓</span>}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Notas del Pedido</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ej: Sin cebolla..."
                  className="w-full bg-[#1a1a1d] border border-gray-800 rounded-xl p-4 text-xs text-white outline-none focus:border-[#ff9f1c] transition-all h-20"
                />
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-800 bg-black/90 space-y-3">
            <div className="flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span className={isFidelityOrder ? 'line-through' : ''}>{formatCurrency(orderCalculations.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <span>Entrega</span>
              <span className={orderCalculations.delivery === 0 ? 'text-green-500' : 'text-white'}>
                {orderCalculations.delivery === 0 ? 'GRATIS' : formatCurrency(orderCalculations.delivery)}
              </span>
            </div>
            {orderCalculations.discount > 0 && (
              <div className="flex justify-between text-[#2ec4b6] text-[10px] font-black uppercase tracking-widest italic">
                <span>{isFidelityOrder ? 'Regalo Fidelidad' : 'Descuento Aplicado'}</span>
                <span>-{formatCurrency(orderCalculations.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-white pt-2 border-t border-gray-900">
              <span className="font-black uppercase text-xl italic tracking-tighter">Total</span>
              <span className="text-3xl font-black text-[#ff9f1c] tracking-tighter">{formatCurrency(orderCalculations.finalTotal)}</span>
            </div>
            <button 
              className="w-full bg-[#ff9f1c] hover:bg-white text-black font-black py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,159,28,0.2)] uppercase italic tracking-tighter text-xl mt-4"
              onClick={handleSendOrder}
            >
              CONFIRMAR TURNO ➔
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default CartDrawer;
