
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'hamburguesas' | 'papas' | 'bebidas';
  isVegetarian?: boolean;
}

export type PaymentMethod = 'tarjeta_debito' | 'nequi' | 'efectivo';
export type DeliveryType = 'domicilio' | 'punto_fisico';

// Estados actualizados según requerimiento de sistema de turnos
export type OrderStatus = 'En cola' | 'En preparación' | 'Listo' | 'Entregado';

export interface Order {
  id: string;
  ticketCode: string;
  clientName: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  status: OrderStatus;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  ticketCode: string;
  purchaseCount: number;
  hasPlayedDarts: boolean;
  activePrize?: string;
  registeredAt: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderStats {
  queue: number;
  preparing: number;
  ready: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
