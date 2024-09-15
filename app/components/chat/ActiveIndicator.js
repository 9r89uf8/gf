import { styled } from '@mui/material';

const ActiveIndicator = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: '15px',
    height: '15px',
    backgroundColor: '#007BFF',
    borderRadius: '50%',
    border: `2px solid ${theme.palette.background.paper}`,
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
        '0%': { transform: 'scale(1)', opacity: 1 },
        '50%': { transform: 'scale(1.5)', opacity: 0.7 },
        '100%': { transform: 'scale(1)', opacity: 1 },
    },
}));

export default ActiveIndicator;
