import React from 'react';

const MessageIcon = () => {
    const blueColor = '#0077b6';

    return (
        <div style={{ height: 90 }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                style={{ width: '100%', height: '100%' }}
            >
                <circle cx="50" cy="50" r="40" fill={blueColor} opacity="0.2">
                    <animate
                        attributeName="r"
                        values="40;45;40"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.2;0.1;0.2"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>

                <circle cx="50" cy="50" r="35" fill={blueColor} />

                <path
                    d="M35 35 L65 35 Q70 35 70 40 L70 55 Q70 60 65 60 L55 60 L50 65 L45 60 L35 60 Q30 60 30 55 L30 40 Q30 35 35 35"
                    fill="white"
                >
                    <animate
                        attributeName="d"
                        values="M35 35 L65 35 Q70 35 70 40 L70 55 Q70 60 65 60 L55 60 L50 65 L45 60 L35 60 Q30 60 30 55 L30 40 Q30 35 35 35;
                    M35 37 L65 37 Q70 37 70 42 L70 57 Q70 62 65 62 L55 62 L50 67 L45 62 L35 62 Q30 62 30 57 L30 42 Q30 37 35 37;
                    M35 35 L65 35 Q70 35 70 40 L70 55 Q70 60 65 60 L55 60 L50 65 L45 60 L35 60 Q30 60 30 55 L30 40 Q30 35 35 35"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                </path>

                <circle cx="40" cy="47.5" r="3" fill={blueColor}>
                    <animate
                        attributeName="cy"
                        values="47.5;49.5;47.5"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="50" cy="47.5" r="3" fill={blueColor}>
                    <animate
                        attributeName="cy"
                        values="47.5;49.5;47.5"
                        dur="1.5s"
                        begin="0.2s"
                        repeatCount="indefinite"
                    />
                </circle>
                <circle cx="60" cy="47.5" r="3" fill={blueColor}>
                    <animate
                        attributeName="cy"
                        values="47.5;49.5;47.5"
                        dur="1.5s"
                        begin="0.4s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    );
};

export default MessageIcon;