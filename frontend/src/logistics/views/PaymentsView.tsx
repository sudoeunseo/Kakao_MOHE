import React, { useState } from 'react';
import { Transaction, ViewType } from '../types';

interface PaymentsViewProps {
  transactions: Transaction[];
  onPayTransaction: (id: string) => void;
  onNavigate: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  transactions,
  onPayTransaction,
  showToast
}) => {
  const [filter, setFilter] = useState<'ALL' | 'DUTY' | 'SHIPPING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  // Filter logic
  const filteredTxs = transactions.filter((tx) => {
    if (filter === 'DUTY' && tx.category !== '관세') return false;
    if (filter === 'SHIPPING' && tx.category !== '해외배송비') return false;
    if (searchQuery) {
      return (
        tx.title.includes(searchQuery) ||
        tx.orderNumber.includes(searchQuery) ||
        tx.paymentMethod.includes(searchQuery)
      );
    }
    return true;
  });

  const pendingDutyCount = transactions.filter((t) => t.status === '결제대기').length;
  const pendingDutySum = transactions
    .filter((t) => t.status === '결제대기')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="md:ml-[260px] pt-[80px] p-6 md:p-8 min-h-screen bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto">
        {/* Top Title & Download Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">결제·납부내역</h2>
            <p className="text-xs text-gray-500 mt-0.5">관부가세 및 해외배송비 결제 내역을 확인하고 영수증을 관리하세요.</p>
          </div>
          <button
            onClick={() => showToast('전체 결제 내역 엑셀 파일이 다운로드되었습니다.')}
            className="bg-[#FFCD00] text-[#191919] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            전체 내역 다운로드
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Pending Duty Card */}
          <div className="bg-white rounded-2xl border border-[#E1E2E4] p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">warning</span>
                납부 대기중인 관세
              </span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingDutyCount}건
              </span>
            </div>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-gray-900">
                ₩{pendingDutySum.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => {
                const pendingTx = transactions.find((t) => t.status === '결제대기');
                if (pendingTx) {
                  onPayTransaction(pendingTx.id);
                } else {
                  showToast('납부 대기 중인 항목이 없습니다.');
                }
              }}
              className="w-full h-10 mt-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              납부하러 가기
            </button>
          </div>

          {/* Payment Method Stats */}
          <div className="bg-white rounded-2xl border border-[#E1E2E4] p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-2">
              <span className="material-symbols-outlined text-sm">pie_chart</span>
              주요 결제 수단
            </div>
            <div className="space-y-3 my-2">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFCD00]"></span>
                  카카오페이
                </span>
                <span className="font-bold text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#FFCD00] h-full w-[75%]"></div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  신용카드
                </span>
                <span className="font-bold text-gray-900">25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'ALL' ? 'bg-[#1E2A44] text-white shadow-sm' : 'bg-white border border-[#E1E2E4] text-gray-600 hover:bg-gray-50'
              }`}
            >
              전체 내역
            </button>
            <button
              onClick={() => setFilter('DUTY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'DUTY' ? 'bg-[#1E2A44] text-white shadow-sm' : 'bg-white border border-[#E1E2E4] text-gray-600 hover:bg-gray-50'
              }`}
            >
              관세
            </button>
            <button
              onClick={() => setFilter('SHIPPING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === 'SHIPPING' ? 'bg-[#1E2A44] text-white shadow-sm' : 'bg-white border border-[#E1E2E4] text-gray-600 hover:bg-gray-50'
              }`}
            >
              해외배송비
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="결제번호 또는 상품명 검색"
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-[#E1E2E4] text-xs focus:outline-none focus:ring-2 focus:ring-[#1E2A44]"
            />
          </div>
        </div>

        {/* Transactions Table / Cards */}
        <div className="space-y-3 mb-6">
          {filteredTxs.map((tx) => (
            <div
              key={tx.id}
              className={`bg-white rounded-2xl border p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                tx.status === '결제대기'
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : tx.status === '결제실패'
                  ? 'border-red-200'
                  : 'border-[#E1E2E4]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded mt-0.5 ${
                  tx.category === '관세' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {tx.category}
                </span>

                <div>
                  <h4 className="font-bold text-sm text-gray-900">{tx.title}</h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">{tx.orderNumber} • {tx.date}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                <div className="text-left md:text-right">
                  <p className="text-gray-500 text-[11px]">{tx.paymentMethod}</p>
                  <p className="font-extrabold text-base text-gray-900 mt-0.5">
                    ₩{tx.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {tx.status === '결제완료' && (
                    <>
                      <span className="bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        결제완료
                      </span>
                      <button
                        onClick={() => showToast(`'${tx.title}' 영수증이 발행되었습니다.`)}
                        className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                        title="영수증 출력"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </>
                  )}

                  {tx.status === '결제대기' && (
                    <>
                      <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-full text-[11px]">
                        결제대기
                      </span>
                      <button
                        onClick={() => onPayTransaction(tx.id)}
                        className="bg-[#1E2A44] text-white font-bold px-4 py-1.5 rounded-xl hover:bg-[#08152e] transition-colors"
                      >
                        납부하기
                      </button>
                    </>
                  )}

                  {tx.status === '결제실패' && (
                    <>
                      <span className="bg-red-50 text-red-600 font-bold px-2.5 py-1 rounded-full text-[11px]">
                        결제실패
                      </span>
                      <button
                        onClick={() => onPayTransaction(tx.id)}
                        className="bg-gray-100 text-gray-800 font-bold px-3 py-1.5 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        재시도
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 text-xs font-semibold text-gray-600">
          <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400">&lt;</button>
          <button className="w-8 h-8 rounded-lg bg-[#FFCD00] text-[#191919] font-bold">1</button>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-200">2</button>
          <button className="w-8 h-8 rounded-lg hover:bg-gray-200">3</button>
          <button className="p-1.5 rounded-lg hover:bg-gray-200">&gt;</button>
        </div>
      </div>
    </div>
  );
};
