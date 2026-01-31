
import React, { useState, useEffect, useMemo } from 'react';
import { Order } from '../types';

const OrderTracking: React.FC = () => {
  const [ticketInput, setTicketInput] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [ordersAhead, setOrdersAhead] = useState(0);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const rawOrders = localStorage.getItem('origen_orders');
    if (!rawOrders) {
      setError('No hay pedidos activos.');
      return;
    }

    const orders: Order[] = JSON.parse(rawOrders);
    const formattedCode = ticketInput.startsWith('#') ? ticketInput : `#${ticketInput.padStart(4, '0')}`;
    
    // Buscamos el pedido más reciente para ese ticket que no esté entregado
    const found = orders.reverse().find(o => o.ticketCode === formattedCode && o.status !== 'Entregado');

    if (found) {
      setActiveOrder(found);
      setError('');
      calculateOrdersAhead(found, orders);
    } else {
      setActiveOrder(null);
      setError('Ticket no encontrado o ya fue entregado.');
    }
  };

  const calculateOrdersAhead = (myOrder: Order, allOrders: Order[]) => {
    // Órdenes que están "En cola" y se crearon antes que la mía
    const ahead = allOrders.filter(o => 
      o.status === 'En cola' && 
      new Date(o.createdAt).getTime() < new Date(myOrder.createdAt).getTime()
    ).length;
    setOrdersAhead(ahead);
  };

  // Escuchar cambios de estado globales
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeOrder) {
        const rawOrders = localStorage.getItem('origen_orders');
        if (rawOrders) {
          const orders: Order[] = JSON.parse(rawOrders);
          const updated = orders.find(o => o.id === activeOrder.id);
          if (updated) {
            if (updated.status !== activeOrder.status) {
              // Si el estado cambió a Listo, podrías disparar un sonido aquí
              if (updated.status === 'Listo' && 'vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
              }
            }
            setActiveOrder(updated);
            calculateOrdersAhead(updated, orders);
          }
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'En cola': return { label: 'Esperando Turno', color: 'bg-gray-600', text: 'text-gray-400', icon: '⏳' };
      case 'En preparación': return { label: 'En el Fuego', color: 'bg-[#ff9f1c]', text: 'text-[#ff9f1c]', icon: '🔥' };
      case 'Listo': return { label: '¡Pedido Listo!', color: 'bg-[#2ec4b6]', text: 'text-[#2ec4b6]', icon: '✅' };
      default: return { label: 'Procesando', color: 'bg-gray-800', text: 'text-gray-500', icon: '⚙️' };
    }
  };

  return (
    <section className="bg-black border-2 border-gray-800 p-8 rounded-[2.5rem] shadow-2xl mb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
        <span className="text-8xl font-black italic uppercase">TURNO</span>
      </div>

      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#ff9f1c] uppercase italic tracking-tighter">Monitor de Turnos</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ingresa tu ticket para ver el progreso real</p>
        </div>

        <div className="flex space-x-2">
          <input 
            type="text" 
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="#0001"
            className="flex-1 bg-[#111] border border-gray-700 p-4 rounded-2xl text-white outline-none focus:border-[#ff9f1c] font-mono text-center text-xl uppercase"
          />
          <button 
            onClick={handleSearch}
            className="bg-[#ff9f1c] text-black px-8 rounded-2xl font-black uppercase italic hover:bg-white transition-all"
          >
            RASTREAR
          </button>
        </div>

        {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

        {activeOrder && (
          <div className="animate-fade-in space-y-8 py-4">
            {/* Visualización de Turno */}
            <div className="bg-[#111] p-10 rounded-3xl border border-gray-800 text-center relative">
              <span className="absolute top-4 left-6 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Ticket Activo</span>
              <div className="text-6xl font-black text-white italic tracking-tighter mb-2">{activeOrder.ticketCode}</div>
              
              <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full border border-gray-800 mt-4 bg-black">
                <span className="text-xl">{getStatusDisplay(activeOrder.status).icon}</span>
                <span className={`font-black uppercase italic tracking-tighter ${getStatusDisplay(activeOrder.status).text}`}>
                  {getStatusDisplay(activeOrder.status).label}
                </span>
              </div>
            </div>

            {/* Progreso y Cola */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Fila de espera</span>
                  <span className="text-2xl font-black text-white italic">
                    {activeOrder.status === 'En cola' ? `${ordersAhead} pedidos antes que el tuyo` : '¡Ya casi está!'}
                  </span>
                </div>
                <div className="text-right">
                   <span className="text-[9px] font-black text-gray-500 uppercase italic">Estado</span>
                   <p className="text-[#ff9f1c] font-black text-sm uppercase">{activeOrder.status}</p>
                </div>
              </div>

              {/* Progress Bar Dinámico */}
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden flex p-1 border border-gray-800">
                <div className={`h-full rounded-full transition-all duration-1000 ${
                  activeOrder.status === 'En cola' ? 'w-1/3 bg-gray-600' :
                  activeOrder.status === 'En preparación' ? 'w-2/3 bg-[#ff9f1c]' :
                  'w-full bg-[#2ec4b6]'
                }`}></div>
              </div>

              <div className="bg-[#ff9f1c]/5 p-4 rounded-2xl border border-[#ff9f1c]/20 text-center">
                 <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
                   {activeOrder.status === 'En cola' ? 'Tu hamburguesa está en la fila de guerreros.' :
                    activeOrder.status === 'En preparación' ? 'El chef está dándole el toque Origen a tu pedido.' :
                    '¡Ven por ella o espera al repartidor! Tu pedido está listo.'}
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderTracking;
