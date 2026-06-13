import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ label, type = "text", name, value, onChange, placeholder, required, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-accent/60 ${
            error ? "border-red-500/60" : "border-border focus:border-accent"
          } ${isPassword ? "pr-11" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
