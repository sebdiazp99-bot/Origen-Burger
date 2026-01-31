
import { MenuItem } from './types';

export const MENU: MenuItem[] = [
  {
    id: 'h1',
    name: 'La Clásica',
    category: 'hamburguesas',
    description: 'Pan brioche, carne artesanal x2 120g, queso mozzarella, chorizo artesanal, salsa origen y cebolla caramelizada.',
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'h2',
    name: 'De la casa',
    category: 'hamburguesas',
    description: 'Pan brioche, carne artesanal x2 120g, tocineta, queso cheddar, salsa origen y cebolla krispy.',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'h3',
    name: 'Edición Limitada',
    category: 'hamburguesas',
    description: 'Pan brioche, carne artesanal x2 120g, queso cheddar, maduro, queso frito, pechuga, salsa origen y cebolla caramelizada.',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p1',
    name: 'Que papas',
    category: 'papas',
    description: 'Porción clásica de papas a la francesa, crocantes y con el toque de sal Origen.',
    price: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p2',
    name: 'Mr Papitas',
    category: 'papas',
    description: 'Papas rústicas con especias de la casa y un dip de salsa origen.',
    price: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'p3',
    name: 'Papa Box',
    category: 'papas',
    description: 'Caja familiar de papas mixtas con trozos de tocineta y queso fundido.',
    price: 13000,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'b1',
    name: 'Gaseosa Postobón / Pepsi',
    category: 'bebidas',
    description: 'Selecciona tu sabor favorito: Uva, Manzana, Pepsi o Colombiana. Refrescantes y heladas.',
    price: 1500,
    imageUrl: 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/postobon-drinks.png' // Usamos un placeholder representativo basado en la imagen subida
  }
];

export const APP_COLORS = {
  primary: '#ff9f1c',
  secondary: '#2ec4b6',
  background: '#1a1a1d',
  card: '#2d2d30'
};
