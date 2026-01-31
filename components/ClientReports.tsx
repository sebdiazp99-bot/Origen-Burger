
import React, { useState, useEffect, useMemo } from 'react';
import { Client, Order } from '../types';

const ClientReports: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  const loadData = () => {
    const rawClients = localStorage.getItem('origen_clients');
    const rawOrders = localStorage.getItem('origen_orders');
    if (rawClients) setClients(JSON.parse(rawClients));
    if (rawOrders) setAllOrders(JSON.parse(rawOrders));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const topClients = useMemo(() => {
    return clients.map(client => {
      const clientOrders = allOrders.filter(o => o.ticketCode === client.ticketCode);
      return {
        ...client,
        orderCount: clientOrders.length
      };
    })
    .filter(c => c.orderCount > 0)
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5); // Límite máximo de 5 personas
  }, [clients, allOrders]);

  if (topClients.length === 0) return null;

  return (
    <section className="mt-12 py-12 px-6 bg-[#111] rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <span className="text-9xl font-black italic text-white uppercase tracking-tighter">TOP 5</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-[#ff9f1c] uppercase italic tracking-tighter flex items-center gap-3">
            🏆 Ranking de Fidelidad
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Nuestros guerreros más frecuentes (Límite Top 5)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Puesto</th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Ticket</th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Guerrero</th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-center">Pedidos</th>
              <th className="py-4 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Nivel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900">
            {topClients.map((client, index) => (
              <tr key={client.id} className={`hover:bg-white/5 transition-colors group ${index === 0 ? 'bg-[#ff9f1c]/5' : ''}`}>
                <td className="py-4 px-4">
                  <span className={`text-xl font-black italic ${index === 0 ? 'text-[#ff9f1c]' : 'text-gray-700'}`}>
                    #{index + 1}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#ff9f1c] text-black px-2 py-0.5 rounded text-[10px] font-black italic">
                      {client.ticketCode}
                    </span>
                    {index === 0 && (
                      <span className="text-2xl animate-bounce" title="Rey de Origen">👑</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`font-bold uppercase text-xs tracking-tight ${index === 0 ? 'text-[#ff9f1c]' : 'text-white'}`}>
                    {client.name}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                   <span className="text-[#2ec4b6] font-black text-lg italic font-mono">{client.orderCount}</span>
                </td>
                <td className="py-4 px-4">
                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                     index === 0 ? 'bg-[#ff9f1c] text-black' : 'bg-gray-800 text-gray-400'
                   }`}>
                     {index === 0 ? 'ELITE SUPREMO' : index < 3 ? 'GUERRERO' : 'RECLUTA'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ClientReports;
