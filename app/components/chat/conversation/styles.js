// styles.js

import { keyframes, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import LikesIcon from "@mui/icons-material/Favorite";

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(3.4); }
  100% { transform: scale(1); }
`;

export const AnimatedLikesIcon = styled(LikesIcon)(({ theme }) => ({
    color: 'red',
    animation: `${pop} 0.3s ease-in-out`,
}));

export const BlueGradientHeartIcon = styled(LikesIcon)(({ theme }) => ({
    fontSize: 28,
    color: 'white',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${pop} 0.3s ease-in-out`,
}));

export const UserMessage = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(to right, #2c3e50, #4a5568)',
    boxShadow: '0 4px 6px rgba(72, 87, 118, 0.3), 0 1px 3px rgba(0, 0, 0, 0.08)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    alignSelf: 'flex-end',
    color: '#f8f9fa',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));

export const AssistantMessage = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .2)',
    color: 'black',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    margin: theme.spacing(1),
    alignSelf: 'flex-start',
    cursor: 'pointer',
    '&:hover': {
        opacity: 0.8,
    },
}));

export const ResponseMessage = styled(Typography)(({ theme }) => ({
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    color: 'black',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    marginBottom: -5,
    marginLeft: 20,
    alignSelf: 'flex-start',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));
