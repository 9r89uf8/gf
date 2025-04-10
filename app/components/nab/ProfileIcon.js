import React from 'react';

const ProfileIcon = () => {
    const blackColor = '#000000';

    return (
        <div style={{ height: 80 }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%' }}
            >
                {/* Background circles */}
                <circle cx="50" cy="50" r="40" fill={blackColor} opacity="0.2" />
                <circle cx="50" cy="50" r="35" fill={blackColor} />

                {/* Central avatar (single user) */}
                <circle cx="50" cy="40" r="7" fill="white" />
                <path d="M35 60 C35 50 65 50 65 60 L65 62 L35 62 Z" fill="white" />
            </svg>
        </div>
    );
};

export default ProfileIcon;
