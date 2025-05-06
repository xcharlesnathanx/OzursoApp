interface SkillBarProps {
  value: number;
  className?: string;
}

export function SkillBar({ value, className = "" }: SkillBarProps) {
  // Calculate percentage width from 1-10 value
  const percentage = (value / 10) * 100;
  
  return (
    <div className={`w-full bg-background h-3 rounded-full overflow-hidden border border-border ${className}`}>
      <div 
        className="skill-bar bg-secondary h-3 rounded-full shadow-sm" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
