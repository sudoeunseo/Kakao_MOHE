import React, { useState } from 'react';
import { UserProfile, ShippingAddress, PaymentCard, ViewType } from '../types';
import { PICTOGRAM_AVATARS } from '../data/mockData';

interface MyPageViewProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: Partial<UserProfile>) => void;
  addresses: ShippingAddress[];
  cards: PaymentCard[];
  onOpenNewAddressModal: () => void;
  onNavigate: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  userProfile,
  onUpdateUserProfile,
  addresses,
  cards,
  onOpenNewAddressModal,
  onNavigate,
  showToast
}) => {
  const [userName, setUserName] = useState(userProfile.name);
  const [customsCode, setCustomsCode] = useState(userProfile.customsCode);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatarUrl);
  const [showPictoPicker, setShowPictoPicker] = useState(false);

  const handleSaveProfile = () => {
    onUpdateUserProfile({ name: userName, customsCode, avatarUrl: selectedAvatar });
    showToast('프로필 정보가 성공적으로 저장되었습니다!');
  };

  const handleSelectPicto = (url: string, name: string) => {
    setSelectedAvatar(url);
    onUpdateUserProfile({ avatarUrl: url });
    showToast(`프로필 사진이 '${name}'(으)로 변경되었습니다.`);
  };

  return (
    <div className="md:ml-[260px] pt-[80px] p-4 sm:p-6 md:p-8 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">마이페이지</h2>
          <p className="text-xs md:text-sm text-gray-500">프로필, 해외배송 주문내역, 통관 상태 및 결제 수단을 관리하세요.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (Bento Style) */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-[#E1E2E4] p-6 flex flex-col items-center text-center shadow-sm relative">
            {/* Avatar Badge */}
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#1E2A44] text-[#FFCD00] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">account_circle</span>
              프로필 사진
            </span>

            {/* Avatar Image Display */}
            <div className="w-28 h-28 rounded-full overflow-hidden mb-3 border-2 border-[#FFCD00] shadow-md bg-white p-1 relative group transition-transform hover:scale-105">
              <img
                src={selectedAvatar}
                alt={userProfile.name}
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            {/* Change Avatar Toggle Button */}
            <button
              onClick={() => setShowPictoPicker(!showPictoPicker)}
              className="text-xs font-bold text-[#08152e] hover:text-yellow-600 bg-gray-100 hover:bg-yellow-50 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors flex items-center gap-1 mb-4 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">photo_camera</span>
              <span>{showPictoPicker ? '닫기' : '프로필 사진 등록 / 변경'}</span>
            </button>

            {/* Avatar Selection Options Grid */}
            {showPictoPicker && (
              <div className="w-full mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-left animate-fadeIn">
                <p className="text-[11px] font-bold text-gray-700 mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">palette</span>
                  기본 프로필 사진 선택
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PICTOGRAM_AVATARS.map((picto) => {
                    const isSelected = selectedAvatar === picto.url;
                    return (
                      <button
                        key={picto.id}
                        type="button"
                        onClick={() => handleSelectPicto(picto.url, picto.name)}
                        className={`p-2 rounded-lg border text-center flex flex-col items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#FFCD00] bg-yellow-50 shadow-sm ring-2 ring-[#FFCD00]'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full mb-1 border border-gray-100 overflow-hidden bg-white">
                          <img src={picto.url} alt={picto.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-800 truncate w-full">
                          {picto.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-2 w-full">
              <label className="block text-[11px] text-gray-400 font-medium mb-0.5">이름</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-center font-bold text-lg text-gray-900 bg-[#f2f4f6] border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
              />
            </div>

            <div className="mb-2 w-full">
              <label className="block text-[11px] text-gray-400 font-medium mb-0.5">개인통관고유부호</label>
              <input
                type="text"
                value={customsCode}
                onChange={(e) => setCustomsCode(e.target.value)}
                className="w-full text-center text-xs font-bold text-[#08152e] bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FFCD00]"
              />
            </div>

            <p className="text-xs font-semibold text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full">
              {userProfile.role}
            </p>

            <button
              onClick={handleSaveProfile}
              className="bg-[#FFCD00] text-[#191919] font-extrabold px-6 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-all w-full shadow-sm cursor-pointer"
            >
              프로필 저장
            </button>
          </div>

          {/* Quick Stats / Recent Activity Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orders summary */}
            <div className="bg-white rounded-2xl border border-[#E1E2E4] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                      <span className="material-symbols-outlined text-xl">local_shipping</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">주문 내역</h4>
                      <p className="text-[11px] text-gray-500">최근 구매 및 배송 현황</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full text-xs shrink-0">
                    3건 진행중
                  </span>
                </div>

                {/* Most Recent Order Preview Box */}
                <div className="bg-[#F8F9FB] rounded-xl p-3.5 sm:p-4 border border-[#E1E2E4] mb-3 text-left space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1.5 text-[11px] font-bold text-gray-500">
                    <span className="text-[#08152e] font-extrabold">최근 주문 #MOHE-2026-8801</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 shrink-0">미국 델라웨어 센터 입고</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 leading-snug break-words">무선 기계식 키보드 Retro Edition</p>
                  <div className="flex justify-between items-center text-[11px] text-gray-500 pt-2 border-t border-gray-200/80">
                    <span>2026.08.10 주문</span>
                    <span className="font-black text-gray-900 text-xs">₩210,000</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('warehouse')}
                className="text-blue-600 font-bold text-xs hover:underline flex items-center justify-between pt-3 border-t border-gray-100 cursor-pointer"
              >
                <span>전체 주문 내역 보기 (3건)</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Customs clearance summary */}
            <div className="bg-white rounded-2xl border border-[#E1E2E4] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl shrink-0">
                      <span className="material-symbols-outlined text-xl">gavel</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">통관 내역</h4>
                      <p className="text-[11px] text-gray-500">관세 및 수입 통관 현황</p>
                    </div>
                  </div>
                  <span className="bg-[#00e8fd]/20 text-[#00646e] font-bold px-2.5 py-1 rounded-full text-xs shrink-0">
                    조치 필요
                  </span>
                </div>

                {/* Most Recent Customs Item Preview Box */}
                <div className="bg-[#F8F9FB] rounded-xl p-3.5 sm:p-4 border border-[#E1E2E4] mb-3 text-left space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-1.5 text-[11px] font-bold text-gray-500">
                    <span className="text-[#00646e] font-extrabold">신고번호 #12093-26-89021</span>
                    <span className="text-[#00646e] bg-[#00e8fd]/20 px-2 py-0.5 rounded border border-[#00e8fd]/40 shrink-0">관세 수납 대기</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-gray-900 leading-snug break-words">프리미엄 비건 스킨케어 세트 (목록통관)</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-500 pt-2 border-t border-gray-200/80">
                    <span className="shrink-0">2026.08.12 인천 세관</span>
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                      <span className="font-black text-purple-700 text-xs whitespace-nowrap">납부예정 ₩45,000</span>
                      <button
                        onClick={() => onNavigate('payments')}
                        className="bg-[#FFCD00] text-[#191919] font-extrabold px-3 py-1 rounded-lg text-[11px] hover:bg-yellow-400 transition-all shadow-sm shrink-0 cursor-pointer"
                      >
                        납부하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('payments')}
                className="text-[#006973] font-bold text-xs hover:underline flex items-center justify-between pt-3 border-t border-gray-100 cursor-pointer"
              >
                <span>전체 통관 및 관세 내역 보기</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E1E2E4] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">배송지 주소</h3>
              <button
                onClick={onOpenNewAddressModal}
                className="text-[#08152e] font-bold text-xs hover:underline flex items-center gap-1 bg-[#F8F9FB] px-3 py-1.5 rounded-lg border border-gray-200"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                새로 추가
              </button>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-[#E1E2E4] rounded-xl p-4 flex justify-between items-start hover:border-[#1E2A44] transition-colors bg-[#F8F9FB]"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                          기본
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{addr.address}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">우편번호: {addr.postalCode}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-700 p-1">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-[#E1E2E4] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">결제 수단</h3>
              <button 
                onClick={() => onNavigate('payments')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                관리
              </button>
            </div>

            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`border border-[#E1E2E4] rounded-xl p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                    card.isDefault ? 'bg-blue-50/50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="w-11 h-7 bg-white border border-gray-200 rounded flex items-center justify-center font-bold text-xs text-[#0058bc]">
                    {card.type}
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-xs text-gray-900">{card.name}</p>
                    <p className="text-[11px] text-gray-500">**** {card.lastFourDigits}</p>
                  </div>
                  {card.isDefault && (
                    <span className="material-symbols-outlined text-green-500 text-xl">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
