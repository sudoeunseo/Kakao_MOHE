import React, { useState } from 'react';
import { ViewType, UserProfile } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  userProfile: UserProfile;
  lang: 'KO' | 'EN';
  onToggleLang: (lang: 'KO' | 'EN') => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userProfile,
  lang,
  onToggleLang,
  isLoggedIn = false,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLanding = currentView === 'landing';
  const isLogin = currentView === 'login';
  const isFullWidth = isLanding || isLogin;

  return (
    <header className={`border-b border-border-subtle fixed top-0 left-0 right-0 z-40 transition-all duration-150 h-[64px] flex flex-col justify-center shadow-sm ${
      isFullWidth ? 'bg-[#f8f9fb] text-[#191c1e]' : 'bg-white text-gray-900 md:ml-[260px] md:w-[calc(100%-260px)]'
    }`}>
      <div className="flex items-center justify-between px-4 sm:px-6 w-full h-full">
        {/* Brand Logo Component (High Resolution Vector) */}
        <Logo 
          size="md" 
          onClick={() => onNavigate('landing')} 
        />

        {/* Right Trailing Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Toggle */}
          <div className="hidden sm:flex bg-[#f2f4f6] rounded-full p-1 border border-[#E1E2E4] items-center relative">
            <button
              type="button"
              onClick={() => onToggleLang('KO')}
              className={`relative px-3.5 py-1 rounded-full font-bold text-xs transition-all cursor-pointer select-none ${
                lang === 'KO' ? 'bg-[#FFCD00] text-[#191919] shadow-sm' : 'text-gray-500 hover:text-[#08152e]'
              }`}
            >
              KO
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('EN')}
              className={`relative px-3.5 py-1 rounded-full font-bold text-xs transition-all cursor-pointer select-none ${
                lang === 'EN' ? 'bg-[#FFCD00] text-[#191919] shadow-sm' : 'text-gray-500 hover:text-[#08152e]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Action Button on Landing / Login View */}
          {isLanding ? (
            <button
              onClick={() => onNavigate(isLoggedIn ? 'mypage' : 'login')}
              className="px-4 py-2 text-xs font-bold bg-[#FFCD00] text-[#191919] rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">{isLoggedIn ? 'dashboard' : 'login'}</span>
              {isLoggedIn ? '마이 포털' : '로그인 / 시작하기'}
            </button>
          ) : isLogin ? (
            <button
              onClick={() => onNavigate('landing')}
              className="px-4 py-2 text-xs font-bold bg-[#1E2A44] text-white rounded-xl hover:bg-[#08152e] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              메인 홈으로
            </button>
          ) : isLoggedIn ? (
            <button
              onClick={() => onNavigate(userProfile.role.includes('판매자') || currentView === 'seller' ? 'seller' : 'mypage')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#1E2A44] text-white rounded-lg hover:bg-opacity-90 transition-all hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              {userProfile.role.includes('판매자') || currentView === 'seller' ? '판매자 포털' : '마이 포털'}
            </button>
          ) : null}

          {/* Logged in Only: Notifications & Customs Calculator */}
          {isLoggedIn && (
            <>
              {/* Notifications Icon Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center relative cursor-pointer"
                  title="알림"
                >
                  <span className="material-symbols-outlined text-xl">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Popup */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 font-bold text-gray-800">
                      <span>알림</span>
                      <span className="text-xs text-[#0058bc] cursor-pointer" onClick={() => setShowNotifications(false)}>모두 읽음</span>
                    </div>
                    <div className="py-2 space-y-3">
                      <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="font-semibold text-gray-900">통관 관부가세 납부 안내</p>
                        <p className="text-xs text-gray-500 mt-0.5">애플 맥북 프로 16인치 관세 ₩45,000 납부 대기 중입니다.</p>
                      </div>
                      <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="font-semibold text-gray-900">미국 델라웨어 센터 입고 완료</p>
                        <p className="text-xs text-gray-500 mt-0.5">Keychron Q1 Pro 키보드 실측 무게 1.8kg 등록됨.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help / Calculator Button (Right before profile) */}
              <button
                onClick={() => onNavigate('calculator')}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                title="관부가세 계산기 (로그인됨)"
              >
                <span className="material-symbols-outlined text-xl">calculate</span>
              </button>
            </>
          )}

          {/* Profile Menu Dropdown or Login Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors flex items-center gap-1.5 border border-gray-200 cursor-pointer"
                title="프로필 메뉴"
              >
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-contain bg-white p-0.5 border border-gray-200"
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 text-sm">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-9 h-9 rounded-full object-contain bg-white border border-yellow-400 p-0.5"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{userProfile.name}</p>
                      <p className="text-xs text-gray-500">통관번호: {userProfile.customsCode}</p>
                      <span className="inline-block text-[10px] bg-[#FFCD00] text-[#191919] font-bold px-1.5 py-0.5 rounded mt-0.5">
                        {userProfile.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { onNavigate('mypage'); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    마이페이지
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                      else onNavigate('login');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : !isLogin ? (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-black font-bold text-xs transition-all shadow-sm cursor-pointer"
              title="로그인 필요"
            >
              <span className="material-symbols-outlined text-lg text-gray-500">account_circle</span>
              <span>로그인</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
