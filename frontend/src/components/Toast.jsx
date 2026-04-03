import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../hooks/useToast';

const TONE_STYLES = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
  error: 'border-rose-500/40 bg-rose-500/10 text-rose-100',
  info: 'border-sky-500/40 bg-sky-500/10 text-sky-100',
};

const TONE_LABELS = {
  success: 'Saved',
  warning: 'Notice',
  error: 'Error',
  info: 'Info',
};

export default function ToastViewport() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${TONE_STYLES[toast.tone] ?? TONE_STYLES.info}`}
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">
                  {TONE_LABELS[toast.tone] ?? TONE_LABELS.info}
                </div>
                <div className="text-sm font-semibold text-white">{toast.title}</div>
                {toast.description && (
                  <div className="text-xs leading-relaxed text-white/75">
                    {toast.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-md px-2 py-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}