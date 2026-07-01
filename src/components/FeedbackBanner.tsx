import { motion } from 'framer-motion';
import { fadeInUp, useAppMotion } from '../lib/motion';

interface FeedbackBannerProps {
  tone: 'success' | 'error' | 'info';
  message: string;
  title?: string;
}

const toneStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-emerald-500/5',
  error: 'bg-red-50/80 border-red-200 text-red-900 shadow-red-500/5',
  info: 'bg-blue-50/80 border-blue-200 text-blue-900 shadow-blue-500/5'
};

const toneIcon: Record<FeedbackBannerProps['tone'], string> = {
  success: '✓',
  error: '!',
  info: 'ℹ︎'
};

const iconStyles: Record<FeedbackBannerProps['tone'], string> = {
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700'
};

export function FeedbackBanner({ tone, message, title }: FeedbackBannerProps) {
  const { shouldReduce, transition } = useAppMotion();

  return (
    <motion.div
      role="alert"
      className={`rounded-2xl border px-5 py-4 shadow-soft ${shouldReduce ? '' : 'backdrop-blur-sm'} ${toneStyles[tone]}`}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transition}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${iconStyles[tone]}`}>
          {toneIcon[tone]}
        </div>
        <div className="flex-1">
          {title && <p className="font-bold text-sm uppercase tracking-wide opacity-80 mb-1">{title}</p>}
          <p className="text-base font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
