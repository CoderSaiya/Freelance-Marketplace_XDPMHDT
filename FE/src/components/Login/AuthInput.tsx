import { motion } from "framer-motion";

interface AuthInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  delay: number;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  onChange,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <label className="block text-white/90 mb-2 font-medium">{label}</label>
      <input
        type="text"
        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200"
        placeholder={`Enter your ${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </motion.div>
  );
};