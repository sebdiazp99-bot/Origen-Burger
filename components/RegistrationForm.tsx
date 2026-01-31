
import React, { useState, useEffect } from 'react';
import { Client } from '../types';

const RegistrationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [ticketToSearch, setTicketToSearch] = useState('');
  const [status, setStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const getNextTicket = (clients: Client[]) => {
    const nextNum = clients.length + 1;
    if (nextNum > 99) return "FULL";
    return `#${nextNum.toString().padStart(4, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rawClients = localStorage.getItem('origen_clients');
    const clients: Client[] = rawClients ? JSON.parse(rawClients) : [];
    
    if (clients.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      setStatus({ msg: `El cliente ${name} ya está registrado.`, type: 'error' });
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    const ticketCode = getNextTicket(clients);
    if (ticketCode === "FULL") {
      setStatus({ msg: "Capacidad de tickets agotada (#0099 alcanzado).", type: 'error' });
      return;
    }

    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      ticketCode,
      purchaseCount: 0,
      hasPlayedDarts: false,
      registeredAt: new Date().toISOString()
    };

    const updatedClients = [...clients, newClient];
    localStorage.setItem('origen_clients', JSON.stringify(updatedClients));
    localStorage.setItem('current_client_id', newClient.id);
    
    window.dispatchEvent(new Event('storage'));
    setStatus({ msg: `¡Éxito! Bienvenido ${name}. Tu ticket es ${ticketCode}`, type: 'success' });
    setName('');
    setTimeout(() => setStatus(null), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const rawClients = localStorage.getItem('origen_clients');
    const clients: Client[] = rawClients ? JSON.parse(rawClients) : [];
    
    const client = clients.find(c => c.ticketCode === ticketToSearch || c.ticketCode === `#${ticketToSearch.padStart(4, '0')}`);
    
    if (client) {
      localStorage.setItem('current_client_id', client.id);
      setStatus({ msg: `¡Bienvenido de nuevo, ${client.name}!`, type: 'success' });
      setTicketToSearch('');
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ msg: "Ticket no encontrado.", type: 'error' });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="bg-[#252525] p-8 rounded-2xl border border-gray-800 shadow-xl h-full flex flex-col space-y-8">
      {/* Sección Registro */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase border-b-2 border-[#ff9f1c] inline-block tracking-tighter">📝 Nuevo Registro</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Obtén tu ticket único (#0001 - #0099)</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre Completo"
            className="w-full bg-[#111] border border-gray-700 p-4 rounded-xl text-white outline-none focus:border-[#ff9f1c] transition-all font-bold placeholder:text-gray-700 text-sm"
          />
          <button 
            type="submit"
            className="w-full bg-[#ff9f1c] text-black font-black py-4 rounded-xl hover:bg-white transition-all italic tracking-tighter text-lg uppercase"
          >
            GENERAR TICKET ➔
          </button>
        </form>
      </section>

      {/* Sección Ingreso Existente */}
      <section className="pt-8 border-t border-gray-800">
        <div className="mb-6">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">¿Ya tienes un Ticket?</h3>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Ingresa para sumar compras e historial</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex space-x-2">
          <input 
            type="text" 
            value={ticketToSearch}
            onChange={(e) => setTicketToSearch(e.target.value)}
            placeholder="#0001"
            className="flex-1 bg-[#111] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-[#ff9f1c] font-mono text-sm uppercase"
          />
          <button 
            type="submit"
            className="bg-[#333] text-[#ff9f1c] px-6 rounded-xl font-black uppercase text-xs hover:bg-[#ff9f1c] hover:text-black transition-all"
          >
            INGRESAR
          </button>
        </form>
      </section>

      {status && (
        <div className={`p-4 rounded-xl text-xs font-black text-center animate-bounce border ${status.type === 'success' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
