import React from 'react';

const Spinner = ({ size = 'sm', className = '' }) => {
    const sizes = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
    return (
        <div className={`${sizes[size]} ${className} border-2 border-white/30 border-t-white rounded-full animate-spin`} />
    );
};

export default Spinner;
