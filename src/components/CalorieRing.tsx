interface Props {
  value: number;
  target: number;
}

export default function CalorieRing({ value, target }: Props) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  const offset = circumference * (1 - pct);
  const remaining = Math.max(0, target - value);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800">{Math.round(value)}</span>
        <span className="text-xs text-slate-400 font-medium">of {target} cal</span>
        <span className="text-xs text-emerald-600 font-semibold mt-1">
          {Math.round(remaining)} left
        </span>
      </div>
    </div>
  );
}
