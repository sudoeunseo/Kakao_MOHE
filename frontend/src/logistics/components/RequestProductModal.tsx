import React, { useState } from 'react';

interface RequestProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (productName: string) => void;
}

export const RequestProductModal: React.FC<RequestProductModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted
}) => {
  const [productName, setProductName] = useState('');
  const [country, setCountry] = useState('미국');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;
    onRequestSubmitted(productName);
    setProductName('');
    setUrl('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FFCD00] text-2xl">shopping_bag</span>
            <h3 className="font-bold text-lg text-gray-900">판매자 상품 소싱 요청</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-sm">
          <p className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
            원하는 해외 상품 정보나 URL을 남겨주시면 Kakao MOHE 해외 셀러가 빠르게 상품 등록 후 견적을 전달합니다.
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">상품명 또는 브랜드</label>
            <input
              type="text"
              required
              placeholder="예: 다이슨 에어랩 멀티 스트레이트너 핑크"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1E2A44] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">구매 대상 국가</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1E2A44] focus:outline-none"
            >
              <option value="미국">🇺🇸 미국</option>
              <option value="일본">🇯🇵 일본</option>
              <option value="중국">🇨🇳 중국</option>
              <option value="유럽">🇪🇺 유럽</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">참고 URL (선택)</label>
            <input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1E2A44] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">요청 수량 및 메모</label>
            <textarea
              rows={2}
              placeholder="필요 수량, 옵션, 예상 입고 희망일 등을 적어주세요."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1E2A44] focus:outline-none text-xs"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-[#FFCD00] text-[#191919] font-bold rounded-xl hover:bg-yellow-400 shadow-sm"
            >
              요청 제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
