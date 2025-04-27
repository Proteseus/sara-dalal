import React from 'react';

interface RadioGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {options.map((option) => (
        <label 
          key={option} 
          className={`
            flex items-center gap-3 cursor-pointer p-3 rounded-lg
            transition-colors duration-200
            ${value === option 
              ? 'bg-primary/5 border border-primary/20' 
              : 'hover:bg-gray-50 border border-transparent'
            }
          `}
        >
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              checked={value === option}
              onChange={() => onChange(option)}
              className="
                w-5 h-5 appearance-none rounded-full
                border-2 border-gray-300
                checked:border-primary checked:bg-primary
                focus:ring-2 focus:ring-primary/20
                transition-colors duration-200
                cursor-pointer
              "
            />
            {value === option && (
              <div className="absolute w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <span className="text-base text-gray-700 font-medium">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup; 