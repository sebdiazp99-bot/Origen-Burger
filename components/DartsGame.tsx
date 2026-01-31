
import React, { useState, useEffect } from 'react';
import { Client } from '../types';

interface DartsGameProps {
  onClose: () => void;
}

const PRIZES = [
  "-10% de descuento en tu burger",
  "-50% descuento en tu burger",
  "Sigue intentando",
  "Domicilio gratis",
  "Síguenos y obtén recompensa"
];

const DartsGame: React.FC<DartsGameProps> = ({ onClose }) => {
  const [isThrowing, setIsThrowing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dartPos, setDartPos] = useState({ x: 50, y: 150 });
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    const clientId = localStorage.getItem('current_client_id');
    const rawClients = localStorage.getItem('origen_clients');
    if (clientId && rawClients) {
      const clients: Client[] = JSON.parse(rawClients);
      const client = clients.find(c => c.id === clientId);
      if (client) {
        if (client.hasPlayedDarts) {
          setAuthError(`Lo sentimos ${client.name}, ya utilizaste tu dardo del día.`);
        } else {
          setActiveClient(client);
        }
      }
    } else {
      setAuthError("Primero debes registrarte para obtener tu ticket y jugar.");
    }
  }, []);

  const handleThrow = () => {
    if (isThrowing || !activeClient) return;
    
    setIsThrowing(true);
    setResult(null);
    
    const targetX = 40 + (Math.random() * 20); // 40-60% range
    const targetY = 40 + (Math.random() * 20); // 40-60% range
    
    setTimeout(() => {
      setDartPos({ x: targetX, y: targetY });
      
      setTimeout(() => {
        const winIndex = Math.floor(Math.random() * PRIZES.length);
        const winResult = PRIZES[winIndex];
        setResult(winResult);
        setIsThrowing(false);

        // Update database: client has played and store their prize
        const rawClients = localStorage.getItem('origen_clients');
        if (rawClients) {
          const clients: Client[] = JSON.parse(rawClients);
          const updatedClients = clients.map(c => 
            c.id === activeClient.id ? { ...c, hasPlayedDarts: true, activePrize: winResult } : c
          );
          localStorage.setItem('origen_clients', JSON.stringify(updatedClients));
          window.dispatchEvent(new Event('storage'));
        }
      }, 500);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-[#1a1a1d] border-2 border-[#ff9f1c] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,159,28,0.3)] animate-scale-up">
        <div className="bg-[#ff9f1c] p-4 text-center">
          <h2 className="text-black font-black uppercase italic tracking-tighter text-xl">🎯 Dardo de la Suerte Origen</h2>
          {activeClient && (
            <p className="text-[10px] text-black font-bold uppercase tracking-widest mt-1">
              Jugando como: {activeClient.name} ({activeClient.ticketCode})
            </p>
          )}
        </div>

        <div className="p-8 flex flex-col items-center">
          {authError ? (
            <div className="text-center space-y-6 py-10">
              <div className="text-6xl grayscale opacity-30">🚫</div>
              <p className="text-white font-bold uppercase italic tracking-tight">{authError}</p>
              <button 
                onClick={onClose}
                className="bg-[#ff9f1c] text-black text-xs font-black px-8 py-3 rounded-full uppercase italic hover:bg-white transition-all"
              >
                Entendido
              </button>
            </div>
          ) : (
            <>
              {/* Diana (Target) */}
              <div className="relative w-64 h-64 rounded-full border-8 border-[#333] shadow-inner flex items-center justify-center bg-[#111]">
                <div className="absolute w-full h-full rounded-full border-4 border-white/5"></div>
                <div className="w-48 h-48 rounded-full border-4 border-red-600/50 flex items-center justify-center">
                   <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#ff9f1c] shadow-[0_0_20px_rgba(255,159,28,0.5)]"></div>
                   </div>
                </div>
                
                {/* El Dardo */}
                <div 
                  className="absolute text-4xl transition-all duration-500 ease-out"
                  style={{ 
                    left: `${dartPos.x}%`, 
                    top: `${dartPos.y}%`, 
                    transform: `translate(-50%, -50%) ${isThrowing ? 'scale(0.5) rotate(45deg)' : 'scale(1) rotate(0deg)'}`,
                    opacity: dartPos.y > 100 ? 0 : 1
                  }}
                >
                  🎯
                </div>
              </div>

              <div className="mt-12 w-full text-center min-h-[100px]">
                {result ? (
                  <div className="animate-bounce">
                    <p className="text-[#ff9f1c] font-black uppercase italic text-lg mb-2">¡HAS GANADO!</p>
                    <p className="text-white font-bold uppercase tracking-widest text-sm mb-6 bg-white/5 p-4 rounded-xl border border-white/10">{result}</p>
                    <button 
                      onClick={onClose}
                      className="bg-white text-black text-[10px] font-black px-10 py-3 rounded-full uppercase hover:bg-[#ff9f1c] transition-colors italic tracking-widest"
                    >
                      CERRAR Y RECLAMAR
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleThrow}
                    disabled={isThrowing}
                    className={`group relative bg-[#ff9f1c] text-black font-black py-4 px-10 rounded-2xl uppercase italic tracking-tighter text-xl transition-all shadow-lg ${isThrowing ? 'opacity-50' : 'hover:scale-105 active:scale-95'}`}
                  >
                    {isThrowing ? 'LANZANDO...' : '¡LANZAR DARDO!'}
                    {!isThrowing && <span className="absolute -top-2 -right-2 text-2xl animate-ping">🎯</span>}
                  </button>
                )}
              </div>
            </>
          )}

          <p className="mt-8 text-[8px] text-gray-600 uppercase tracking-[0.3em] font-bold text-center">
            Solo un lanzamiento por cliente registrado. Los premios se aplican al finalizar tu compra actual.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-black font-black text-sm hover:scale-125 transition-transform"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default DartsGame;
