import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MailCheck, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { useAuth } from "../../context/AuthContext";

const CheckEmail = () => {
  const { forgotPassword } = useAuth();
  const location = useLocation();
  const email = location.state?.email || "your email";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!location.state?.email) return;
    setResending(true);
    try {
      await forgotPassword(location.state.email);
      setResent(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <MailCheck size={22} />
        </div>
        <h1 className="text-2xl font-bold text-white">Check your email</h1>
        <p className="mt-3 text-sm text-zinc-400">
          We sent a password reset link to{" "}
          <span className="font-medium text-zinc-200">{email}</span>
        </p>

        <p className="mt-4 text-sm text-zinc-400">
          Didn't receive the email? Check your spam folder or{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-accent hover:text-violet-400 disabled:opacity-60"
          >
            {resending ? "Sending..." : resent ? "Sent!" : "Resend reset link"}
          </button>
        </p>

        <div className="my-6 h-px w-full bg-border" />

        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-violet-400"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default CheckEmail;
