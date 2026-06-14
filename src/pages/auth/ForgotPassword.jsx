import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/auth/Input";
import Button from "../../components/auth/Button";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      navigate("/check-email", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Lock size={22} />
        </div>
        <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" loading={loading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
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

export default ForgotPassword;
