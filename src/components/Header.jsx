import { motion } from 'framer-motion';
import { BarChart3, Sparkles, TrendingUp, FileSpreadsheet, Zap } from 'lucide-react';

export default function Header({ isCompact }) {
  if (isCompact) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, paddingTop: '24px', paddingBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
              }}
            >
              <BarChart3 style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700 }}>
              <span className="gradient-text">다비치 재무팀 분석 툴</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#94a3b8' }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#a78bfa' }} />
            <span>월별 비용 증감 분석</span>
          </div>
        </div>
      </motion.header>
    );
  }

  const features = [
    {
      icon: <FileSpreadsheet style={{ width: '28px', height: '28px' }} />,
      title: '엑셀 업로드',
      desc: '재무 데이터 엑셀 파일을 드래그 앤 드롭으로 간편하게 업로드하세요.',
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      shadow: '0 8px 24px rgba(59,130,246,0.2)',
    },
    {
      icon: <TrendingUp style={{ width: '28px', height: '28px' }} />,
      title: '월별 비교 분석',
      desc: '두 달의 비용을 비교하여 신규, 소멸, 증감 항목을 자동으로 감지합니다.',
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      shadow: '0 8px 24px rgba(139,92,246,0.2)',
    },
    {
      icon: <Zap style={{ width: '28px', height: '28px' }} />,
      title: '인사이트 도출',
      desc: '카테고리별, 거래처별 변동을 차트와 문장으로 한눈에 파악할 수 있습니다.',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      shadow: '0 8px 24px rgba(245,158,11,0.2)',
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '20px' }}
    >
      {/* Hero Title */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}
        >
          <div
            style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
            }}
          >
            <BarChart3 style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.1 }}>
            <span className="gradient-text">다비치 재무팀 분석 툴</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: '18px', color: '#94a3b8', lineHeight: 1.8,
            maxWidth: '600px', margin: '0 auto',
          }}
        >
          월별 재무 데이터를 업로드하면 비용 증감을 자동으로 분석하고,
          신규/소멸 항목과 주요 변동 사항을 한눈에 보여드립니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px' }}
        >
          <Sparkles style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
          <span style={{ fontSize: '13px', color: '#64748b' }}>Financial Analysis System</span>
          <Sparkles style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        marginBottom: '64px',
      }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="glass"
            style={{
              borderRadius: '20px', padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: f.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', margin: '0 auto 20px auto',
                boxShadow: f.shadow,
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#e2e8f0', marginBottom: '10px' }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.header>
  );
}
