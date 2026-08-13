import { 
  UserProfile, 
  ShippingAddress, 
  PaymentCard, 
  Transaction, 
  WarehousePackage, 
  ShoppingMall, 
  RecommendedProduct, 
  AISourcingItem 
} from '../types';

export const PICTOGRAM_AVATARS = [
  {
    id: 'picto-navy-brand',
    name: '네이비 옐로우',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23FFCD00"/><circle cx="50" cy="38" r="18" fill="%2308152e"/><path d="M20 84C22 66 34 58 50 58C66 58 78 66 80 84" stroke="%2308152e" stroke-width="10" stroke-linecap="round" fill="none"/></svg>`
  },
  {
    id: 'picto-kakao-gold',
    name: '카카오 딥네이비',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%231E2A44"/><circle cx="50" cy="38" r="18" fill="%23FFCD00"/><path d="M20 84C22 66 34 58 50 58C66 58 78 66 80 84" stroke="%23FFCD00" stroke-width="10" stroke-linecap="round" fill="none"/></svg>`
  },
  {
    id: 'picto-logistics-buyer',
    name: '스마트 블루',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%230F172A"/><circle cx="50" cy="36" r="16" fill="%2338BDF8"/><path d="M22 82C24 65 35 57 50 57C65 57 76 65 78 82" stroke="%2338BDF8" stroke-width="10" stroke-linecap="round" fill="none"/><rect x="62" y="58" width="22" height="22" rx="4" fill="%23FFCD00"/><path d="M73 63L73 75M67 69L79 69" stroke="%23191919" stroke-width="2.5" stroke-linecap="round"/></svg>`
  },
  {
    id: 'picto-clean-line',
    name: '클래식 라인',
    url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23F8F9FB" stroke="%231E2A44" stroke-width="4"/><circle cx="50" cy="36" r="16" fill="%231E2A44"/><path d="M24 80C26 64 36 57 50 57C64 57 74 64 76 80" stroke="%231E2A44" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`
  }
];

export const initialUserProfile: UserProfile = {
  name: '김모해',
  customsCode: 'P123456789012',
  role: '기업 구매자',
  email: 'example@kakao.com',
  avatarUrl: PICTOGRAM_AVATARS[0].url
};

export const initialAddresses: ShippingAddress[] = [
  {
    id: 'addr-1',
    title: '본사',
    isDefault: true,
    address: '서울특별시 강남구 비즈니스대로 123, 400호',
    postalCode: '04512'
  },
  {
    id: 'addr-2',
    title: '인천창고',
    isDefault: false,
    address: '인천광역시 물류로 45, B동',
    postalCode: '22381'
  }
];

export const initialCards: PaymentCard[] = [
  {
    id: 'card-1',
    type: 'VISA',
    name: '법인 Visa',
    lastFourDigits: '4242',
    isDefault: true
  },
  {
    id: 'card-2',
    type: 'Mastercard',
    name: '개인 Mastercard',
    lastFourDigits: '8812',
    isDefault: false
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    category: '관세',
    title: '나이키 에어맥스 외 2건 통관',
    orderNumber: 'ORD-202310-9938',
    paymentMethod: '카카오페이',
    amount: 125000,
    status: '결제완료',
    date: '2026-08-10'
  },
  {
    id: 'tx-2',
    category: '해외배송비',
    title: '아마존 직구 전자제품 묶음',
    orderNumber: 'SHP-202310-4421',
    paymentMethod: '신한카드(끝자리 4812)',
    amount: 34000,
    status: '결제완료',
    date: '2026-08-08'
  },
  {
    id: 'tx-3',
    category: '관세',
    title: '애플 맥북 프로 16인치 통관',
    orderNumber: 'ORD-202310-8822',
    paymentMethod: '-',
    amount: 45000,
    status: '결제대기',
    date: '2026-08-11'
  },
  {
    id: 'tx-4',
    category: '해외배송비',
    title: '영국 의류 직구 건',
    orderNumber: 'SHP-202310-3100',
    paymentMethod: '무통장입금 (국민은행)',
    amount: 18500,
    status: '결제완료',
    date: '2026-08-05'
  },
  {
    id: 'tx-5',
    category: '관세',
    title: '다이슨 에어랩 통관',
    orderNumber: 'ORD-202310-1123',
    paymentMethod: '현대카드 (잔액부족)',
    amount: 82000,
    status: '결제실패',
    date: '2026-08-01'
  }
];

