import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/auth/Input";
import Button from "../../components/auth/Button";
import GoogleButton from "../../components/auth/GoogleButton";
import Divider from "../../components/auth/Divider";
import { useAuth } from "../../context/AuthContext";

const roleRedirects = {
  CANDIDATE: "/candidate/dashboard",
  COMPANY: "/company/dashboard",
  ADMIN: "/admin/dashboard",
};

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      const role = res?.data?.user?.role;
      navigate(roleRedirects[role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Sign in to your DevHire account
        </p>
      </div>

      {/* Google button OUTSIDE the form */}
      <GoogleButton onClick={loginWithGoogle} />

      <div className="my-5">
        <Divider />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form only contains email/password fields */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-accent hover:text-violet-400"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-accent hover:text-violet-400"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
