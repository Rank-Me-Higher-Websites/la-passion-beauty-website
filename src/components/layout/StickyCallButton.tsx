import { Phone } from "lucide-react";
import { motion } from "framer-motion";

const StickyCallButton = () => {
  return (
    <motion.a
      href="tel:+13313188113"
      className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow-intense animate-pulse-glow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Call La Passion Beauty Salon"
    >
      <Phone className="h-6 w-6" />
    </motion.a>
  );
};

export default StickyCallButton;
