import React from 'react';

const Loader = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: { width: '20px', height: '20px', borderWidth: '2px' },
        md: { width: '40px', height: '40px', borderWidth: '4px' },
        lg: { width: '60px', height: '60px', borderWidth: '6px' },
    };

    return (
        <div className="loader-container">
            <div className="loader" style={sizeClasses[size]}></div>
        </div>
    );
};

export default Loader;
