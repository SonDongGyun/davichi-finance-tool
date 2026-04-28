import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Minus, ArrowUpRight, ArrowDownRight, Equal } from 'lucide-react';
import { formatMoney, formatMonthLabel } from '../utils/formatters';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{formatMoney(display)}{suffix}</span>;
}

export default function SummaryCards({ result }) {
  const { month1, month2, totalDiff, totalPctChange, newItems, removedItems, increasedItems, decreasedItems } = result;

  const cards = [
    {
      label: formatMonthLabel(month1.label),
      value: month1.total,
      sub: `${month1.count}건`,
      icon: <Equal style={{ width: '20px', height: '20px' }} />,
      gradient: 'linear-gradient(135deg, #64748b, #475569)',
    },
    {
      label: formatMonthLabel(month2.label),
      value: month2.total,
      sub: `${month2.count}건`,
      icon: <Equal style={{ width: '20px', height: '20px' }} />,
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    },
    {
      label: '총 증감액',
      value: totalDiff,
      sub: `${totalPctChange > 0 ? '+' : ''}${totalPctChange}%`,
      icon: totalDiff >= 0
        ? <TrendingUp style={{ width: '20px', height: '20px' }} />
        : <TrendingDown style={{ width: '20px', height: '20px' }} />,
      gradient: totalDiff >= 0
        ? 'linear-gradient(135deg, #ef4444, #f97316)'
        : 'linear-gradient(135deg, #10b981, #14b8a6)',
    },
  ];

  const changeCards = [
    { label: '신규 항목', count: newItems.length, icon: <Plus style={{ width: '16px', height: '16px' }} />, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
    { label: '제거 항목', count: removedItems.length, icon: <Minus style={{ width: '16px', height: '16px' }} />, color: '#fb923c', bg: 'rgba(249,115,22,0.1)' },
    { label: '증가 항목', count: increasedItems.length, icon: <ArrowUpRight style={{ width: '16px', height: '16px' }} />, color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
    { label: '감소 항목', count: decreasedItems.length, icon: <ArrowDownRight style={{ width: '16px', height: '16px' }} />, color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: '40px' }}
    >
      {/* Main summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass"
            style={{ borderRadius: '16px', padding: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>{card.label}</span>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: card.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>
              <AnimatedNumber
                value={Math.abs(card.value)}
                prefix={card.value < 0 ? '-' : ''}
                suffix="원"
              />
            </div>
            <div style={{
              fontSize: '14px', marginTop: '6px',
              color: card.label === '총 증감액'
                ? totalDiff >= 0 ? '#f87171' : '#34d399'
                : '#94a3b8',
              fontWeight: 500,
            }}>
              {card.sub}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Change type cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {changeCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="glass-light"
            style={{ borderRadius: '14px', padding: '24px 16px', textAlign: 'center' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '20px',
              background: card.bg, color: card.color,
              fontSize: '12px', fontWeight: 600, marginBottom: '12px',
            }}>
              {card.icon}
              {card.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>{card.count}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
