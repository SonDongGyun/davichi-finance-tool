import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatMonthLabel } from '../utils/excelParser';

export default function MonthSelector({ months, month1, month2, onMonth1Change, onMonth2Change, onAnalyze }) {
  const canAnalyze = month1 && month2 && month1 !== month2;

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(30,41,59,0.8)',
    border: '1px solid rgba(100,116,139,0.3)',
    color: '#e2e8f0',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto', marginTop: '32px' }}
    >
      <div className="glass" style={{ borderRadius: '16px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Calendar style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>비교할 월 선택</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
              기준월 (이전)
            </label>
            <select value={month1} onChange={(e) => onMonth1Change(e.target.value)} style={selectStyle}>
              <option value="">월 선택</option>
              {months.map(m => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
            </select>
          </div>

          <div style={{ paddingBottom: '8px' }}>
            <ArrowRight style={{ width: '24px', height: '24px', color: '#a78bfa' }} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
              비교월 (이후)
            </label>
            <select value={month2} onChange={(e) => onMonth2Change(e.target.value)} style={selectStyle}>
              <option value="">월 선택</option>
              {months.map(m => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={!canAnalyze}
          style={{
            marginTop: '28px',
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 600,
            border: 'none',
            cursor: canAnalyze ? 'pointer' : 'not-allowed',
            background: canAnalyze
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              : 'rgba(51,65,85,0.4)',
            color: canAnalyze ? 'white' : '#64748b',
          }}
        >
          {canAnalyze ? '분석 시작' : '두 달을 모두 선택해주세요'}
        </button>
      </div>
    </motion.div>
  );
}
