import React, { useState } from 'react';
import { WarehousePackage, ViewType } from '../types';

interface WarehouseViewProps {
  packages: WarehousePackage[];
  onPayShipping: (pkgIds: string[]) => void;
  onNavigate: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  packages,
  onPayShipping,
  showToast
}) => {
  const [selectedPkgIds, setSelectedPkgIds] = useState<string[]>(['pkg-1', 'pkg-2']);

  const toggleSelectPackage = (id: string) => {
    setSelectedPkgIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const totalFeeUsd = packages
    .filter((p) => selectedPkgIds.includes(p.id))
    .reduce((sum, p) => sum + p.shippingFeeUsd, 0);

  const totalFeeKrw = Math.round(totalFeeUsd * 1380);

  return (
    <div className="md:ml-[260px] pt-[80px] p-6 md:p-8 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">MOHE 해외배송센터</h2>
            <p className="text-xs text-gray-500 mt-0.5">미국, 일본, 중국 현지 물류센터 입고 현황 및 합배송을 관리하세요.</p>
          </div>
          <button
            onClick={() => showToast('새 입고 신청서 작성 모달이 열립니다.')}
            className="bg-[#1E2A44] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#08152e] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            배송대행 신청하기
          </button>
        </div>

        {/* Global Hubs Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Delaware */}
          <div className="bg-white rounded-2xl border border-[#E1E2E4] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <span className="text-lg">🇺🇸</span> 미국 (델라웨어)
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                운영중
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">소비세(Sales Tax) 면제 지역 물류센터</p>
            <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-bold text-[#08152e]">
              <span>보관중인 상품</span>
              <span className="text-blue-600">2건</span>
            </div>
          </div>

          {/* Tokyo */}
          <div className="bg-white rounded-2xl border border-[#E1E2E4] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <span className="text-lg">🇯🇵</span> 일본 (도쿄)
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                운영중
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">피규어 및 잡화 당일 검수 센터</p>
            <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-bold text-[#08152e]">
              <span>보관중인 상품</span>
              <span className="text-amber-600">입고 대기 1건</span>
            </div>
          </div>

          {/* Weihai */}
          <div className="bg-white rounded-2xl border border-[#E1E2E4] p-5 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <span className="text-lg">🇨🇳</span> 중국 (웨이하이)
              </span>
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                운영중
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">해상 최단거리 인접 초간편 물류기지</p>
            <div className="pt-2 border-t border-gray-100 flex justify-between text-xs font-bold text-gray-400">
              <span>보관중인 상품</span>
              <span>0건</span>
            </div>
          </div>
        </div>

        {/* Packages List Section */}
        <div className="bg-white rounded-2xl border border-[#E1E2E4] p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900">센터 입고 패키지 목록</h3>
            <span className="text-xs text-gray-500">
              선택한 패키지: <strong className="text-[#08152e]">{selectedPkgIds.length}개</strong>
            </span>
          </div>

          <div className="space-y-3">
            {packages.map((pkg) => {
              const isSelected = selectedPkgIds.includes(pkg.id);
              return (
                <div
                  key={pkg.id}
                  onClick={() => toggleSelectPackage(pkg.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-[#1E2A44] bg-blue-50/40 ring-1 ring-[#1E2A44]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by parent onClick
                      className="w-4 h-4 rounded text-[#1E2A44]"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">{pkg.productName}</span>
                        <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                          {pkg.hubLocation}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">
                        운송장: {pkg.trackingNumber} | 보관기간: {pkg.daysStored}일
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 text-xs border-t md:border-t-0 pt-2 md:pt-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <p className="text-gray-500 text-[11px]">실측 무게: {pkg.estimatedWeightKg}kg</p>
                      <p className="font-extrabold text-sm text-[#08152e] mt-0.5">
                        ${pkg.shippingFeeUsd.toFixed(2)} (약 ₩{Math.round(pkg.shippingFeeUsd * 1380).toLocaleString()})
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pkg.status === '실측 완료' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pkg.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Consolidation Banner */}
        <div className="p-6 rounded-2xl bg-[#08152e] text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <p className="text-xs text-[#FFCD00] font-bold uppercase tracking-wider mb-1">
              Consolidation & Shipping Fee
            </p>
            <h4 className="text-lg font-bold">
              선택한 {selectedPkgIds.length}개 상품 묶음배송 예상 배송비: <span className="text-[#FFCD00]">${totalFeeUsd.toFixed(2)}</span>
            </h4>
            <p className="text-xs text-gray-300 mt-0.5">원화 결제 예상 금액: 약 ₩{totalFeeKrw.toLocaleString()}</p>
          </div>

          <button
            onClick={() => {
              if (selectedPkgIds.length === 0) {
                showToast('결제할 패키지를 하나 이상 선택하세요.');
                return;
              }
              onPayShipping(selectedPkgIds);
            }}
            className="w-full md:w-auto bg-[#FFCD00] text-[#191919] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-yellow-400 transition-all whitespace-nowrap shadow-md"
          >
            합배송 및 배송비 결제
          </button>
        </div>
      </div>
    </div>
  );
};
