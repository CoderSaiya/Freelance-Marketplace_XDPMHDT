import React from 'react';

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  width?: string; // Optional width prop
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, type = 'text', value, onChange, name, width = 'w-full' }) => {
  return (
    <div className={`relative mb-8 ${width}`}> {/* Adjust width */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder=" "
        className="block px-4 py-3 w-full text-md text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 peer transition-all"
      />
      <label
        htmlFor={name}
        className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
