import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { formatMoney } from '../utils/excelParser';

export default function VendorTable({ result }) {
  const [showAll, setShowAll] = useState(false);

  const data = showAll ? result.vendorComparison : result.vendorComparison.slice(0, 15);

  if (result.vendorComparison.length === 0) return null;

  const maxDiff = result.vendorComparison[0]?.diff ? Math.abs(result.vendorComparison[0].diff) : 1;

  const thStyle = {
    padding: '14px 16px',
    fontSize: '12px', fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '14px 16px', fontSize: '14px',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{ marginTop: '32px' }}
    >
      <div className="glass" style={{ borderRadius: '16px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Building2 style={{ width: '20px', height: '20px', color: '#22d3ee' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0' }}>거래처별 변동 내역</h3>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(51,65,85,0.5)' }}>
                <th style={{ ...thStyle, textAlign: 'left' }}>거래처</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>이전</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>현재</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>증감</th>
                <th style={{ ...thStyle, textAlign: 'center', width: '120px' }}>변동</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <motion.tr
                  key={item.vendor}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  style={{
                    borderBottom: '1px solid rgba(30,41,59,0.5)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...tdStyle, color: '#e2e8f0', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.vendor}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {item.prevAmount > 0 ? `${formatMoney(item.prevAmount)}원` : '-'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {item.currAmount > 0 ? `${formatMoney(item.currAmount)}원` : '-'}
                  </td>
                  <td style={{
                    ...tdStyle, textAlign: 'right', fontFamily: 'monospace', fontWeight: 600,
                    color: item.diff > 0 ? '#f87171' : '#34d399',
                  }}>
                    {item.diff > 0 ? '+' : ''}{formatMoney(item.diff)}원
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{
                      width: '100%', maxWidth: '100px', height: '8px',
                      background: 'rgba(15,23,42,0.6)', borderRadius: '4px',
                      overflow: 'hidden', margin: '0 auto',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (Math.abs(item.diff) / maxDiff) * 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.03 }}
                        style={{
                          height: '100%', borderRadius: '4px',
                          background: item.diff > 0 ? '#ef4444' : '#10b981',
                        }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {result.vendorComparison.length > 15 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                background: 'rgba(51,65,85,0.5)',
                color: '#cbd5e1',
                border: '1px solid rgba(100,116,139,0.3)',
                cursor: 'pointer',
              }}
            >
              {showAll ? '접기' : `전체 보기 (${result.vendorComparison.length}건)`}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
