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
        <label htmlFor={id} className="block text-sm font-medium text-slate-800 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
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
          className="w-full pl-11 pr-3 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-200 text-sm placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition"
        />
      </div>
    </div>
  );
};