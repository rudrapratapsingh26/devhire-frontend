const variants = {
  primary:
    "bg-accent text-white hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed",
  secondary: "bg-zinc-900/60 text-white border border-border hover:bg-zinc-800",
};

const Button = ({
  children,
  variant = "primary",
  loading,
  className = "",
  icon,
  ...props
}) => {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {icon}
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
