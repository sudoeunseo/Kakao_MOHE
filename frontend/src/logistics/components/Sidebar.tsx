import React from 'react';
import { ViewType, UserProfile } from '../types';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  userProfile: UserProfile;
  activeSellerTab?: string;
  onSelectSellerTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  userProfile,
  activeSellerTab = 'dashboard',
  onSelectSellerTab,
}) => {
  const { t } = useLanguage();
  const isSeller = currentView === 'seller' || userProfile.role.includes('판매자');

  // Seller Navigation Items
  const sellerMenuItems = [
    { id: 'dashboard', label: t('홈 / 대시보드', 'Dashboard'), icon: 'dashboard' },
    { id: 'orders', label: t('주문 관리', 'Order Management'), icon: 'package_2' },
    { id: 'logistics', label: t('물류 관리', 'Logistics Management'), icon: 'local_shipping' },
    { id: 'warehouse', label: t('배대지 관리', 'Warehouse Management'), icon: 'home_work' },
    { id: 'analytics', label: t('분석 / 수익분석', 'Analytics & Revenue'), icon: 'analytics' },
    { id: 'inquiries', label: t('구매 문의', 'Customer Inquiries'), icon: 'support_agent' },
    { id: 'settings', label: t('설정 / 관리', 'Settings'), icon: 'settings' },
  ];

  // Buyer Navigation Items
  const buyerMenuItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'landing', label: t('메인 홈', 'Home'), icon: 'home' },
    { id: 'search', label: t('상품 찾기', 'Search Products'), icon: 'search' },
    { id: 'shopping', label: t('해외 쇼핑몰', 'Shopping Malls'), icon: 'storefront' },
    { id: 'ai-sourcing', label: t('AI 추천 / 스마트 소싱', 'AI Sourcing'), icon: 'smart_toy' },
    { id: 'calculator', label: t('관부가세 계산기', 'Customs Calculator'), icon: 'calculate' },
    { id: 'warehouse', label: t('배송조회 / 해외배송센터', 'Shipment Tracking'), icon: 'local_shipping' },
    { id: 'payments', label: t('통관·결제 / 납부내역', 'Customs & Payments'), icon: 'payments' },
    { id: 'mypage', label: t('마이페이지', 'My Page'), icon: 'person' },
  ];

  if (isSeller) {
    return (
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[260px] bg-[#1E2A44] border-r border-[#3b4662] py-6 px-4 z-50 overflow-y-auto text-white">
        {/* Seller Brand Header */}
        <div className="mb-6 px-2 flex flex-col items-center">
          <Logo 
            size="md" 
            variant="light"
            onClick={() => onNavigate('landing')} 
          />
          <span className="text-[11px] font-bold tracking-wider mt-2 bg-[#004395]/60 text-[#81E6D9] px-2.5 py-0.5 rounded-full border border-[#81E6D9]/40 uppercase">
            SELLER ACCOUNT
          </span>
        </div>

        {/* Seller Navigation Menu */}
        <ul className="flex flex-col gap-1 flex-grow">
          {sellerMenuItems.map((item) => {
            const isActive = activeSellerTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (onSelectSellerTab) {
                      onSelectSellerTab(item.id);
                    }
                    if (currentView !== 'seller') {
                      onNavigate('seller');
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#FFCD00] text-[#191919] font-bold shadow-sm'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom Seller Profile Footer */}
        <div className="mt-auto pt-4 border-t border-white/20">
          <div className="p-3 bg-white/10 rounded-xl border border-white/15 mb-3 flex items-center gap-3">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-contain bg-white p-0.5 border border-yellow-400 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-white truncate">
                {userProfile.name === '홍길동' ? t('모해 스토어', 'MOHE Store') : userProfile.name}
              </p>
              <p className="text-[10px] text-[#81E6D9] font-semibold truncate">{t('판매자 관리자', 'Seller Admin')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => onNavigate('login')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>{t('로그아웃', 'Log Out')}</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[260px] bg-white border-r border-[#E1E2E4] py-6 px-4 z-50 overflow-y-auto">
      {/* Brand Header */}
      <div className="mb-6 px-2 flex flex-col items-center">
        <Logo 
          size="md" 
          onClick={() => onNavigate('landing')} 
        />
        <span className="text-[11px] font-bold tracking-wider mt-2 bg-[#1E2A44] text-white px-2.5 py-0.5 rounded-full border border-[#1E2A44] uppercase shadow-sm">
          BUYER ACCOUNT
        </span>
      </div>

      {/* Navigation Menu */}
      <ul className="flex flex-col gap-1 flex-grow">
        {buyerMenuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#FFCD00] text-[#191919] font-bold shadow-sm scale-[0.99]'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#08152e]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom Footer Section */}
      <div className="mt-auto pt-4 border-t border-[#E1E2E4]">
        <div className="p-3 bg-[#F8F9FB] rounded-xl border border-gray-200 mb-3 flex items-center gap-3">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-9 h-9 rounded-full object-contain bg-white border border-yellow-400 p-0.5"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-gray-900 truncate">{userProfile.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{userProfile.customsCode}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => onNavigate('login')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>{t('로그아웃', 'Log Out')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
