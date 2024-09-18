import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    styled,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ActiveIndicator from './ActiveIndicator';
import AudioPlayer from './AudioPlayer';

const Header = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: `${theme.spacing(2)} auto`,
    marginBottom: 90,
    color: theme.palette.common.white,
    background: 'linear-gradient(45deg, #343a40, #001219)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid '#ffffff' 0.2`,
    maxWidth: 300,
}));

const GirlHeader = ({ girl, handleProfileClick }) => {
    // Replace with actual audio URLs from the girl object
    const audios = girl.audios || [
        'https://chicagocarhelp.s3.us-east-2.amazonaws.com/ElevenLabs_2024-09-15T01_34_25_Fresa_ivc_s68_sb75_se46_b_m2.mp3',
        'https://chicagocarhelp.s3.us-east-2.amazonaws.com/ElevenLabs_2024-09-15T01_33_30_Fresa_ivc_s68_sb75_se46_b_m2.mp3',
    ];

    return (
        <Header elevation={6}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                    src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                    sx={{ width: 100, height: 100, margin: '0 auto' }}
                />
                <ActiveIndicator />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                {girl.username}{' '}
                <CheckCircleIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                style={{
                    backgroundImage: 'linear-gradient(45deg, #219ebc, #0077b6)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    fontWeight: 'bold'
                }}
                onClick={handleProfileClick}
            >
                View Profile
            </Button>
            {/* Display the audios */}
            <Box sx={{ mt: 2 }}>
                {audios.slice(0, 2).map((audioSrc, index) => (
                    <AudioPlayer key={index} src={audioSrc} />
                ))}
            </Box>
        </Header>
    );
};

export default GirlHeader;
