interface Stat {
  icon?: React.ReactNode;
  value: string;
  label?: string;
}

interface Props {
  stats: Stat[];
  className?: string;
}

export default function HudStatRow({ stats, className = '' }: Props) {
  return (
    <div className={`hud-stat-row ${className}`}>
      {stats.map((stat) => (
        <div key={stat.value + (stat.label ?? '')} className="hud-stat">
          {stat.icon && <span className="hud-stat-icon">{stat.icon}</span>}
          <span className="hud-stat-value">{stat.value}</span>
          {stat.label && <span className="hud-stat-label">{stat.label}</span>}
        </div>
      ))}
    </div>
  );
}
