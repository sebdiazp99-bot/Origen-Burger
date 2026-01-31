
import React from 'react';

const MapSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white mb-2 uppercase border-b-2 border-[#2ec4b6] inline-block tracking-tighter">📍 Ubicación</h2>
      <div className="w-full h-[200px] rounded-2xl overflow-hidden border-2 border-gray-800 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
        <iframe 
          title="Google Maps Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.793774676646!2d-74.072092!3d4.710989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjYnMjguNCJOIDc0wrAzNicxMi4wIlc!5e0!3m2!1ses!2sco!4v1600000000000!5m2!1ses!2sco" 
          width="70%"
          height="50%"
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
        ></iframe>
      </div>
      <div className="bg-[#252525] p-6 rounded-2xl text-gray-400 flex items-center space-x-4 border border-gray-800">
        <div className="text-4xl text-[#ff9f1c]">🕒</div>
        <div>
          <p className="font-bold text-white text-sm uppercase tracking-widest">Horario de Labores</p>
          <p className="text-lg font-black text-[#ff9f1c] italic">10:00 AM — 11:00 PM</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Todos los días de la semana</p>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
