import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSvg = styled('svg')(({ theme }) => ({
    background: 'transparent',
    overflow: 'visible',
    transformOrigin: 'center',
    '@keyframes pumping': {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.1)' },
        '100%': { transform: 'scale(1)' },
    },
    animation: 'pumping 1s infinite ease-in-out',
}));

const HeartIcon = () => {
    const heartPattern = [
        [0, 1, 0, 0, 0, 1, 0],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
    ];

    const rectSize = 10;

    const rectangles = heartPattern.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => {
            if (cell === 1) {
                return (
                    <rect
                        key={`${rowIndex}-${colIndex}`}
                        x={colIndex * rectSize}
                        y={rowIndex * rectSize}
                        width={rectSize}
                        height={rectSize}
                        fill="red"
                        stroke="black"
                    />
                );
            } else {
                return null;
            }
        })
    );

    return (
        <Box sx={{ height: 25, marginLeft: 1 }}>
            <StyledSvg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 70 60"
                width="100%"
                height="100%"
            >
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <g filter="url(#glow)">{rectangles}</g>
            </StyledSvg>
        </Box>
    );
};

export default HeartIcon;
