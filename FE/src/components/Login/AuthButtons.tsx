import { BallTriangle } from "@agney/react-loading";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";

interface AuthButtonsProps {
  isLogin: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  isSuccess: boolean;
  isDisabled?: boolean;
  isSignupLoad: boolean;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({
  isLogin,
  onSubmit,
  onGoogleLogin,
  isSuccess,
  isDisabled = false,
  isSignupLoad,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="space-y-4 pt-2"
    >
      {isSuccess ? (
        <div className="flex justify-center items-center py-3">
          <BallTriangle width="50" />
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSignupLoad}
            className={`w-full py-3 rounded-xl font-semibold transform transition-all duration-200
              ${
                isDisabled
                  ? "bg-gray-400 text-white/80 cursor-not-allowed"
                  : "bg-white text-purple-600 hover:bg-white/90 hover:scale-[1.02]"
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              {isSignupLoad ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isDisabled && !isLogin && (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {isLogin ? "Sign in" : "Sign up"}
                </>
              )}
            </span>
          </button>

          {isDisabled && !isLogin && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-red-400 text-sm text-center drop-shadow-[0_0_2px_black] font-bold"
            >
              Please create a stronger password to continue
            </motion.p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isSuccess}
        className={`w-full py-3 rounded-xl border font-semibold flex items-center justify-center gap-2 transform transition-all duration-200
          ${
            isSuccess
              ? "bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-[1.02]"
          }
        `}
      >
        <img
          src="/img/google.png"
          alt="Google"
          className={`w-5 h-5 ${isSuccess ? "opacity-50" : ""}`}
        />
        <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
      </button>
    </motion.div>
  );
};
