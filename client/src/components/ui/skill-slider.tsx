interface SkillSliderProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function SkillSlider({ name, label, value, onChange, disabled = false }: SkillSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };
  
  // Calculate progress percentage based on slider value (1-10 scale)
  const progressPercentage = ((value - 1) / 9) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label htmlFor={`skill${name}`} className="text-muted-foreground font-poppins">{label}</label>
        <span className="text-foreground font-poppins font-medium">{value}</span>
      </div>
      <input 
        type="range" 
        id={`skill${name}`} 
        min="1" 
        max="10" 
        value={value}
        onChange={handleChange}
        className="w-full"
        disabled={disabled}
        style={{ "--range-progress": progressPercentage } as React.CSSProperties}
      />
    </div>
  );
}
