
import React, { useState } from 'react';
import { MENU } from '../constants';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';

const Menu: React.FC = () => {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setAddingId(item.id);
    setTimeout(() => setAddingId(null), 1000);
  };

  const burgers = MENU.filter(i => i.category === 'hamburguesas');
  const potatoes = MENU.filter(i => i.category === 'papas');
  const drinks = MENU.filter(i => i.category === 'bebidas');

  const MenuSection = ({ title, items }: { title: string, items: MenuItem[] }) => (
    <div className="mb-20">
      <div className="flex items-center mb-10 border-b-2 border-[#ff9f1c] pb-2 inline-block">
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.map((item) => (
          <div key={item.id} className="bg-[#2d2d30] rounded-2xl overflow-hidden group shadow-lg transition-all hover:shadow-[#ff9f1c]/20 hover:-translate-y-2 border border-gray-800 flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute top-4 right-4 bg-[#ff9f1c] text-black font-black px-4 py-1 rounded-full text-lg shadow-lg">
                {formatCurrency(item.price)}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">{item.name}</h3>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed flex-1 border-l-2 border-gray-700 pl-3">
                {item.description}
              </p>
              <button 
                onClick={() => handleAddToCart(item)}
                disabled={addingId === item.id}
                className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center space-x-2 uppercase italic tracking-tighter mt-auto ${
                  addingId === item.id 
                    ? 'bg-green-500 text-white scale-95' 
                    : 'bg-[#ff9f1c] hover:bg-white text-black'
                }`}
              >
                {addingId === item.id ? (
                  <>
                    <span>¡AÑADIDO!</span>
                    <span>✅</span>
                  </>
                ) : (
                  <span>Añadir al Carrito</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-12 px-6">
      <MenuSection title="🔥 Nuestras Hamburguesas" items={burgers} />
      <MenuSection title="🍟 Menú Papas Fritas" items={potatoes} />
      <MenuSection title="🥤 Bebidas Heladas" items={drinks} />
    </section>
  );
};

export default Menu;
