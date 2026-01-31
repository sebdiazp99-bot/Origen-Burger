
import { GoogleGenAI } from "@google/genai";
import { MENU } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBurgerRecommendation = async (userPrompt: string) => {
  const model = 'gemini-3-flash-preview';
  const menuContext = JSON.stringify(MENU);
  
  const systemInstruction = `
    Eres el asistente gourmet de "ORIGEN BURGER", una exclusiva cocina oculta (ghost kitchen) que opera de 10 AM a 11 PM. 
    Tu misión es recomendar la mejor opción del menú basándote en los gustos del cliente.
    
    Menú disponible: ${menuContext}
    
    Detalles Clave de Origen:
    - La Clásica: Destaca por su chorizo artesanal y cebolla caramelizada.
    - De la Casa: Para amantes del crunch con cebolla krispy y tocineta.
    - Edición Limitada: Una explosión de sabores con maduro, queso frito y pechuga.
    - Papas: Tenemos "Que papas", "Mr Papitas" y "Papa Box" para acompañar.
    
    Instrucciones:
    1. Sé entusiasta, sofisticado y menciona ocasionalmente que somos una "Cocina Oculta".
    2. Si el usuario pregunta por ingredientes, sé preciso con los detalles del menú.
    3. Si el usuario pide un acompañamiento, sugiere nuestras papas fritas.
    4. Responde en español de forma concisa y amigable.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "¡No pude decidirme! Pero nuestras hamburguesas artesanales en Origen son de otro nivel.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, mi cerebro de hamburguesa se sobrecalentó. ¡Prueba nuestra Clásica con doble carne artesanal!";
  }
};
