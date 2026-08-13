// Dictionary for automatic Korean to English translations when lang === 'EN'
export const TRANSLATIONS_MAP: Record<string, string> = {
  // Navigation & Headers
  '메인 홈': 'Home',
  '상품 찾기': 'Search Products',
  '해외 쇼핑몰': 'Shopping Malls',
  'AI 추천 / 스마트 소싱': 'AI Sourcing',
  '관부가세 계산기': 'Customs Calculator',
  '배송조회 / 해외배송센터': 'Shipment Tracking',
  '통관·결제 / 납부내역': 'Customs & Payments',
  '마이페이지': 'My Page',
  '홈 / 대시보드': 'Dashboard',
  '주문 관리': 'Order Management',
  '물류 관리': 'Logistics Management',
  '배대지 관리': 'Warehouse Management',
  '분석 / 수익분석': 'Analytics & Revenue',
  '구매 문의': 'Customer Inquiries',
  '설정 / 관리': 'Settings',
  '판매자 포털': 'Seller Portal',
  '마이 포털': 'My Portal',
  '로그인': 'Login',
  '로그아웃': 'Logout',
  '로그인 / 시작하기': 'Login / Get Started',
  '메인 홈으로': 'Main Home',
  '판매자 관리자': 'Seller Admin',
  '기업 구매자': 'Corporate Buyer',
  '모해 스토어': 'MOHE Store',
  '알림': 'Notifications',

  // Statuses
  '결제완료': 'Payment Completed',
  '결제 대기': 'Payment Pending',
  '결제대기': 'Payment Pending',
  '입항대기': 'Awaiting Arrival',
  '통관진행중': 'Customs In Progress',
  '통관 진행중': 'Customs In Progress',
  '통관완료': 'Customs Cleared',
  '배송중': 'In Transit',
  '배송 완료': 'Delivered',
  '배송완료': 'Delivered',
  '출고대기': 'Awaiting Dispatch',
  '검수중': 'Inspecting',
  '입고완료': 'Arrived at Warehouse',
  '반송/취소': 'Returned / Cancelled',
  '답변 대기': 'Pending Reply',
  '답변 완료': 'Replied',
  '정산 완료': 'Settlement Completed',
  '정산 대기': 'Settlement Pending',

  // Categories & Labels
  '관세': 'Customs Duty',
  '해외배송비': 'Global Shipping Fee',
  '부가세': 'VAT',
  '통관수수료': 'Customs Clearance Fee',
  '전자제품': 'Electronics',
  '패션/의류': 'Fashion & Apparel',
  '신발/잡화': 'Shoes & Accessories',
  '뷰티/화장품': 'Beauty & Cosmetics',
  '식품/영양제': 'Food & Supplements',
  '스포츠/레저': 'Sports & Outdoors',
  '리빙/가구': 'Living & Furniture',
  '모든 카테고리': 'All Categories',

  // Common UI Elements & Buttons
  '검색': 'Search',
  '검색어를 입력하세요': 'Enter search keyword...',
  '전체': 'All',
  '조회': 'Inquire',
  '초기화': 'Reset',
  '필터': 'Filter',
  '저장': 'Save',
  '수정': 'Edit',
  '삭제': 'Delete',
  '취소': 'Cancel',
  '확인': 'Confirm',
  '닫기': 'Close',
  '신청': 'Apply',
  '신청하기': 'Apply Now',
  '결제하기': 'Pay Now',
  '계산하기': 'Calculate',
  '자세히 보기': 'View Details',
  '전체보기': 'View All',
  '추가하기': 'Add New',
  '등록': 'Register',
  '등록하기': 'Register Now',
  '구매하기': 'Buy Now',
  '장바구니 담기': 'Add to Cart',
  '배송지 추가': 'Add Address',
  '카드 추가': 'Add Card',
  '기본 배송지': 'Default Address',
  '기본 카드': 'Default Card',
  '설정': 'Set Default',

  // MyPage
  '개인통관고유부호': 'Personal Customs Code (PCCC)',
  '통관고유부호': 'PCCC Code',
  '배송지 관리': 'Shipping Addresses',
  '결제수단 관리': 'Payment Methods',
  '최근 결제 내역': 'Recent Transactions',
  '신규 배송지 등록': 'Add New Address',
  '신규 결제 카드 등록': 'Add New Payment Card',
  '주소': 'Address',
  '우편번호': 'Zip Code',
  '기본 배송지로 설정': 'Set as default address',
  '카드 종류': 'Card Type',
  '카드 별칭': 'Card Name',
  '카드 번호': 'Card Number',

  // Customs Calculator
  '관부가세 실시간 계산기': 'Real-Time Customs & Tax Calculator',
  '상품 금액 (USD)': 'Product Price (USD)',
  '현지 배송비 (USD)': 'Local Shipping Fee (USD)',
  '무게 (kg)': 'Weight (kg)',
  '예상 관세': 'Estimated Duty',
  '예상 부가세': 'Estimated VAT',
  '예상 총 부담금액': 'Estimated Total Tax',
  '목록통관 기준 (150 USD 이하 면세, 미국 200 USD)': 'De Minimis Exemption ($150 / US $200)',
  '일반통관 (과세 대상)': 'Standard Customs Clearance (Taxable)',

  // Payments View
  '통관 및 납부 내역': 'Customs & Payment Records',
  '통관 진행 상태': 'Customs Status',
  '납부 금액': 'Payment Amount',
  '결제 수단': 'Payment Method',
  '주문 번호': 'Order Number',
  '주문일자': 'Order Date',
  '카카오페이 간편결제': 'Kakao Pay Easy Payment',
  '즉시 결제': 'Instant Pay',

  // Shopping Malls View
  '연동 가능 해외 쇼핑몰': 'Supported Overseas Shopping Malls',
  '해외 공식몰 및 메이저 마켓플레이스 자동 주문 수집': 'Automated order collection for official overseas stores',
  '바로가기': 'Visit Mall',
  '자동연동 설정': 'Auto-Sync Setup',
  '연동 완료': 'Connected',
  '연동 하기': 'Connect Now',

  // Warehouse View
  '해외 거점 배대지센터': 'Global Warehouse Hubs',
  '배송대행 및 입출고 현황': 'Fulfillment & Inbound/Outbound Status',
  '사전 입고 신청': 'Pre-Inbound Request',
  '트래킹 번호': 'Tracking Number',
  '입고 일자': 'Arrival Date',
  '배송지 센터': 'Warehouse Hub',
  '보관함': 'Storage Locker',

  // Search Product & AI Sourcing
  '스마트 글로벌 소싱': 'Smart Global Sourcing',
  '인기 직구 상품': 'Trending Global Products',
  '최저가 소싱처': 'Best Price Supplier',
  '예상 마진율': 'Est. Margin Rate',
  '소싱 신청': 'Sourcing Request',
  '상품명': 'Product Name',
  '카테고리': 'Category',
  '현지 가격': 'Local Price',
  '최종 예상가': 'Final Est. Price',

  // Seller Portal
  '총 매출': 'Total Revenue',
  '누적 주문수': 'Total Orders',
  '평균 마진율': 'Avg Margin',
  '배송 지연율': 'Delivery Delay Rate',
  '수익 및 수요 분석': 'Analytics & Revenue',
  '구매 문의 관리': 'Customer Inquiries',
  '물류 현황': 'Logistics Status',
  '최근 주문 목록': 'Recent Orders List',
  '수주 상태': 'Order Status',

  // Common phrases
  '원': ' KRW',
  '달러': ' USD',
  '개': ' pcs',
  '건': ' items',
  '일': ' days',
};

/**
 * Helper function to translate a string into English when lang === 'EN'.
 */
export function translateText(text: string, lang: 'KO' | 'EN'): string {
  if (lang !== 'EN' || !text) return text;
  
  // Direct exact match
  const trimmed = text.trim();
  if (TRANSLATIONS_MAP[trimmed]) {
    return TRANSLATIONS_MAP[trimmed];
  }

  // Replace substrings for common patterns
  let translated = text;

  // Replace common numbers + suffixes e.g. "125,000원" -> "125,000 KRW", "2건" -> "2 items"
  translated = translated.replace(/(\d+[\d,]*)\s*원/g, '$1 KRW');
  translated = translated.replace(/(\d+[\d,]*)\s*달러/g, '$1 USD');
  translated = translated.replace(/(\d+)\s*건/g, '$1 items');
  translated = translated.replace(/(\d+)\s*개/g, '$1 pcs');

  // Replace known terms inside text if not an exact match
  Object.keys(TRANSLATIONS_MAP).forEach((key) => {
    if (key.length > 2 && translated.includes(key)) {
      translated = translated.replaceAll(key, TRANSLATIONS_MAP[key]);
    }
  });

  return translated;
}
