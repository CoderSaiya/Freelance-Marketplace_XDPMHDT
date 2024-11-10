import { motion } from "framer-motion";

export const ImageSide: React.FC = () => {
  return (
    <div className="w-1/2 h-full p-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full h-full relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
        <img
          src="/img/login.png"
          alt="Decorative"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};
