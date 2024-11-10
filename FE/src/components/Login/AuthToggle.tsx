import { motion } from "framer-motion";

interface AuthToggleProps {
    isLogin: boolean;
    onToggle: () => void;
  }
  
  export const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-white/80"
      >
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={onToggle}
          className="text-white font-semibold hover:text-white/80 transition-colors"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </motion.p>
    );
  };