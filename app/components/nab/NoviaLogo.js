'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const colorShift = keyframes`
  0% {
    color: #ff3366;
  }
  50% {
    color: #ff66a3;
  }
  100% {
    color: #ff3366;
  }
`;

// Styled components
const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover .logo-icon': {
        animation: `${pulse} 1.5s infinite ease-in-out`,
    },
    '&:hover .novia-text': {
        animation: `${colorShift} 3s infinite ease-in-out`,
    }
}));

const LogoText = styled(Typography)(({ theme }) => ({
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    fontSize: '26px',
    background: 'linear-gradient(90deg, #ff3366 0%, #ff66a3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px',
    marginRight: theme.spacing(0.5),
    transition: 'all 0.3s ease',
}));

const ChatText = styled(Typography)(({ theme }) => ({
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: '26px',
    color: '#8a2be2',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
}));

const LogoIcon = styled(FavoriteIcon)(({ theme }) => ({
    color: '#ff3366',
    fontSize: '18px',
    marginLeft: '2px',
    marginBottom: '12px',
    transition: 'all 0.3s ease',
}));

const NoviaLogo = ({ onClick }) => {
    return (
        <LogoContainer onClick={onClick}>
            <LogoText className="novia-text">
                novia
            </LogoText>
            <ChatText>
                chat
            </ChatText>
            <LogoIcon className="logo-icon" />
        </LogoContainer>
    );
};

export default NoviaLogo;