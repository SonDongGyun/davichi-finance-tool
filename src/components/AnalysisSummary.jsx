import { motion } from 'framer-motion';
import { MessageSquareText, TrendingUp, TrendingDown, PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { formatMoney, formatMonthLabel } from '../utils/excelParser';

function formatManWon(amount) {
  const abs = Math.abs(amount);
  if (abs >= 100000000) return `${(abs / 100000000).toFixed(1)}억`;
  if (abs >= 10000) return `${Math.round(abs / 10000)}만`;
  return formatMoney(abs);
}

function generateSummaryLines(result) {
  const lines = [];
  const m1Label = formatMonthLabel(result.month1.label);
  const m2Label = formatMonthLabel(result.month2.label);

  const totalDiff = result.totalDiff;
  if (totalDiff > 0) {
    lines.push({ type: 'increase', text: `${m1Label} 대비 ${m2Label} 총 비용이 ${formatManWon(totalDiff)}원 증가했습니다 (${result.totalPctChange > 0 ? '+' : ''}${result.totalPctChange}%).` });
  } else if (totalDiff < 0) {
    lines.push({ type: 'decrease', text: `${m1Label} 대비 ${m2Label} 총 비용이 ${formatManWon(totalDiff)}원 감소했습니다 (${result.totalPctChange}%).` });
  } else {
    lines.push({ type: 'neutral', text: `${m1Label}과 ${m2Label}의 총 비용이 동일합니다.` });
  }

  result.removedItems.forEach(item => {
    lines.push({ type: 'removed', text: `당월 ${item.category} 비용 ${formatManWon(item.prevAmount)}원 감소 (${m1Label}에는 있었으나 ${m2Label}에는 발생하지 않음).` });
  });

  result.newItems.forEach(item => {
    lines.push({ type: 'new', text: `${item.category} 항목이 ${m2Label}에 신규 발생하여 ${formatManWon(item.currAmount)}원 지출.` });
  });

  result.increasedItems.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 5).forEach(item => {
    lines.push({ type: 'increase', text: `${item.category} 비용이 ${formatManWon(item.prevAmount)}원에서 ${formatManWon(item.currAmount)}원으로 ${formatManWon(item.diff)}원 증가 (+${item.pctChange}%).` });
  });

  result.decreasedItems.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)).slice(0, 5).forEach(item => {
    lines.push({ type: 'decrease', text: `${item.category} 비용이 ${formatManWon(item.prevAmount)}원에서 ${formatManWon(item.currAmount)}원으로 ${formatManWon(Math.abs(item.diff))}원 감소 (${item.pctChange}%).` });
  });

  result.vendorComparison.slice(0, 3).forEach(v => {
    if (v.status === 'new') {
      lines.push({ type: 'new', text: `거래처 "${v.vendor}" 신규 거래 발생, ${formatManWon(v.currAmount)}원 지출.` });
    } else if (v.status === 'removed') {
      lines.push({ type: 'removed', text: `거래처 "${v.vendor}" 당월 거래 없음 (전월 ${formatManWon(v.prevAmount)}원).` });
    } else if (v.diff > 0) {
      lines.push({ type: 'increase', text: `거래처 "${v.vendor}" 비용 ${formatManWon(v.diff)}원 증가.` });
    } else if (v.diff < 0) {
      lines.push({ type: 'decrease', text: `거래처 "${v.vendor}" 비용 ${formatManWon(Math.abs(v.diff))}원 감소.` });
    }
  });

  return lines;
}

const dotColors = {
  increase: '#f87171',
  decrease: '#34d399',
  new: '#60a5fa',
  removed: '#fb923c',
  neutral: '#94a3b8',
};

export default function AnalysisSummary({ result }) {
  const lines = generateSummaryLines(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      style={{ marginTop: '32px' }}
    >
      <div className="glass" style={{ borderRadius: '16px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <MessageSquareText style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>분석 요약</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '10px 14px', borderRadius: '8px',
              }}
            >
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                marginTop: '7px', flexShrink: 0,
                background: dotColors[line.type],
              }} />
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{line.text}</p>
            </motion.div>
          ))}
        </div>

        {lines.length === 0 && (
          <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px 0' }}>변동 사항이 없습니다.</p>
        )}
      </div>
    </motion.div>
  );
}
