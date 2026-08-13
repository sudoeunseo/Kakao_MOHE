import React from 'react';
import { ViewType } from '../types';

interface LandingViewProps {
  onNavigate: (view: ViewType) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex flex-col bg-[#F8F9FB] min-h-screen pt-[64px]">
      {/* Hero Section */}
      <section className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden bg-[#08152e]">
        {/* Background Port Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-45"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1600')`
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-6 py-16 md:py-24 flex flex-col items-start gap-6 text-white">
          <span className="font-bold text-xs text-[#FFCD00] bg-[#1E2A44]/80 px-3.5 py-1.5 rounded border border-[#FFCD00]/40 uppercase tracking-widest shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#FFCD00]">public</span>
            <span>Kakao MOHE | 모두의 해외직구 Platform</span>
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            모두의 해외직구,<br />
            <span className="text-[#FFCD00]">Kakao MOHE</span>
          </h1>

          <p className="text-sm md:text-base text-gray-200 max-w-xl opacity-90 leading-relaxed font-normal">
            <strong className="text-white font-bold">'MOHE (모두의 해외직구)'</strong>는 복잡한 크로스보더 커머스와 직구를 누구나 쉽고 안전하게 이용할 수 있는 원스톱 플랫폼입니다. 해외 상품 탐색부터 AI 최적 소싱, 관부가세 간편결제 및 실시간 수입통관까지 모두를 위한 직구 경험을 제공합니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('login')}
              className="bg-[#FFCD00] text-[#191919] font-bold px-7 py-3.5 rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 shadow-md hover:scale-105"
            >
              시작하기 / 로그인
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            <button
              onClick={() => onNavigate('shopping')}
              className="bg-transparent border border-white/80 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              해외 쇼핑몰 둘러보기
            </button>
          </div>
        </div>
      </section>

      {/* Service Flow Diagram Section */}
      <section className="w-full py-16 md:py-24 bg-[#F8F9FB]">
        <div className="w-full max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#08152e] mb-3">
              단절 없는 물류 프로세스
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Kakao MOHE는 파편화된 물류 단계를 하나의 매끄러운 파이프라인으로 연결하여, 기업의 운영 리소스를 최소화하고 가시성을 극대화합니다.
            </p>
          </div>

          {/* Process Steps Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E1E2E4] flex flex-col items-center text-center relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f2f4f6] rounded-full flex items-center justify-center mb-4 text-[#08152e]">
                <span className="material-symbols-outlined text-2xl">inventory_2</span>
              </div>
              <h3 className="font-bold text-[#08152e] text-sm mb-1.5">상품 등록/연동</h3>
              <p className="text-xs text-gray-500 leading-relaxed">다양한 채널의 상품 정보를 한 곳에서 관리</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E1E2E4] flex flex-col items-center text-center relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f2f4f6] rounded-full flex items-center justify-center mb-4 text-[#08152e]">
                <span className="material-symbols-outlined text-2xl">shopping_cart_checkout</span>
              </div>
              <h3 className="font-bold text-[#08152e] text-sm mb-1.5">주문 수집</h3>
              <p className="text-xs text-gray-500 leading-relaxed">글로벌 마켓의 주문을 실시간으로 취합</p>
            </div>

            {/* Step 3 (Highlighted) */}
            <div className="bg-[#08152e] p-6 rounded-2xl border border-[#1e2a44] flex flex-col items-center text-center relative group shadow-lg transform lg:-translate-y-2 transition-all">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 text-[#FFCD00]">
                <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
              </div>
              <h3 className="font-bold text-white text-sm mb-1.5">자동화 처리</h3>
              <p className="text-xs text-gray-300 opacity-90 leading-relaxed">AI 기반 최적 라우팅 및 출고 지시</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E1E2E4] flex flex-col items-center text-center relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f2f4f6] rounded-full flex items-center justify-center mb-4 text-[#08152e]">
                <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
              </div>
              <h3 className="font-bold text-[#08152e] text-sm mb-1.5">국제 운송</h3>
              <p className="text-xs text-gray-500 leading-relaxed">항공/해상 운송 및 통관 프로세스</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E1E2E4] flex flex-col items-center text-center relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f2f4f6] rounded-full flex items-center justify-center mb-4 text-[#08152e]">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <h3 className="font-bold text-[#08152e] text-sm mb-1.5">라스트마일</h3>
              <p className="text-xs text-gray-500 leading-relaxed">현지 파트너사를 통한 정확한 배송</p>
            </div>

            {/* Step 6 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E1E2E4] flex flex-col items-center text-center relative group shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f2f4f6] rounded-full flex items-center justify-center mb-4 text-[#08152e]">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 className="font-bold text-[#08152e] text-sm mb-1.5">정산/통계</h3>
              <p className="text-xs text-gray-500 leading-relaxed">투명한 비용 정산 및 실적 분석</p>
            </div>
          </div>
        </div>
      </section>

      {/* MOHE AI Intelligence Cards (Bento Grid) */}
      <section className="w-full py-16 bg-white border-t border-[#E1E2E4]">
        <div className="w-full max-w-[1280px] mx-auto px-6">
          <div className="mb-10">
            <span className="font-bold text-xs text-[#08152e] bg-[#08152e]/10 px-3 py-1 rounded border border-[#08152e]/20 mb-3 inline-block tracking-wider">
              CORE TECHNOLOGY
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#08152e]">
              MOHE AI Intelligence
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-xl">
              단순한 관리를 넘어, 데이터를 기반으로 선제적인 의사결정을 지원합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#F8F9FB] border border-[#E1E2E4] rounded-2xl p-8 flex flex-col lg:col-span-2 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#1E2A44] text-white rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-xl">analytics</span>
              </div>
              <h3 className="text-xl font-bold text-[#08152e] mb-2">수요 예측 및 재고 최적화</h3>
              <p className="text-sm text-gray-600 mb-6 max-w-lg leading-relaxed">
                과거 판매 데이터와 트렌드를 분석하여 재고 부족이나 과잉을 방지합니다. 적정 재고 수준을 유지하여 보관 비용을 절감하세요.
              </p>
              <div className="mt-auto pt-4 border-t border-[#E1E2E4] w-full flex items-center justify-between text-sm font-semibold">
                <span className="text-gray-600">Accuracy Rate</span>
                <span className="text-[#08152e] font-bold text-base">94.2%</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1E2A44] text-white border border-transparent rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-lg">
              <div className="w-10 h-10 bg-[#FFCD00]/20 text-[#FFCD00] rounded-xl flex items-center justify-center mb-6 relative z-10">
                <span className="material-symbols-outlined text-xl">route</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">스마트 라우팅</h3>
              <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                비용, 시간, 통관 리스크를 종합적으로 고려하여 가장 효율적인 배송 경로를 자동으로 제안합니다.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8F9FB] border border-[#E1E2E4] rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-white shadow-sm text-[#08152e] rounded-xl flex items-center justify-center mb-6 border border-[#E1E2E4]">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-[#08152e] mb-2">이상 탐지 알림</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                배송 지연, 통관 보류 등 예상치 못한 이슈를 실시간으로 감지하고 담당자에게 즉시 알림을 발송하여 신속한 대응을 돕습니다.
              </p>
            </div>

            {/* Card 4 (Dashboard view) */}
            <div className="bg-[#F8F9FB] border border-[#E1E2E4] rounded-2xl flex flex-col lg:col-span-2 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow min-h-[220px]">
              <div className="absolute inset-0 z-0">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FB] via-[#F8F9FB]/90 to-transparent"></div>
              </div>
              <div className="relative z-10 p-8 flex flex-col h-full justify-center w-full md:w-3/5">
                <div className="w-10 h-10 bg-[#1E2A44] text-white rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-xl">dashboard</span>
                </div>
                <h3 className="text-xl font-bold text-[#08152e] mb-2">통합 대시보드</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  모든 물류 지표를 직관적인 UI로 한눈에 파악하세요. 사용자 맞춤형 위젯을 통해 필요한 데이터만 집중적으로 모니터링할 수 있습니다.
                </p>
                <button 
                  onClick={() => onNavigate('mypage')}
                  className="text-[#08152e] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  자세히 보기
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-[#f2f4f6] border-t border-[#E1E2E4]">
        <div className="w-full max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#08152e] mb-6">
            글로벌 비즈니스의 확장을 경험하세요
          </h2>
          <button
            onClick={() => onNavigate('login')}
            className="bg-[#1E2A44] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#08152e] transition-all shadow-md hover:scale-105"
          >
            서비스 시작하기
          </button>
        </div>
      </section>
    </div>
  );
};
