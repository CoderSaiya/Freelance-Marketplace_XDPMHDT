import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyCodeMutation,
} from "@/apis/graphqlApi";
import { notification } from "antd";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface Props {
  onForgot: (status: boolean) => void;
}

interface VerificationStatus {
  isVerifying: boolean;
  isVerified: boolean;
  error: boolean;
}

interface PasswordErrors {
  length: boolean;
  match: boolean;
}

const passwordCriteria = {
  minLength: {
    check: (pwd: string) => pwd.length >= 8,
    label: "At least 8 characters",
  },
  hasUppercase: {
    check: (pwd: string) => /[A-Z]/.test(pwd),
    label: "Uppercase",
  },
  hasLowercase: {
    check: (pwd: string) => /[a-z]/.test(pwd),
    label: "Lowercase",
  },
  hasNumber: {
    check: (pwd: string) => /[0-9]/.test(pwd),
    label: "Number",
  },
  hasSpecial: {
    check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    label: "Special characters",
  },
};

const ForgotPassword: React.FC<Props> = ({ onForgot }) => {
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [status, setStatus] = useState<VerificationStatus>({
    isVerifying: false,
    isVerified: false,
    error: false,
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    length: false,
    match: false,
  });
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [forgotPassword, { isLoading: generateCodeLoading }] =
    useForgotPasswordMutation();
  const [verifyCodeMutation] =
    useVerifyCodeMutation();
  const [changePassword] = useChangePasswordMutation();

  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const passwordStrength = React.useMemo(() => {
    const checks = Object.values(passwordCriteria).map((criterion) =>
      criterion.check(newPassword)
    );
    const passedChecks = checks.filter(Boolean).length;

    if (passedChecks <= 1)
      return {
        level: "weak",
        color: "bg-red-500",
        width: "w-1/4",
        text: "Weak",
      };
    if (passedChecks <= 3)
      return {
        level: "medium",
        color: "bg-yellow-500",
        width: "w-1/2",
        text: "Medium",
      };
    if (passedChecks <= 4)
      return {
        level: "strong",
        color: "bg-green-500",
        width: "w-3/4",
        text: "Strong",
      };
    return {
      level: "very-strong",
      color: "bg-green-600",
      width: "w-full",
      text: "Very Strong",
    };
  }, [newPassword]);

  useEffect(() => {
    if (inputRefs.current.length !== 4) {
      inputRefs.current = Array(4)
        .fill(null)
        .map(() => document.createElement("input"));
    }
  }, []);

  const validatePassword = () => {
    const isStrongEnough = passwordStrength.level !== "weak";
    const doPasswordsMatch = newPassword === confirmPassword;

    setPasswordErrors({
      length: !isStrongEnough,
      match: !doPasswordsMatch,
    });

    return isStrongEnough && doPasswordsMatch;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await forgotPassword(email).unwrap();
    if (!response.data.forgotPassword) {
      notification.error({
        message: "Email not found",
      });
      return;
    }
    setShowVerification(true);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 300);
  };

  const handleChange = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    try {
      const response = await verifyCodeMutation({ email, code }).unwrap();

      if (response.data.verifyCode) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      return false;
    }
  };

  const handleVerification = async (): Promise<void> => {
    const code = digits.join("");
    if (code.length === 4) {
      setStatus({ ...status, isVerifying: true, error: false });

      try {
        const isValid = await verifyCode(code);
        setStatus({
          isVerifying: false,
          isVerified: isValid,
          error: !isValid,
        });

        if (isValid) {
          setTimeout(() => {
            setShowNewPassword(true);
          }, 1000);
        }
      } catch (error) {
        setStatus({
          isVerifying: false,
          isVerified: false,
          error: true,
        });
        console.error("Verification error:", error);
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      const response = await changePassword({
        email: email,
        newPass: newPassword,
      }).unwrap();

      if (!response.data.changePassword) {
        notification.error({
          message: "Failed",
        });
        setIsResetting(false);
        return;
      }
    } catch {
      notification.error({
        message: "Failed",
      });
    }

    setIsResetting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setResetSuccess(true);
      setTimeout(() => {
        onForgot(false);
      }, 2000);
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const resetForm = (): void => {
    setDigits(["", "", "", ""]);
    setStatus({
      isVerifying: false,
      isVerified: false,
      error: false,
    });
    inputRefs.current[0]?.focus();
  };

  const goBack = () => {
    if (showNewPassword) {
      setShowNewPassword(false);
      setStatus({ isVerifying: false, isVerified: false, error: false });
    } else if (showVerification) {
      setShowVerification(false);
      resetForm();
    } else {
      onForgot(false);
    }
  };

  const renderStatusMessage = (): JSX.Element | null => {
    const { isVerifying, isVerified, error } = status;

    if (isVerifying) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <p className="text-white/80">Verifying code...</p>
        </div>
      );
    }

    if (isVerified && !showNewPassword) {
      return (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <p className="text-xl font-semibold text-white">
            Verification Successful!
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-2">
          <XCircle className="h-12 w-12 text-red-500" />
          <p className="text-xl font-semibold text-white">Invalid Code</p>
        </div>
      );
    }

    return null;
  };

  const renderPasswordForm = () => (
    <motion.form
      onSubmit={handlePasswordReset}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-white/90 mb-2 font-medium">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setShowPasswordStrength(true)}
              onBlur={() => setShowPasswordStrength(false)}
              className="w-full pr-10 bg-white/10 border border-white/20 text-white"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && showPasswordStrength && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-500 ${passwordStrength.width}`}
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span
                  className={`text-sm ${passwordStrength.color.replace(
                    "bg-",
                    "text-"
                  )}`}
                >
                  Strength: {passwordStrength.text}
                </span>
              </div>

              {/* Password Requirements */}
              <div className="mt-4 space-y-2">
                {Object.entries(passwordCriteria).map(
                  ([key, { check, label }]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          check(newPassword) ? "bg-green-500" : "bg-white/20"
                        }`}
                      >
                        {check(newPassword) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          check(newPassword) ? "text-white" : "text-white/60"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Warning for weak password */}
              {passwordStrength.level === "weak" && (
                <Alert className="mt-4 bg-red-500/20 border-red-500 text-white">
                  <AlertTitle>Password is too weak</AlertTitle>
                  <AlertDescription>
                    Please create a stronger password to protect your account.
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}
        </div>

        <div className="relative">
          <label className="block text-white/90 mb-2 font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pr-10 bg-white/10 border border-white/20 text-white"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
          </div>
          {passwordErrors.match && (
            <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-white hover:bg-white/90 text-purple-600 rounded-lg font-medium transition-colors"
        disabled={isResetting || passwordStrength.level === "weak"}
      >
        {isResetting ? (
          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
        ) : resetSuccess ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Password Reset Successfully
          </div>
        ) : (
          "Reset Password"
        )}
      </Button>
    </motion.form>
  );

  return (
    <div className="w-full h-full flex">
      <div className="w-1/2 h-full p-12 flex flex-col justify-center">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={goBack}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            {showNewPassword
              ? "Back to Verification"
              : showVerification
              ? "Back to Reset Password"
              : "Back to Login"}
          </button>

          <div className="mb-8">
            <div
              className="flex items-center mb-8 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src="/img/logo.png" alt="Logo" className="w-12 h-12" />
              <h1 className="ml-4 text-2xl font-bold text-white">
                Freelance Marketplace
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {showNewPassword
                ? "Set New Password"
                : showVerification
                ? "Verify Email"
                : "Reset Password"}
            </h2>
            <p className="text-white/80">
              {showNewPassword
                ? "Create a strong password for your account"
                : showVerification
                ? "Enter the verification code we sent to your email"
                : "Don't worry! Enter your email and we'll send you reset instructions."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showVerification && !showNewPassword ? (
              <motion.form
                key="email-form"
                onSubmit={handleEmailSubmit}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label className="block text-white/90 mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transform hover:scale-[1.02] transition-all duration-200 ${
                    generateCodeLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={generateCodeLoading}
                >
                  Send Reset Password
                </button>
              </motion.form>
            ) : showVerification && !showNewPassword ? (
              <motion.div
                key="verification-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-center gap-4">
                  {digits.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold bg-white/10 border border-white/20 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 rounded-lg"
                      disabled={status.isVerifying || status.isVerified}
                      aria-label={`Digit ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="text-center space-y-4">
                  {renderStatusMessage()}

                  {!status.isVerifying && !status.isVerified && (
                    <Button
                      onClick={handleVerification}
                      className="w-full h-12 bg-white hover:bg-white/90 text-purple-600 rounded-lg font-medium transition-colors"
                      disabled={digits.some((d) => !d)}
                    >
                      Verify Code
                    </Button>
                  )}

                  {status.error && (
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="w-full h-12 border-2 border-white/20 text-white hover:bg-white/10 rounded-lg font-medium transition-colors"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="new-password-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {renderPasswordForm()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Password Form */}
      <div
        className="w-1/2 h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/img/auth-bg.jpg')" }}
      >
        <div className="w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white max-w-md p-8">
            <h2 className="text-3xl font-bold mb-4">
              {showNewPassword
                ? "Create New Password"
                : showVerification
                ? "Verify Your Identity"
                : "Secure Account Recovery"}
            </h2>
            <p className="text-lg text-white/80">
              {showNewPassword
                ? "Choose a strong password to protect your account. Make sure it's at least 8 characters long."
                : showVerification
                ? "For your security, please enter the verification code we sent to your email."
                : "We prioritize your account security. Follow the instructions sent to your email to safely reset your password."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
