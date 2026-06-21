import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const roleRedirects = {
  CANDIDATE: "/candidate/jobs",
  COMPANY: "/company/dashboard",
  ADMIN: "/admin/dashboard",
};

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromGoogle } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userStr = searchParams.get("user");

    if (accessToken && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = roleRedirects[user.role] || "/";
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
};

export default GoogleSuccess;
