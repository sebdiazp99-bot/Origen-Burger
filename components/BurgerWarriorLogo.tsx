
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface BurgerWarriorLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const FALLBACK_LOGO = "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=80";

const BurgerWarriorLogo: React.FC<BurgerWarriorLogoProps> = ({ className = "", size = "md" }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateLogo = async () => {
      const cachedLogo = localStorage.getItem('origen_warrior_logo');
      if (cachedLogo) {
        setLogoUrl(cachedLogo);
        setIsLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: 'A high-quality cartoon mascot logo of a hamburger character heroically holding a large medieval silver sword. Isolated on a dark flat background.',
              },
            ],
          },
          config: { imageConfig: { aspectRatio: "1:1" } },
        });

        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
          const base64Data = `data:image/png;base64,${part.inlineData.data}`;
          setLogoUrl(base64Data);
          localStorage.setItem('origen_warrior_logo', base64Data);
        } else {
          setLogoUrl(FALLBACK_LOGO);
        }
      } catch (error) {
        console.error("Gemini API Quota or Error, using fallback:", error);
        setLogoUrl(FALLBACK_LOGO);
      } finally {
        setIsLoading(false);
      }
    };

    generateLogo();
  }, []);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-64 h-64'
  };

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-[#333] rounded-2xl animate-pulse flex items-center justify-center border border-white/10`}>
        <span className="text-2xl">⚔️</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative group`}>
      <img 
        src={logoUrl || FALLBACK_LOGO} 
        alt="Guerrero Origen" 
        className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_15px_rgba(255,159,28,0.3)] transition-transform duration-500 group-hover:scale-110" 
      />
      {logoUrl === FALLBACK_LOGO && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xl">🍔</span>
        </div>
      )}
    </div>
  );
};

export default BurgerWarriorLogo;
