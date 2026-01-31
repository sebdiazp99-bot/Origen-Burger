
import React, { useState, useEffect, useRef } from 'react';
import BurgerWarriorLogo from './BurgerWarriorLogo';

const FloatingBurger: React.FC = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ dx: 0.3, dy: 0.3 });
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const updatePosition = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.dx;
        let newY = prev.y + velocity.dy;

        let newDx = velocity.dx;
        let newDy = velocity.dy;

        if (newX <= 5 || newX >= 90) newDx = -velocity.dx;
        if (newY <= 5 || newY >= 90) newDy = -velocity.dy;

        const dist = Math.sqrt(Math.pow(mousePos.current.x - newX, 2) + Math.pow(mousePos.current.y - newY, 2));
        if (dist < 15) {
          const angle = Math.atan2(newY - mousePos.current.y, newX - mousePos.current.x);
          newDx = Math.cos(angle) * 0.8;
          newDy = Math.sin(angle) * 0.8;
        } else {
          newDx = newDx * 0.98 + (newDx > 0 ? 0.3 : -0.3) * 0.02;
          newDy = newDy * 0.98 + (newDy > 0 ? 0.3 : -0.3) * 0.02;
        }

        if (newDx !== velocity.dx || newDy !== velocity.dy) {
          setVelocity({ dx: newDx, dy: newDy });
        }

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(updatePosition, 30);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [velocity]);

  return (
    <div 
      className="fixed pointer-events-none z-0 opacity-20 select-none hidden lg:block transition-all duration-300"
      style={{
        left: `${position.x}vw`,
        top: `${position.y}vh`,
        transform: `rotate(${velocity.dx * 10}deg) scale(${0.8 + Math.abs(velocity.dx)})`,
      }}
    >
      <BurgerWarriorLogo size="xl" className="filter blur-[1px] opacity-40 grayscale-[0.5]" />
      <div className="absolute top-full left-0 w-full text-center -mt-10">
        <span className="text-[#ff9f1c] font-black italic text-sm uppercase tracking-[1em] opacity-40">
          GUARDIÁN ORIGEN
        </span>
      </div>
    </div>
  );
};

export default FloatingBurger;
