
import React, { useState, useEffect } from 'react';
import { Order, OrderStats } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<OrderStats>({
    queue: 0,
    preparing: 0,
    ready: 0
  });

  const updateStats = () => {
    const rawOrders = localStorage.getItem('origen_orders');
    if (!rawOrders) return;
    
    const orders: Order[] = JSON.parse(rawOrders);
    // Filtrar solo pedidos de hoy (simulado)
    const queue = orders.filter(o => o.status === 'En cola').length;
    const preparing = orders.filter(o => o.status === 'En preparación').length;
    const ready = orders.filter(o => o.status === 'Listo').length;

    setStats({ queue, preparing, ready });
  };

  useEffect(() => {
    updateStats();
    window.addEventListener('storage', updateStats);
    // Intervalo para captar cambios si se hacen en la misma pestaña
    const interval = setInterval(updateStats, 2000);
    return () => {
      window.removeEventListener('storage', updateStats);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#252525] p-6 shadow-2xl relative border-b border-gray-800">
      <StatCard label="Tickets en Cola" value={stats.queue} color="#6b7280" />
      <StatCard label="En Preparación" value={stats.preparing} color="#ff9f1c" />
      <StatCard label="Listos para Entrega" value={stats.ready} color="#2ec4b6" />
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="bg-[#111] p-6 rounded-2xl border-b-4 text-center transition-all hover:translate-y-[-4px]" style={{ borderBottomColor: color }}>
    <div className="text-4xl font-black mb-1" style={{ color }}>{value}</div>
    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">{label}</div>
  </div>
);

export default Dashboard;
