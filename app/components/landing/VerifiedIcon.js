import React from 'react';
import { Box } from '@mui/material';

const VerifiedIcon = () => {
    return (
        <Box sx={{height: 40, marginLeft: 1}}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                style={{ background: 'transparent', overflow: 'visible' }}
            >
                <defs>
                    <clipPath id="circleClip">
                        <circle cx="50" cy="50" r="40"/>
                    </clipPath>
                </defs>

                {/* Inner blue circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="#ffd670"  // Blue fill color
                />

                {/* Checkmark path */}
                <path
                    d="M30 50 L45 65 L70 35"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* Outer pulsing circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#fcbf49"
                    strokeWidth="2"
                >
                    <animate
                        attributeName="r"
                        from="40"
                        to="50"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        values="1;0"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </Box>
    );
};

export default VerifiedIcon;


