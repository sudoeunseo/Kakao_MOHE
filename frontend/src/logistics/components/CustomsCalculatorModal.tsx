import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface CustomsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCustomsCode: string;
}

type Currency = 'USD' | 'KRW' | 'EUR' | 'JPY' | 'CNY';

interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  flag: string;
  rateToKrw: number;
}

const CURRENCY_MAP: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: '미국 달러 (USD)', flag: '🇺🇸', rateToKrw: 1380 },
  KRW: { code: 'KRW', symbol: '₩', name: '대한민국 원 (KRW)', flag: '🇰🇷', rateToKrw: 1 },
  EUR: { code: 'EUR', symbol: '€', name: '유로화 (EUR)', flag: '🇪🇺', rateToKrw: 1500 },
  JPY: { code: 'JPY', symbol: '¥', name: '일본 엔화 (JPY)', flag: '🇯🇵', rateToKrw: 9.2 },
  CNY: { code: 'CNY', symbol: '¥', name: '중국 위안화 (CNY)', flag: '🇨🇳', rateToKrw: 192 },
};

export const CustomsCalculatorModal: React.FC<CustomsCalculatorModalProps> = ({
  isOpen,
  onClose,
  userCustomsCode
}) => {
  const { t } = useLanguage();
  const [country, setCountry] = useState<'US' | 'JP' | 'CN' | 'EU'>('US');
  const [category, setCategory] = useState<'electronics' | 'apparel' | 'supplements' | 'cosmetics' | 'general'>('electronics');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [itemPrice, setItemPrice] = useState<number>(180);
  const [shippingFee, setShippingFee] = useState<number>(15);

  if (!isOpen) return null;

  const currentCurrency = CURRENCY_MAP[currency];

  const handleCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === currency) return;
    const oldRate = CURRENCY_MAP[currency].rateToKrw;
    const newRate = CURRENCY_MAP[newCurrency].rateToKrw;

    const itemInKrw = itemPrice * oldRate;
    const shippingInKrw = shippingFee * oldRate;

    setItemPrice(Math.round(itemInKrw / newRate));
    setShippingFee(Math.round(shippingInKrw / newRate));
    setCurrency(newCurrency);
  };

  const handleCountryChange = (selectedCountry: 'US' | 'JP' | 'CN' | 'EU') => {
    setCountry(selectedCountry);
    if (selectedCountry === 'US') handleCurrencyChange('USD');
    else if (selectedCountry === 'JP') handleCurrencyChange('JPY');
    else if (selectedCountry === 'CN') handleCurrencyChange('CNY');
    else if (selectedCountry === 'EU') handleCurrencyChange('EUR');
  };

  const itemPriceKrw = itemPrice * currentCurrency.rateToKrw;
  const shippingFeeKrw = shippingFee * currentCurrency.rateToKrw;
  const totalValueKrw = itemPriceKrw + shippingFeeKrw;
  const totalValueUsd = totalValueKrw / 1380;

  const thresholdUsd = country === 'US' ? 200 : 150;
  const isDutyFree = totalValueUsd <= thresholdUsd;

  const dutyRateMap = {
    electronics: 0.0,
    apparel: 0.13,
    supplements: 0.08,
    cosmetics: 0.065,
    general: 0.08
  };

  const tariffRate = isDutyFree ? 0 : dutyRateMap[category];
  const vatRate = isDutyFree ? 0 : 0.10;

  const calculatedDutyKrw = Math.round(totalValueKrw * tariffRate);
  const calculatedVatKrw = Math.round((totalValueKrw + calculatedDutyKrw) * vatRate);
  const totalTaxKrw = calculatedDutyKrw + calculatedVatKrw;

  const calculatedDutySelectedCurrency = calculatedDutyKrw / currentCurrency.rateToKrw;
  const calculatedVatSelectedCurrency = calculatedVatKrw / currentCurrency.rateToKrw;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FFCD00] text-[#191919] rounded-xl">
              <span className="material-symbols-outlined text-xl">calculate</span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{t('관부가세 모의 계산기')}</h3>
              <p className="text-xs text-gray-500">{t('실시간 관세청 고시환율 적용')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Inputs */}
        <div className="py-4 space-y-4 text-sm">
          {/* Personal Customs Code info */}
          <div className="p-3 bg-[#F8F9FB] rounded-xl border border-gray-200 flex justify-between items-center text-xs">
            <span className="text-gray-600 font-medium">{t('나의 개인지통관고유부호')}</span>
            <span className="font-bold text-[#08152e] bg-[#FFCD00] px-2 py-0.5 rounded">{userCustomsCode}</span>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('발송 국가 (목록통관 기준)')}</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { code: 'US', label: `🇺🇸 ${t('미국')} ($200)` },
                { code: 'JP', label: `🇯🇵 ${t('일본')} ($150)` },
                { code: 'CN', label: `🇨🇳 ${t('중국')} ($150)` },
                { code: 'EU', label: `🇪🇺 ${t('유럽')} ($150)` },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleCountryChange(item.code as any)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                    country === item.code
                      ? 'bg-[#1E2A44] text-white border-[#1E2A44] shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700">{t('상품 금액 화폐 단위 선택')}</label>
              <span className="text-[11px] font-semibold text-gray-500">
                1 {currency} = ₩{currentCurrency.rateToKrw.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(CURRENCY_MAP) as Currency[]).map((cKey) => {
                const cInfo = CURRENCY_MAP[cKey];
                const isSelected = currency === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => handleCurrencyChange(cKey)}
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFCD00] text-[#191919] border-yellow-400 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cInfo.flag} {cKey}</span>
                    <span className="text-[10px] opacity-75 font-bold">({cInfo.symbol})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('품목 카테고리')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
            >
              <option value="electronics">{t('전자제품 (관세 0% / 부가세 10%)')}</option>
              <option value="apparel">{t('의류 / 신발 (관세 13% / 부가세 10%)')}</option>
              <option value="supplements">{t('건강기능식품 (관세 8% / 부가세 10%)')}</option>
              <option value="cosmetics">{t('화장품 (관세 6.5% / 부가세 10%)')}</option>
              <option value="general">{t('일반 잡화 (관세 8% / 부가세 10%)')}</option>
            </select>
          </div>

          {/* Price & Shipping */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('상품 금액')} ({currentCurrency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">
                  {currentCurrency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 pl-7 pr-3 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t('현지 배송비')} ({currentCurrency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">
                  {currentCurrency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 pl-7 pr-3 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
                />
              </div>
            </div>
          </div>

          {/* Tax Result Box */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#1E2A44] to-[#08152e] text-white space-y-2.5">
            <div className="flex justify-between items-center text-xs opacity-90 border-b border-white/10 pb-2">
              <span>{t('면세 기준')} ({country})</span>
              <span className={`font-extrabold px-2.5 py-0.5 rounded-full text-[11px] ${isDutyFree ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {isDutyFree ? t('면세 대상 (Duty Free)') : t('과세 대상 (Tax Applicable)')}
              </span>
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span className="text-gray-300">{t('총 신고 금액')}:</span>
              <span className="font-semibold">
                {currentCurrency.symbol}{ (itemPrice + shippingFee).toLocaleString() } ({currency})
                <span className="text-gray-400 ml-1.5 text-[11px]">
                  (약 ${totalValueUsd.toFixed(1)} / ₩{totalValueKrw.toLocaleString()})
                </span>
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-300">{t('추정 관세')} ({tariffRate * 100}%):</span>
              <span className="font-semibold">
                {currentCurrency.symbol}{calculatedDutySelectedCurrency.toFixed(2)} ({t('약')} ₩{calculatedDutyKrw.toLocaleString()})
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-300">{t('추정 부가가치세')} (10%):</span>
              <span className="font-semibold">
                {currentCurrency.symbol}{calculatedVatSelectedCurrency.toFixed(2)} ({t('약')} ₩{calculatedVatKrw.toLocaleString()})
              </span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-white/20 text-base font-black">
              <span className="text-[#FFCD00]">{t('총 예상 납부 세액')}</span>
              <span className="text-[#FFCD00] text-xl">₩{totalTaxKrw.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-11 bg-[#FFCD00] hover:bg-yellow-400 text-[#191919] font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {t('확인 및 닫기')}
          </button>
        </div>
      </div>
    </div>
  );
};
