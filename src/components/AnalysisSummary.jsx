import { motion } from 'framer-motion';
import { MessageSquareText, TrendingUp, TrendingDown, AlertCircle, PlusCircle, MinusCircle } from 'lucide-react';
import { formatMoney, formatMonthLabel } from '../utils/excelParser';

function formatManWon(amount) {
  const abs = Math.abs(amount);
  if (abs >= 100000000) {
    return `${(abs / 100000000).toFixed(1)}억`;
  }
  if (abs >= 10000) {
    return `${Math.round(abs / 10000)}만`;
  }
  return formatMoney(abs);
}

function generateSummaryLines(result) {
  const lines = [];
  const m1Label = formatMonthLabel(result.month1.label);
  const m2Label = formatMonthLabel(result.month2.label);

  // 1. 전체 요약
  const totalDiff = result.totalDiff;
  if (totalDiff > 0) {
    lines.push({
      type: 'increase',
      text: `${m1Label} 대비 ${m2Label} 총 비용이 ${formatManWon(totalDiff)}원 증가했습니다 (${result.totalPctChange > 0 ? '+' : ''}${result.totalPctChange}%).`,
    });
  } else if (totalDiff < 0) {
    lines.push({
      type: 'decrease',
      text: `${m1Label} 대비 ${m2Label} 총 비용이 ${formatManWon(totalDiff)}원 감소했습니다 (${result.totalPctChange}%).`,
    });
  } else {
    lines.push({
      type: 'neutral',
      text: `${m1Label}과 ${m2Label}의 총 비용이 동일합니다.`,
    });
  }

  // 2. 제거된 항목 (이전 월에는 있고 당월에는 없는 것)
  result.removedItems.forEach(item => {
    lines.push({
      type: 'removed',
      text: `당월 ${item.category} 비용 ${formatManWon(item.prevAmount)}원 감소 (${m1Label}에는 있었으나 ${m2Label}에는 발생하지 않음).`,
    });
  });

  // 3. 신규 항목 (이전 월에는 없고 당월에 새로 생긴 것)
  result.newItems.forEach(item => {
    lines.push({
      type: 'new',
      text: `${item.category} 항목이 ${m2Label}에 신규 발생하여 ${formatManWon(item.currAmount)}원 지출.`,
    });
  });

  // 4. 증가 항목 (금액 큰 순서로 상위 5개)
  const topIncreased = result.increasedItems
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .slice(0, 5);
  topIncreased.forEach(item => {
    lines.push({
      type: 'increase',
      text: `${item.category} 비용이 ${formatManWon(item.prevAmount)}원에서 ${formatManWon(item.currAmount)}원으로 ${formatManWon(item.diff)}원 증가 (+${item.pctChange}%).`,
    });
  });

  // 5. 감소 항목 (금액 큰 순서로 상위 5개)
  const topDecreased = result.decreasedItems
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .slice(0, 5);
  topDecreased.forEach(item => {
    lines.push({
      type: 'decrease',
      text: `${item.category} 비용이 ${formatManWon(item.prevAmount)}원에서 ${formatManWon(item.currAmount)}원으로 ${formatManWon(Math.abs(item.diff))}원 감소 (${item.pctChange}%).`,
    });
  });

  // 6. 거래처 변동 주요 사항 (상위 3개)
  const topVendorChanges = result.vendorComparison.slice(0, 3);
  topVendorChanges.forEach(v => {
    if (v.status === 'new') {
      lines.push({
        type: 'new',
        text: `거래처 "${v.vendor}" 신규 거래 발생, ${formatManWon(v.currAmount)}원 지출.`,
      });
    } else if (v.status === 'removed') {
      lines.push({
        type: 'removed',
        text: `거래처 "${v.vendor}" 당월 거래 없음 (전월 ${formatManWon(v.prevAmount)}원).`,
      });
    } else if (v.diff > 0) {
      lines.push({
        type: 'increase',
        text: `거래처 "${v.vendor}" 비용 ${formatManWon(v.diff)}원 증가.`,
      });
    } else if (v.diff < 0) {
      lines.push({
        type: 'decrease',
        text: `거래처 "${v.vendor}" 비용 ${formatManWon(Math.abs(v.diff))}원 감소.`,
      });
    }
  });

  return lines;
}

const typeConfig = {
  increase: { icon: TrendingUp, color: 'text-red-400', dot: 'bg-red-400' },
  decrease: { icon: TrendingDown, color: 'text-emerald-400', dot: 'bg-emerald-400' },
  new: { icon: PlusCircle, color: 'text-blue-400', dot: 'bg-blue-400' },
  removed: { icon: MinusCircle, color: 'text-orange-400', dot: 'bg-orange-400' },
  neutral: { icon: AlertCircle, color: 'text-slate-400', dot: 'bg-slate-400' },
};

export default function AnalysisSummary({ result }) {
  const lines = generateSummaryLines(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative z-10 mt-8"
    >
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2 mb-5">
          <MessageSquareText className="w-5 h-5 text-amber-400" />
          분석 요약
        </h3>

        <div className="space-y-3">
          {lines.map((line, i) => {
            const cfg = typeConfig[line.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-slate-800/30 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${cfg.dot}`} />
                <p className="text-sm text-slate-300 leading-relaxed">{line.text}</p>
              </motion.div>
            );
          })}
        </div>

        {lines.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">변동 사항이 없습니다.</p>
        )}
      </div>
    </motion.div>
  );
}
