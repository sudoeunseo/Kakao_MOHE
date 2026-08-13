export type ViewType = 
  | 'landing' 
  | 'login' 
  | 'mypage' 
  | 'search' 
  | 'shopping' 
  | 'payments' 
  | 'warehouse' 
  | 'ai-sourcing' 
  | 'calculator'
  | 'seller';

export interface UserProfile {
  name: string;
  customsCode: string; // e.g. P123456789012
  role: string; // e.g. 기업 구매자
  email: string;
  avatarUrl: string;
}

export interface ShippingAddress {
  id: string;
  title: string;
  isDefault: boolean;
  address: string;
  postalCode: string;
}

export interface PaymentCard {
  id: string;
  type: 'VISA' | 'Mastercard' | 'KakaoPay';
  name: string;
  lastFourDigits: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  category: '관세' | '해외배송비';
  title: string;
  orderNumber: string;
  paymentMethod: string;
  amount: number;
  status: '결제완료' | '결제대기' | '결제실패';
  date: string;
}

export interface WarehousePackage {
  id: string;
  productName: string;
  trackingNumber: string;
  hubLocation: 'US (델라웨어)' | 'JP (도쿄)' | 'CN (웨이하이)';
  daysStored: number;
  status: '실측 완료' | '입고 대기중' | '출고 준비중';
  estimatedWeightKg: number;
  shippingFeeUsd: number;
}

export interface ShoppingMall {
  id: string;
  name: string;
  country: '미국' | '일본' | '중국' | '글로벌' | '유럽';
  countryFlag: string;
  description: string;
  badge?: string;
  badgeType?: 'hot' | 'point' | 'free' | 'badge';
  logoUrl: string;
  url: string;
}

export interface RecommendedProduct {
  id: string;
  title: string;
  category: string;
  priceKrw: number;
  priceUsd: number;
  imageUrl: string;
  rating?: number;
}

export interface AISourcingItem {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  origin: string;
  description: string;
  itemPriceUsd: number;
  shippingFeeUsd: number;
  customsTaxUsd: number;
  totalEstimatedUsd: number;
  imageUrl: string;
  savingsPercent: number;
}