export const initialPackages: WarehousePackage[] = [
  {
    id: 'pkg-1',
    productName: 'Keychron Q1 Pro Mechanical Keyboard',
    trackingNumber: 'TRK123456789',
    hubLocation: 'US (델라웨어)',
    daysStored: 3,
    status: '실측 완료',
    estimatedWeightKg: 1.8,
    shippingFeeUsd: 14.50
  },
  {
    id: 'pkg-2',
    productName: 'Weltevree Ode Desk Lamp',
    trackingNumber: 'TRK987654321',
    hubLocation: 'US (델라웨어)',
    daysStored: 1,
    status: '실측 완료',
    estimatedWeightKg: 1.2,
    shippingFeeUsd: 10.00
  },
  {
    id: 'pkg-3',
    productName: 'Anker Magnetic Power Bank 10000mAh',
    trackingNumber: 'TRK555444333',
    hubLocation: 'JP (도쿄)',
    daysStored: 0,
    status: '입고 대기중',
    estimatedWeightKg: 0.4,
    shippingFeeUsd: 8.00
  }
];

export const shoppingMalls: ShoppingMall[] = [
  {
    id: 'mall-1',
    name: 'Amazon',
    country: '미국',
    countryFlag: '🇺🇸',
    description: '세계 최대 규모의 종합 쇼핑몰. 다양한 상품과 빠른 배송이 장점입니다.',
    badge: '인기급상승',
    badgeType: 'hot',
    logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=200',
    url: 'https://www.amazon.com'
  },
  {
    id: 'mall-2',
    name: 'Rakuten',
    country: '일본',
    countryFlag: '🇯🇵',
    description: '일본 최대의 온라인 쇼핑몰. 피규어, 전자기기, 잡화 등 다양한 아이템이 가득합니다.',
    badge: '포인트 2배',
    badgeType: 'point',
    logoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=200',
    url: 'https://www.rakuten.co.jp'
  },
  {
    id: 'mall-3',
    name: 'Taobao',
    country: '중국',
    countryFlag: '🇨🇳',
    description: '저렴한 가격과 압도적인 상품수를 자랑하는 중국 최고의 쇼핑몰입니다.',
    badge: '종합 쇼핑',
    badgeType: 'badge',
    logoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=200',
    url: 'https://www.taobao.com'
  },
  {
    id: 'mall-4',
    name: 'AliExpress',
    country: '글로벌',
    countryFlag: '🌐',
    description: '전 세계 배송을 지원하는 글로벌 도매/소매 플랫폼입니다.',
    badge: '무료배송 많음',
    badgeType: 'free',
    logoUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=200',
    url: 'https://www.aliexpress.com'
  }
];

