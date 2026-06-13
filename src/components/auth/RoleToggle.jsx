import { Users, Building2 } from "lucide-react";

const roles = [
  { value: "CANDIDATE", label: "Candidate", icon: Users },
  { value: "COMPANY", label: "Company", icon: Building2 },
];

const RoleToggle = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-200">I am a...</span>
      <div className="grid grid-cols-2 gap-3">
        {roles.map(({ value: roleValue, label, icon: Icon }) => {
          const active = value === roleValue;
          return (
            <button
              key={roleValue}
              type="button"
              onClick={() => onChange(roleValue)}
              className={`flex flex-col items-center gap-2 rounded-xl border px-4 py-5 transition ${
                active
                  ? "border-accent bg-accent/10 text-white"
                  : "border-border bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <Icon
                size={22}
                className={active ? "text-accent" : "text-zinc-500"}
              />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleToggle;
