import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Select = ({
    label,
    id,
    error,
    options = [],
    placeholder = 'Select...',
    required = false,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="label">
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={id}
                    className={`form-input appearance-none pr-10 ${error ? 'border-red-500 focus:ring-red-500' : ''
                        } ${className}`}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default Select;
