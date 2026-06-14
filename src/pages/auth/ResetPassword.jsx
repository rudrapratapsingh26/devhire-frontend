import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/auth/Input";
import Button from "../../components/auth/Button";
import { useAuth } from "../../context/AuthContext";

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
};

const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["bg-red-500", "bg-red-500", "bg-orange-500", "bg-violet-500", "bg-emerald-500"];
const labelColors = ["text-red-400", "text-red-400", "text-orange-400", "text-violet-400", "text-emerald-400"];

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Reset link is invalid or has expired");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <KeyRound size={22} />
        </div>
        <h1 className="text-2xl font-bold text-white">Reset your password</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Choose a strong new password for your account
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Input
            label="New Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < strength ? strengthColors[strength] : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${labelColors[strength]}`}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />

        <Button type="submit" loading={loading}>
          Reset Password
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

export default ResetPassword;
