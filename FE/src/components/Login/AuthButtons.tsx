import { motion } from "framer-motion";

interface AuthButtonsProps {
  isLogin: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({
  isLogin,
  onSubmit,
  onGoogleLogin,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-4 pt-2"
    >
      <button
        type="button"
        onClick={onSubmit}
        className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transform hover:scale-[1.02] transition-all duration-200"
      >
        {isLogin ? "Sign in" : "Sign up"}
      </button>

      <button
        type="button"
        onClick={onGoogleLogin}
        className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all duration-200"
      >
        <img src="/img/google.png" alt="Google" className="w-5 h-5" />
        <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
      </button>
    </motion.div>
  );
};
