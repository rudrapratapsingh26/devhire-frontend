const Divider = ({ label = "or" }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="h-px flex-1 bg-border" />
    <span className="text-xs text-zinc-500">{label}</span>
    <div className="h-px flex-1 bg-border" />
  </div>
);

export default Divider;