export const recommendedProducts: RecommendedProduct[] = [
  // 뷰티 (3)
  {
    id: 'prod-1',
    title: '프리미엄 비건 스킨케어 세트',
    category: '뷰티',
    priceKrw: 89000,
    priceUsd: 68.00,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-beauty-2',
    title: '나이트 리페어 인텐시브 세럼 50ml',
    category: '뷰티',
    priceKrw: 54000,
    priceUsd: 41.50,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },
  {
    id: 'prod-beauty-3',
    title: '저자극 히알루론산 수분 크림 100ml',
    category: '뷰티',
    priceKrw: 32000,
    priceUsd: 24.50,
    imageUrl: 'https://images.unsplash.com/photo-1608248597260-6521e8e19d67?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },

  // 전자제품 (3)
  {
    id: 'prod-2',
    title: '무선 기계식 키보드 Retro Edition',
    category: '전자제품',
    priceKrw: 210000,
    priceUsd: 160.00,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },
  {
    id: 'prod-elec-2',
    title: '액티브 노이즈 캔슬링 블루투스 헤드폰',
    category: '전자제품',
    priceKrw: 185000,
    priceUsd: 142.00,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-elec-3',
    title: '초고속 C타입 100W 4포트 멀티 충전기',
    category: '전자제품',
    priceKrw: 42000,
    priceUsd: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },

  // 취미 (3)
  {
    id: 'prod-3',
    title: '티타늄 캠핑 머그컵 450ml',
    category: '취미',
    priceKrw: 45000,
    priceUsd: 34.00,
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },
  {
    id: 'prod-hobby-2',
    title: '경량 접이식 캠핑 체어 & 테이블 세트',
    category: '취미',
    priceKrw: 88000,
    priceUsd: 67.50,
    imageUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-hobby-3',
    title: '방수 감성 캠핑 랜턴 스피커',
    category: '취미',
    priceKrw: 62000,
    priceUsd: 47.50,
    imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },

  // 식품 (3)
  {
    id: 'prod-4',
    title: '스페셜티 에티오피아 싱글오리진 원두 1kg',
    category: '식품',
    priceKrw: 32000,
    priceUsd: 24.50,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },
  {
    id: 'prod-food-2',
    title: '유기농 엑스트라 버진 올리브유 500ml',
    category: '식품',
    priceKrw: 39000,
    priceUsd: 30.00,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-food-3',
    title: '무설탕 고소한 아몬드 너츠 믹스 선물세트',
    category: '식품',
    priceKrw: 48000,
    priceUsd: 36.80,
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },

  // 의류 (3)
  {
    id: 'prod-clothes-1',
    title: '오버핏 100% 헤비 코튼 라운드 티셔츠',
    category: '의류',
    priceKrw: 29000,
    priceUsd: 22.00,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },
  {
    id: 'prod-clothes-2',
    title: '클래식 울 캐시미어 블렌드 가디건',
    category: '의류',
    priceKrw: 78000,
    priceUsd: 60.00,
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-clothes-3',
    title: '경량 스트레치 방풍 바람막이 재킷',
    category: '의류',
    priceKrw: 95000,
    priceUsd: 73.00,
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },

  // 신발 (3)
  {
    id: 'prod-[#222]-1',
    title: '에어 쿠션 데일리 러닝화 슈즈 Pro',
    category: '신발',
    priceKrw: 112000,
    priceUsd: 86.00,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },
  {
    id: 'prod-shoes-2',
    title: '클래식 스웨이드 페니 로퍼',
    category: '신발',
    priceKrw: 89000,
    priceUsd: 68.50,
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-shoes-3',
    title: '고어텍스 방수 트레킹 등산 스니커즈',
    category: '신발',
    priceKrw: 135000,
    priceUsd: 103.80,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },

  // 액세서리 (3)
  {
    id: 'prod-acc-1',
    title: '미니멀리스트 수동 오토매틱 와치',
    category: '액세서리',
    priceKrw: 168000,
    priceUsd: 129.00,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  },
  {
    id: 'prod-acc-2',
    title: '블루라이트 차단 티타늄 안경테',
    category: '액세서리',
    priceKrw: 65000,
    priceUsd: 50.00,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },
  {
    id: 'prod-acc-3',
    title: '천연 가죽 바이폴드 스마트 카드 지갑',
    category: '액세서리',
    priceKrw: 52000,
    priceUsd: 40.00,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },

  // 리빙 (3)
  {
    id: 'prod-living-1',
    title: '인체공학 메모리폼 경추 베개',
    category: '리빙',
    priceKrw: 49000,
    priceUsd: 37.50,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
    rating: 4.8
  },
  {
    id: 'prod-living-2',
    title: '초음파 아로마 무드등 가습기 500ml',
    category: '리빙',
    priceKrw: 38000,
    priceUsd: 29.00,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    rating: 4.7
  },
  {
    id: 'prod-living-3',
    title: '무선 터치 리치 세라믹 탁상 인테리어 조명',
    category: '리빙',
    priceKrw: 72000,
    priceUsd: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    rating: 4.9
  }
];

export const aiSourcingItems: AISourcingItem[] = [
  {
    id: 'ai-1',
    title: '고정밀 산업용 커넥터 세트 (1000pcs)',
    category: '전자부품 / 도매',
    matchScore: 98,
    origin: '심천, 중국 발송',
    description: '과거 구매 내역 대비 단가 15% 절감 예상. 현재 재고 보유 및 당일 발송 가능 센터 확인.',
    itemPriceUsd: 450.00,
    shippingFeeUsd: 45.00,
    customsTaxUsd: 54.45,
    totalEstimatedUsd: 549.45,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    savingsPercent: 15
  },
  {
    id: 'ai-2',
    title: '프리미엄 세라믹 머그컵 500개 벌크 (로고 인쇄 가능)',
    category: '판촉/사무용품',
    matchScore: 94,
    origin: '이우, 중국 발송',
    description: '기업 브랜드 로고 커스텀 각인 무료 지원. 친환경 박스 포장 포함.',
    itemPriceUsd: 350.00,
    shippingFeeUsd: 80.00,
    customsTaxUsd: 50.20,
    totalEstimatedUsd: 480.20,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    savingsPercent: 22
  },
  {
    id: 'ai-3',
    title: '산업용 방수 LED 스트립 라이트 50m 롤',
    category: '조명/인테리어',
    matchScore: 91,
    origin: '동관, 중국 발송',
    description: '고휘도 IP67 방수 등급. 시공 현장 맞춤 절단 가이드 제공.',
    itemPriceUsd: 210.00,
    shippingFeeUsd: 35.00,
    customsTaxUsd: 20.50,
    totalEstimatedUsd: 265.50,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    savingsPercent: 18
  },
  {
    id: 'ai-4',
    title: '고급 가죽 커버 다이어리 B5 사이즈 200권',
    category: '문구/사무',
    matchScore: 89,
    origin: '광저우, 중국 발송',
    description: '임직원 선물 및 VIP 고객 증정용 프리미엄 음각 인쇄 적용.',
    itemPriceUsd: 420.00,
    shippingFeeUsd: 60.00,
    customsTaxUsd: 50.00,
    totalEstimatedUsd: 530.00,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    savingsPercent: 12
  }
];
