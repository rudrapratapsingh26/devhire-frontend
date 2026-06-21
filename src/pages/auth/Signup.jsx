import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import Input from "../../components/auth/Input";
import Button from "../../components/auth/Button";
import GoogleButton from "../../components/auth/GoogleButton";
import Divider from "../../components/auth/Divider";
import RoleToggle from "../../components/auth/RoleToggle";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "CANDIDATE",
  });
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
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Join DevHire and find your next opportunity
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Jane Doe"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <RoleToggle
          value={formData.role}
          onChange={(role) => setFormData({ ...formData, role })}
        />

        <Button type="submit" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-accent hover:text-violet-400"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
