import React, { useState } from 'react';
import { ShoppingMall, ViewType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ShoppingMallsViewProps {
  malls: ShoppingMall[];
  onNavigate: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const ShoppingMallsView: React.FC<ShoppingMallsViewProps> = ({
  malls,
  onNavigate,
  showToast
}) => {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const countries = ['전체', '미국', '일본', '중국', '유럽'];

  const filteredMalls = malls.filter((mall) => {
    const matchesCountry = selectedCountry === '전체' || mall.country === selectedCountry;
    const matchesQuery = searchQuery === '' || 
      mall.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      mall.description.includes(searchQuery);
    return matchesCountry && matchesQuery;
  });

  return (
    <div className="md:ml-[260px] pt-[80px] p-6 md:p-8 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('해외 쇼핑몰')}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('글로벌 인기 직구 사이트를 한눈에 연결하고 주문을 자동으로 수집하세요.')}</p>
        </header>

        {/* Promo Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Banner 1 (Large Amazon Promo) */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[220px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 flex flex-col justify-between shadow-sm">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=1000')`
              }}
            />
            <div className="relative z-10">
              <span className="bg-[#FFCD00] text-[#191919] font-bold text-[11px] px-2.5 py-1 rounded-md inline-block mb-3">
                핫딜특가
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                아마존 Prime Day<br />사전예약 시작
              </h3>
              <p className="text-xs text-gray-300 mt-2">최대 50% 할인 혜택과 무료 직배송 찬스를 놓치지 마세요.</p>
            </div>
            <div className="relative z-10 pt-4">
              <button
                onClick={() => {
                  window.open('https://www.amazon.com', '_blank');
                  showToast('아마존으로 이동합니다. Kakao MOHE 통관 번호가 자동으로 연결됩니다.');
                }}
                className="bg-[#3b4662]/80 hover:bg-[#1E2A44] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all w-fit border border-white/20"
              >
                자세히보기
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Banner 2 (Rakuten Special) */}
          <div className="relative rounded-2xl overflow-hidden min-h-[220px] bg-[#f8f9fb] border border-[#E1E2E4] p-6 flex flex-col justify-between shadow-sm">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600')`
              }}
            />
            <div className="relative z-10">
              <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded inline-block mb-3">
                라쿠텐 단독
              </span>
              <h3 className="text-xl font-bold text-gray-900 leading-snug">
                일본 인기 디저트 기획전
              </h3>
              <p className="text-xs text-gray-600 mt-1">현지 직배송으로 신선하게</p>
            </div>
            <div className="relative z-10 pt-2">
              <button
                onClick={() => {
                  window.open('https://www.rakuten.co.jp', '_blank');
                  showToast('라쿠텐 일본 기획전으로 이동합니다.');
                }}
                className="bg-[#1E2A44] text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
              >
                기획전 구경하기
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar & Country Filters */}
        <section className="mb-8 bg-white p-4 rounded-2xl border border-[#E1E2E4] shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-gray-400 text-xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="쇼핑몰 이름, 국가, 카테고리 검색..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#F8F9FB] border border-[#E1E2E4] text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCountry === c
                      ? 'bg-[#FFCD00] text-[#191919] shadow-sm'
                      : 'bg-[#F8F9FB] text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
              <button
                onClick={() => showToast('상세 필터 모달이 준비중입니다.')}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                필터
              </button>
            </div>
          </div>
        </section>

        {/* Popular Malls Section */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-1">인기 쇼핑몰</h3>
          <p className="text-xs text-gray-500 mb-4">실시간 인기 직구 사이트를 확인해보세요.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {filteredMalls.map((mall) => (
              <div
                key={mall.id}
                className="bg-white rounded-2xl border border-[#E1E2E4] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 p-2 flex items-center justify-center overflow-hidden">
                      <img src={mall.logoUrl} alt={mall.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-600 flex items-center gap-1">
                      <span>{mall.countryFlag}</span>
                      <span>{mall.country}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-gray-900 mb-1">{mall.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {mall.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  {mall.badge && (
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      mall.badgeType === 'hot' ? 'text-red-600 bg-red-50' :
                      mall.badgeType === 'point' ? 'text-amber-600 bg-amber-50' :
                      mall.badgeType === 'free' ? 'text-green-600 bg-green-50' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {mall.badge}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      window.open(mall.url, '_blank');
                      showToast(`${mall.name} 쇼핑몰로 이동합니다.`);
                    }}
                    className="text-[#0058bc] font-bold hover:underline flex items-center gap-0.5 ml-auto"
                  >
                    쇼핑하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
