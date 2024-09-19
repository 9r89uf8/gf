import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    styled,
    Stack,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ActiveIndicator from './ActiveIndicator';
import AudioPlayer from './AudioPlayer';

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 350,
    margin: `${theme.spacing(3)} auto`,
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #1a2027, #2c3e50)'
        : 'linear-gradient(45deg, #e0e0e0, #f5f5f5)',
    boxShadow: theme.shadows[10],
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'visible',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[3],
    marginTop: -35,
}));

const ViewProfileButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    padding: theme.spacing(1, 3),
    fontWeight: 600,
    textTransform: 'none',
    background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #1e88e5, #1eb8e5)',
    },
}));

const GirlHeader = ({ girl, handleProfileClick }) => {
    const audios = girl.audios || [
        'https://chicagocarhelp.s3.us-east-2.amazonaws.com/ElevenLabs_2024-09-15T01_34_25_Fresa_ivc_s68_sb75_se46_b_m2.mp3',
        'https://chicagocarhelp.s3.us-east-2.amazonaws.com/ElevenLabs_2024-09-15T01_33_30_Fresa_ivc_s68_sb75_se46_b_m2.mp3',
    ];

    return (
        <StyledCard>
            <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box position="relative" mb={2}>
                        <ProfileAvatar
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                            alt={girl.username}
                        />
                        <ActiveIndicator />
                    </Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        {girl.username}
                        <VerifiedIcon
                            sx={{ ml: 1, verticalAlign: 'middle', color: 'primary.main' }}
                        />
                    </Typography>
                    <ViewProfileButton
                        variant="contained"
                        onClick={handleProfileClick}
                        sx={{ mb: 3 }}
                    >
                        View Profile
                    </ViewProfileButton>
                    <Stack spacing={2} width="100%">
                        {audios.slice(0, 2).map((audioSrc, index) => (
                            <AudioPlayer key={index} src={audioSrc} />
                        ))}
                    </Stack>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default GirlHeader;
