interface Props {
  value: number;
  target: number;
  label: string;
  unit?: string;
  size?: 'lg' | 'sm';
}

export default function ProgressBar({ value, target, label, unit = '', size = 'sm' }: Props) {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const isOver = value > target && target > 0;
  const barColor = isOver ? 'bg-amber-500' : 'bg-emerald-500';
  const height = size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className={`text-xs font-semibold ${isOver ? 'text-amber-600' : 'text-slate-700'}`}>
          {Math.round(value * 10) / 10}
          <span className="text-slate-400 font-normal">
            {' '}/ {target}
            {unit}
          </span>
        </span>
      </div>
      <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
