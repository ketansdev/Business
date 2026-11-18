import { AnimatePresence, motion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';
import useInView from '../../hooks/useInView';
import { whatsappLink } from '../../config/site';
import { ease } from '../ui/Reveal';

/** WhatsApp shortcut that appears once the hero has left the viewport (IntersectionObserver, no scroll handler). */
export default function FloatingWhatsApp() {
  const heroVisible = useInView('home');

  return (
    <AnimatePresence>
      {!heroVisible && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with KV DEV STUDIO on WhatsApp"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.5, ease }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1FAF54] text-white shadow-lift transition-colors duration-300 hover:bg-[#178F44] active:scale-[0.98]"
        >
          <WhatsappLogo size={28} weight="fill" aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
