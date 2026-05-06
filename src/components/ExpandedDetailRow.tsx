import type { AnalysisEntry } from '../types';
import { formatMoney } from '../utils/formatters';

// Shared expanded-row body used by DetailTable (per-category drill-down) and
// VendorTable (per-vendor drill-down). Both surfaces show the same two-side
// breakdown of analysis entries with description + amount, so this component
// is the single source of truth for that layout.

interface DetailColumnProps {
  label: string;
  items: AnalysisEntry[];
}

function DetailColumn({ label, items }: DetailColumnProps) {
  return (
    <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '12px', padding: '16px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '12px' }}>
        {label} 상세 ({items.length}건)
      </p>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {items.map((entry, i) => (
          <div key={`${i}-${entry._amount}`} style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '12px', color: '#94a3b8', padding: '6px 0',
            borderBottom: '1px solid rgba(51,65,85,0.3)',
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {entry._description || entry._vendor || '-'}
            </span>
            <span style={{ marginLeft: '16px', fontFamily: 'monospace', color: '#cbd5e1' }}>
              {formatMoney(entry._amount)}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ExpandedDetailRowProps {
  prevItems: AnalysisEntry[];
  currItems: AnalysisEntry[];
  prevLabel: string;
  currLabel: string;
  colSpan: number;
}

export default function ExpandedDetailRow({
  prevItems, currItems, prevLabel, currLabel, colSpan,
}: ExpandedDetailRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: '16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {prevItems.length > 0 && <DetailColumn label={prevLabel} items={prevItems} />}
          {currItems.length > 0 && <DetailColumn label={currLabel} items={currItems} />}
        </div>
      </td>
    </tr>
  );
}
