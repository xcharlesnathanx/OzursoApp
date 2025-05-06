interface SkillBarProps {
  value: number;
  className?: string;
}

export function SkillBar({ value, className = "" }: SkillBarProps) {
  // Calculate percentage width from 1-10 value
  const percentage = (value / 10) * 100;
  
  return (
    <div className={`w-full bg-background h-2 rounded-full ${className}`}>
      <div 
        className="skill-bar bg-secondary h-2 rounded-full" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
