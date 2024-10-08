import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import HeadsetIcon from '@mui/icons-material/Headset';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

const GradientPaper = styled(Paper)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: theme.palette.common.white,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
}));

const FeatureItem = ({ icon, text }) => (
    <Box display="flex" alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
            {text}
        </Typography>
    </Box>
);

const UpgradeReminder = ({ handleBuy }) => (
    <Box
        position="fixed"
        bottom={80}
        left={0}
        right={0}
        margin="0 auto"
        maxWidth={400}
        zIndex={1000}
    >
        <GradientPaper elevation={4}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
                Cuenta Premium incluye:
            </Typography>
            <Box mb={3}>
                <FeatureItem icon={<ImageIcon style={{fontSize:40}}/>} text="Arely te puede enviar fotos." />
                <FeatureItem icon={<HeadsetIcon style={{fontSize:40}}/>} text="Audios de Arely." />
                <FeatureItem icon={<PhotoLibraryIcon style={{fontSize:40}}/>} text="Fotos de Arely en tanga." />
                <FeatureItem icon={<AllInclusiveIcon style={{fontSize:40}}/>} text="Mensajes ilimitados" />
            </Box>
            <Button
                variant="contained"
                fullWidth
                onClick={handleBuy}
                sx={{
                    backgroundColor: 'common.white',
                    color: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'grey.100',
                    },
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: 16
                }}
            >
                Comprar Premium
            </Button>
        </GradientPaper>
    </Box>
);

export default UpgradeReminder;
