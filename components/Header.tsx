
import React from 'react';
import { useCart } from '../context/CartContext';
import BurgerWarriorLogo from './BurgerWarriorLogo';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenDarts: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenDarts }) => {
  const { totalItems } = useCart();
  
  const now = new Date();
  const currentHour = now.getHours();
  const isOpen = currentHour >= 10 && currentHour < 23;

  return (
    <header className="bg-black border-b-4 border-[#ff9f1c] px-6 py-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 shadow-2xl">
      <div className="flex flex-col">
        <div className="flex items-center space-x-3">
          <BurgerWarriorLogo size="sm" className="drop-shadow-[0_0_10px_rgba(255,159,28,0.5)]" />
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-[#ff9f1c] tracking-tighter italic leading-none">
              ORIGEN <span className="text-white">BURGER</span>
            </h1>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">
              Cocina Oculta Premium
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0 space-x-3 md:space-x-6">
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest mb-1">
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={isOpen ? 'text-green-500' : 'text-red-500'}>
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
            Todos los días: 10:00 AM - 11:00 PM
          </div>
        </div>

        <button 
          onClick={onOpenDarts}
          className="relative group p-3 bg-[#111] hover:bg-[#ff9f1c] border border-[#ff9f1c]/30 rounded-2xl transition-all hover:scale-105"
          title="Jugar Dardos Origen"
        >
          <span className="text-2xl group-hover:scale-125 transition-transform block">🎯</span>
          <span className="absolute -bottom-2 -left-2 bg-red-600 text-white text-[8px] font-black px-1 rounded border border-black animate-pulse">
            PREMIO
          </span>
        </button>

        <button 
          onClick={onOpenCart}
          className="relative group p-3 bg-[#252525] hover:bg-[#333] border border-gray-800 rounded-2xl transition-all hover:border-[#ff9f1c]/50"
        >
          <span className="text-2xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#ff9f1c] text-black text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-black shadow-lg animate-bounce">
              {totalItems}
            </span>
          )}
          <span className="hidden md:inline ml-2 text-xs font-black uppercase tracking-widest text-white">Mi Pedido</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
