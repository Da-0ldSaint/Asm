import React from 'react';

const Input = ({
    label,
    id,
    error,
    icon: Icon,
    rightElement,
    className = '',
    required = false,
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
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
                        <Icon className="w-4 h-4" />
                    </div>
                )}
                <input
                    id={id}
                    className={`form-input ${Icon ? 'pl-10' : ''} ${rightElement ? 'pr-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''
                        } ${className}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
};

export default Input;
