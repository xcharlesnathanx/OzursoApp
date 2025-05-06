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
      />
    </div>
  );
}
