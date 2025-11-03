
import React, { ReactNode } from 'react';

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({ id, label, type, placeholder, value, onChange, icon }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-8 pr-4 py-3 bg-transparent text-white border-b-2 border-white/20 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-primary-400 transition-colors duration-300"
        />
      </div>
    </div>
  );
};
