import React, { useState } from 'react';
import { useStore } from '@/app/store/store';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    styled,
    Stack,
    Modal,
    IconButton,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import ActiveIndicator from './ActiveIndicator';
import AudioPlayer from './AudioPlayer';
import {DeleteForever} from "@mui/icons-material";
import {deleteMessages} from "@/app/services/chatService";

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
    cursor: 'pointer',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    borderRadius: theme.shape.borderRadius * 3,
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

const EnlargedImage = styled('img')({
    height: 230,
    objectFit: 'contain',
});

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: 7,
    top: 5,
    color: 'black',
}));

const GirlHeader = ({ girl, handleProfileClick }) => {
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);
    const conversationHistory = useStore((state) => state.conversationHistory);
    const audios = girl.audios || [
        'https://chicagocarhelp.s3.us-east-2.amazonaws.com/ElevenLabs_2024-09-15T01_34_25_Fresa_ivc_s68_sb75_se46_b_m2.mp3',
        'https://chicagocarhelp.s3.us-east-2.amazonaws.com/ElevenLabs_2024-09-15T01_33_30_Fresa_ivc_s68_sb75_se46_b_m2.mp3',
    ];

    const handleImageClick = () => {
        setIsImageEnlarged(true);
    };

    const handleCloseEnlargedImage = () => {
        setIsImageEnlarged(false);
    };

    const deleteMessagesHandle = async () => {
        await deleteMessages()
    };

    return (
        <>
            <StyledCard>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative" mb={2}>
                            <ProfileAvatar
                                src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                alt={girl.username}
                                onClick={handleImageClick}
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

                        {conversationHistory&&conversationHistory.length>0&&
                            <ActionButton
                                style={{marginBottom: 2}}
                                variant="contained"
                                color="error"
                                startIcon={<DeleteForever />}
                                onClick={deleteMessagesHandle}
                                sx={{ mt: 2 }}
                            >
                                Borrar Mensajes
                            </ActionButton>
                        }


                    </Box>
                </CardContent>
            </StyledCard>
            <Modal
                open={isImageEnlarged}
                onClose={handleCloseEnlargedImage}
                aria-labelledby="enlarged-image-modal"
                aria-describedby="enlarged-profile-image"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        outline: 'none',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <EnlargedImage
                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                        alt={girl.username}
                    />
                    <CloseButton onClick={handleCloseEnlargedImage} aria-label="close">
                        <CancelTwoToneIcon sx={{ fontSize: 36,}}/>
                    </CloseButton>
                </Box>
            </Modal>
        </>
    );
};

export default GirlHeader;
