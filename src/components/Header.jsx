import { motion } from 'framer-motion';
import { BarChart3, Sparkles, TrendingUp, FileSpreadsheet, Zap } from 'lucide-react';

export default function Header({ isCompact }) {
  if (isCompact) {
    return (
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 py-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25"
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">다비치 재무팀 분석 툴</span>
              </h1>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-sm text-slate-400"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">월별 비용 증감 분석</span>
          </motion.div>
        </div>
      </motion.header>
    );
  }

  const features = [
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: '엑셀 업로드',
      desc: '재무 데이터 엑셀 파일을 드래그 앤 드롭으로 간편하게 업로드',
      color: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: '월별 비교 분석',
      desc: '두 달의 비용을 비교하여 신규/소멸/증감 항목을 자동 감지',
      color: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/20',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '인사이트 도출',
      desc: '카테고리별, 거래처별 변동을 차트와 문장으로 한눈에 파악',
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-10 pt-16 pb-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 mx-auto mb-8"
        >
          <BarChart3 className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4"
        >
          <span className="gradient-text">다비치 재무팀</span>
          <br />
          <span className="text-white">분석 툴</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          월별 재무 데이터를 업로드하면 비용 증감을 자동으로 분석하고,
          <br className="hidden sm:block" />
          신규/소멸 항목과 주요 변동 사항을 한눈에 보여드립니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 mt-6"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-slate-500">Financial Analysis System</span>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={`glass rounded-2xl p-6 text-center shadow-lg ${f.glow}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg ${f.glow}`}>
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.header>
  );
}
