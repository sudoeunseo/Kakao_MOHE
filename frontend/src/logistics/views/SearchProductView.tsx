import React, { useState } from 'react';
import { RecommendedProduct, ViewType } from '../types';

interface SearchProductViewProps {
  recommendedProducts: RecommendedProduct[];
  onOpenRequestModal: () => void;
  onNavigate: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const SearchProductView: React.FC<SearchProductViewProps> = ({
  recommendedProducts,
  onOpenRequestModal,
  onNavigate,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: '의류', icon: 'styler' },
    { name: '신발', icon: 'footprint' },
    { name: '뷰티', icon: 'brush' },
    { name: '전자제품', icon: 'devices' },
    { name: '식품', icon: 'restaurant' },
    { name: '액세서리', icon: 'watch' },
    { name: '리빙', icon: 'chair' },
    { name: '취미', icon: 'sports_esports' },
  ];

  const hashtags = ['# 여름신상', '# 캠핑용품', '# 홈데코', '# 건강식품'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    showToast(`'${searchTerm}' 검색 결과입니다.`);
  };

  // Filter products by selectedCategory and searchTerm
  const filteredProducts = recommendedProducts.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = searchTerm 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="md:ml-[260px] pt-[80px] p-6 md:p-8 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-4xl mx-auto">
        {/* Search Input Section */}
        <section className="mb-8">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full h-14 rounded-full bg-white border border-[#E1E2E4] shadow-sm focus-within:border-[#1E2A44] transition-all">
            <span className="material-symbols-outlined absolute left-5 text-gray-400 text-2xl">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요 (예: 여름 원피스, 키보드, 스킨케어)"
              className="w-full h-full pl-14 pr-32 rounded-full bg-transparent border-none outline-none font-medium text-gray-900 placeholder-gray-400 focus:ring-0 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-6 h-10 rounded-full bg-[#FFCD00] text-[#191919] font-bold text-xs hover:bg-yellow-400 transition-colors shadow-sm"
            >
              검색
            </button>
          </form>

          {/* Quick Filters / Tags */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {hashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const cleaned = tag.replace('# ', '');
                  setSearchTerm(cleaned);
                  showToast(`'${cleaned}' 키워드로 검색했습니다.`);
                }}
                className="px-4 py-1.5 rounded-full border border-[#E1E2E4] bg-white text-gray-600 font-medium text-xs hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">카테고리 탐색</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                전체보기
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedCategory(null);
                      showToast('전체 카테고리 보기');
                    } else {
                      setSelectedCategory(cat.name);
                      showToast(`'${cat.name}' 카테고리 (상품 3개)`);
                    }
                  }}
                  className={`group flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#1E2A44] text-white border-[#1E2A44] shadow-md ring-2 ring-[#FFCD00]'
                      : 'bg-white border-[#E1E2E4] text-gray-800 hover:shadow-md'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                    isSelected ? 'bg-white/20 text-[#FFCD00]' : 'bg-[#f2f4f6] text-gray-700 group-hover:bg-[#FFCD00] group-hover:text-[#191919]'
                  }`}>
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                  </div>
                  <span className="font-semibold text-xs text-center">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Product Results Section */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedCategory ? `'${selectedCategory}' 카테고리 상품` : searchTerm ? `'${searchTerm}' 검색 결과` : '전체 추천 상품'}
              </h3>
              <span className="text-xs font-bold bg-[#FFCD00] text-[#191919] px-2 py-0.5 rounded-full">
                {filteredProducts.length}개
              </span>
            </div>
            <button
              onClick={() => onNavigate('ai-sourcing')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              AI 스마트 소싱 보기
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => showToast(`'${item.title}' 상품 상세 정보를 확인합니다.`)}
                  className="rounded-2xl border border-[#E1E2E4] bg-white overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 relative"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  >
                    <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-[#1E2A44]/90 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {item.category}
                    </span>
                    {item.rating && (
                      <span className="absolute top-3 right-3 text-[11px] font-bold text-gray-900 bg-white/90 px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                        <span className="material-symbols-outlined text-yellow-500 text-xs">star</span>
                        {item.rating}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">{item.title}</h4>
                    <div className="flex justify-between items-baseline mt-3">
                      <div>
                        <p className="text-base font-extrabold text-[#08152e]">₩{item.priceKrw.toLocaleString()}</p>
                        {item.priceUsd && (
                          <p className="text-[11px] text-gray-400 font-medium">${item.priceUsd.toFixed(2)} USD</p>
                        )}
                      </div>
                      <button className="text-xs font-bold text-[#1E2A44] bg-yellow-100 hover:bg-[#FFCD00] px-3 py-1.5 rounded-lg transition-colors">
                        소싱 신청
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6">
              <span className="material-symbols-outlined text-gray-300 text-5xl mb-2">search_off</span>
              <h3 className="text-base font-bold text-gray-800">해당 조건의 상품을 찾지 못했습니다.</h3>
              <p className="text-xs text-gray-500 mt-1">다른 키워드나 카테고리를 선택해 보세요.</p>
            </div>
          )}
        </section>

        {/* Sourcing Request Card */}
        <section className="p-6 md:p-8 rounded-2xl bg-yellow-50/80 border border-yellow-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-8">
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">찾는 상품이 카탈로그에 없으신가요?</h3>
            <p className="text-xs text-gray-600">Kakao MOHE 전담 소싱팀에 URL이나 이미지로 등록을 요청해보세요.</p>
          </div>
          <button
            onClick={onOpenRequestModal}
            className="px-6 py-3 rounded-xl bg-[#FFCD00] text-[#191919] font-bold text-xs hover:bg-yellow-400 transition-all shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add_box</span>
            맞춤 상품 요청하기
          </button>
        </section>
      </div>
    </div>
  );
};
