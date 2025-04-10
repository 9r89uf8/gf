import React from 'react';

const FireIcon = () => {
    const blackColor = '#000000';

    return (
        <div style={{ height: 75 }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%' }}
            >
                {/* Background circles */}
                <circle cx="50" cy="50" r="40" fill={blackColor} opacity="0.2" />
                <circle cx="50" cy="50" r="35" fill={blackColor} />

                {/* Two user avatars in white */}
                {/* Main user (center) */}
                <circle cx="50" cy="40" r="6" fill="white" />
                <path d="M40 55 C40 49 60 49 60 55 L60 57 L40 57 Z" fill="white" />

                {/* Secondary user (left) */}
                <circle cx="36" cy="44" r="4" fill="white" />
                <path d="M30 54 C30 50 42 50 42 54 L42 55 L30 55 Z" fill="white" />

                {/* Secondary user (right) */}
                <circle cx="64" cy="44" r="4" fill="white" />
                <path d="M58 54 C58 50 70 50 70 54 L70 55 L58 55 Z" fill="white" />
            </svg>
        </div>
    );
};

export default FireIcon;

