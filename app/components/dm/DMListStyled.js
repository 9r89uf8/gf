// components/styled/DMListStyled.js
import { styled, keyframes } from '@mui/system';
import { Card, Button, Box } from '@mui/material';

const flash = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.2; }
    100% { opacity: 1; }
`;

export const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    marginTop: theme.spacing(4),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.2)',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    userSelect: 'none',
}));

export const GirlCard = styled(Card)(({ theme }) => ({
    width: 130,
    height: 230,
    margin: theme.spacing(0, 1.5),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'white',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    flex: '0 0 auto',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    },
}));

export const AvatarWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    margin: theme.spacing(1, 0),
}));

export const StatusIndicator = styled(Box)(({ isActive }) => ({
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: isActive ? '#4CAF50' : '#FFA000',
    border: '2px solid white',
    animation: `${flash} ${isActive ? '2s' : '0s'} infinite`,
}));

export const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'white',
    fontSize: 18,
    height: 48,
    padding: '0 8px',
    margin: '3px 0',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

export const PremiumButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
    border: 0,
    borderRadius: 25,
    color: '#000000',
    fontSize: 14,
    height: 48,
    padding: '0 8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(45deg, #FFA500 30%, #FFD700 90%)',
        boxShadow: '0 3px 10px rgba(255, 165, 0, 0.3)',
    },
}));