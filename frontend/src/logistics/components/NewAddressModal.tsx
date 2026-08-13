import React, { useState } from 'react';
import { ShippingAddress } from '../types';

interface NewAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAddress: (address: ShippingAddress) => void;
}

export const NewAddressModal: React.FC<NewAddressModalProps> = ({
  isOpen,
  onClose,
  onAddAddress
}) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !postalCode) return;

    onAddAddress({
      id: `addr-${Date.now()}`,
      title,
      address,
      postalCode,
      isDefault
    });

    // Reset
    setTitle('');
    setAddress('');
    setPostalCode('');
    setIsDefault(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">새 배송지 주소 추가</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">배송지명 (예: 물류창고, 지사)</label>
            <input
              type="text"
              required
              placeholder="배송지명을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">우편번호</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="00000"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
              />
              <button
                type="button"
                onClick={() => setPostalCode('06164')}
                className="px-4 bg-gray-100 font-semibold text-xs rounded-xl hover:bg-gray-200"
              >
                우편번호 검색
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">도로명 주소</label>
            <input
              type="text"
              required
              placeholder="상세 주소를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="default-check"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded text-[#1E2A44]"
            />
            <label htmlFor="default-check" className="text-xs text-gray-700 font-medium cursor-pointer">
              기본 배송지로 설정
            </label>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 h-11 bg-[#1E2A44] text-white font-bold rounded-xl hover:opacity-90"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
