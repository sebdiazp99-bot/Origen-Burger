
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

const KitchenPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loadOrders = () => {
    const raw = localStorage.getItem('origen_orders');
    if (raw) {
      const all: Order[] = JSON.parse(raw);
      // Solo mostrar pedidos no entregados
      setOrders(all.filter(o => o.status !== 'Entregado'));
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
      const interval = setInterval(loadOrders, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'administrador' && password === '1234546789') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Credenciales incorrectas. Acceso denegado.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const updateStatus = (orderId: string, nextStatus: OrderStatus) => {
    const raw = localStorage.getItem('origen_orders');
    if (raw) {
      const all: Order[] = JSON.parse(raw);
      const updated = all.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
      localStorage.setItem('origen_orders', JSON.stringify(updated));
      loadOrders();
      window.dispatchEvent(new Event('storage'));
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-24 left-6 bg-gray-900 text-gray-500 p-2 rounded-lg text-[8px] font-black uppercase z-[110] border border-gray-800 opacity-30 hover:opacity-100 transition-all"
      >
        🔐 Panel Cocina
      </button>
    );
  }

  // Si está visible pero no logueado, mostrar el formulario de login
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-[#1a1a1d] border-t-4 border-[#ff9f1c] p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Acceso Restringido</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Solo personal autorizado de Origen</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-[#ff9f1c] transition-all"
                placeholder="administrador"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-[#ff9f1c] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-[#ff9f1c] text-black font-black py-4 rounded-xl uppercase italic tracking-tighter hover:bg-white transition-all shadow-lg"
            >
              INGRESAR A COCINA ➔
            </button>
            <button 
              type="button"
              onClick={() => setIsVisible(false)}
              className="w-full text-gray-500 font-black py-2 uppercase text-[10px] tracking-widest"
            >
              CANCELAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black p-6 overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#ff9f1c] pb-4">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">COMANDAS ORIGEN</h1>
          <p className="text-xs text-[#ff9f1c] font-black uppercase">Modo Administración Interna</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleLogout}
            className="bg-gray-800 text-gray-400 px-4 py-2 rounded-xl font-black uppercase italic text-xs border border-gray-700 hover:text-white transition-colors"
          >
            Cerrar Sesión
          </button>
          <button 
            onClick={() => setIsVisible(false)} 
            className="bg-red-600 text-white px-6 py-2 rounded-xl font-black uppercase italic text-xs hover:bg-red-500 transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
           <span className="text-6xl mb-4">💤</span>
           <p className="font-black uppercase tracking-widest italic">No hay comandas activas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className={`p-6 rounded-3xl border-2 transition-all ${
              order.status === 'En preparación' ? 'border-[#ff9f1c] bg-[#ff9f1c]/5' : 
              order.status === 'Listo' ? 'border-[#2ec4b6] bg-[#2ec4b6]/5' : 
              'border-gray-800 bg-[#111]'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="bg-white text-black px-3 py-1 rounded-lg font-black text-xl italic">{order.ticketCode}</span>
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-500 font-black uppercase">{order.clientName}</p>
                    <p className="text-[9px] text-[#ff9f1c] font-bold uppercase italic mt-0.5">Pedido a las: {formatTime(order.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  order.status === 'En preparación' ? 'bg-[#ff9f1c] text-black shadow-[0_0_10px_rgba(255,159,28,0.3)]' : 
                  order.status === 'Listo' ? 'bg-[#2ec4b6] text-black shadow-[0_0_10px_rgba(46,196,182,0.3)]' : 'bg-gray-800 text-white'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-6 border-y border-gray-800 py-4 max-h-48 overflow-y-auto custom-scrollbar">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs font-bold text-gray-300">
                    <span className="uppercase"><span className="text-[#ff9f1c] font-black">{item.quantity}x</span> {item.name}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {order.status === 'En cola' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'En preparación')}
                    className="w-full bg-[#ff9f1c] text-black font-black py-4 rounded-xl uppercase italic text-sm hover:bg-white transition-all shadow-lg"
                  >
                    🚀 INICIAR PREPARACIÓN
                  </button>
                )}
                {order.status === 'En preparación' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Listo')}
                    className="w-full bg-[#2ec4b6] text-black font-black py-4 rounded-xl uppercase italic text-sm hover:bg-white transition-all shadow-lg"
                  >
                    ✅ PEDIDO LISTO
                  </button>
                )}
                {order.status === 'Listo' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'Entregado')}
                    className="w-full bg-white text-black font-black py-4 rounded-xl uppercase italic text-sm hover:bg-gray-200 transition-all shadow-lg"
                  >
                    🤝 MARCAR COMO ENTREGADO
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenPanel;
