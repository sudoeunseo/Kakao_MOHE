import React from 'react';
import { AISourcingItem, ViewType } from '../types';

interface AISourcingViewProps {
  items: AISourcingItem[];
  onNavigate: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const AISourcingView: React.FC<AISourcingViewProps> = ({
  items,
  showToast
}) => {
  const mainItem = items[0];

  return (
    <div className="md:ml-[260px] pt-[80px] p-6 md:p-8 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FFCD00] text-3xl">smart_toy</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI 스마트 소싱 & 추천</h2>
              <p className="text-xs text-gray-500 mt-0.5">구매 패턴과 관세 데이터를 학습한 AI가 최적의 해외 소싱처와 단가를 추천합니다.</p>
            </div>
          </div>
        </header>

        {/* Hero Top Recommendation Card */}
        {mainItem && (
          <div className="bg-gradient-to-br from-[#1E2A44] to-[#08152e] text-white rounded-3xl p-6 md:p-8 mb-8 shadow-xl relative overflow-hidden border border-[#3b4662]">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between relative z-10">
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#FFCD00] text-[#191919] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Best Match {mainItem.matchScore}%
                  </span>
                  <span className="text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-full">
                    {mainItem.origin}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-2 leading-snug">{mainItem.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">{mainItem.description}</p>

                {/* Price Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/10 p-4 rounded-2xl border border-white/10 text-xs mb-6">
                  <div>
                    <p className="text-gray-400 text-[10px]">상품 원가</p>
                    <p className="font-bold text-white text-sm mt-0.5">${mainItem.itemPriceUsd.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">예상 현지배송비</p>
                    <p className="font-bold text-white text-sm mt-0.5">${mainItem.shippingFeeUsd.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-[10px]">예상 관부가세</p>
                    <p className="font-bold text-white text-sm mt-0.5">${mainItem.customsTaxUsd.toFixed(2)}</p>
                  </div>
                  <div className="border-l border-white/20 pl-2">
                    <p className="text-[#FFCD00] text-[10px] font-bold">총 추정 수입원가</p>
                    <p className="font-extrabold text-[#FFCD00] text-sm mt-0.5">${mainItem.totalEstimatedUsd.toFixed(2)}</p>
                  </div>
                </div>

                <button
                  onClick={() => showToast(`'${mainItem.title}' AI 소싱 견적서 발송을 요청하였습니다.`)}
                  className="bg-[#FFCD00] hover:bg-yellow-400 text-[#191919] font-bold text-sm px-7 py-3 rounded-xl transition-all flex items-center gap-2 shadow-md"
                >
                  상세 견적서 요청 및 소싱
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>

              {/* Product Preview Image */}
              <div className="w-full lg:w-1/2 h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl relative">
                <img
                  src={mainItem.imageUrl}
                  alt={mainItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-[#FFCD00]">
                  기존 대비 {mainItem.savingsPercent}% 단가 절감
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B2B Sourcing Items Grid */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-1">카테고리별 AI 소싱 추천</h3>
          <p className="text-xs text-gray-500 mb-4">기업 구매자를 위한 검증된 해외 B2B 벌크 아이템입니다.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(1).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E1E2E4] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative bg-gray-100 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#1E2A44] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      매칭률 {item.matchScore}%
                    </span>
                    <span className="absolute top-3 right-3 bg-[#FFCD00] text-[#191919] text-[10px] font-bold px-2 py-1 rounded-md">
                      -{item.savingsPercent}% 절감
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-[10px] font-bold text-[#0058bc] bg-blue-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 mt-2 mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">예상 도매가</span>
                    <span className="font-extrabold text-sm text-[#08152e]">${item.totalEstimatedUsd.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => showToast(`'${item.title}' 소싱 요청이 등록되었습니다.`)}
                    className="bg-[#1E2A44] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#08152e] transition-colors"
                  >
                    소싱 요청
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
