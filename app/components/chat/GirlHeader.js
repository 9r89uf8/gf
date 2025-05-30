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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Skeleton, IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import VerifiedIcon from "@/app/components/landing/VerifiedIcon";
import AudioPlayer from './AudioPlayer';
import { DeleteForever } from "@mui/icons-material";
import { deleteMessages } from "@/app/services/chatService";
import Link from 'next/link';
import { keyframes } from "@mui/system";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import VideocamIcon from '@mui/icons-material/Videocam';

const flash = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.2; }
    100% { opacity: 1; }
`;

const GlassCard = styled(Card)(({ theme }) => ({
    maxWidth: 350,
    margin: `${theme.spacing(3)} auto`,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    overflow: 'visible',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: `4px solid ${alpha('#ffffff', 0.3)}`,
    boxShadow: theme.shadows[3],
    marginTop: -35,
    cursor: 'pointer',
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
    color: 'black',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const BackGradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #212529 30%, #000000 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 15px 10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const ViewProfileButton = styled(GradientButton)({
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 23,
    textTransform: 'none',
});

const BackButton = styled(BackGradientButton)({
    borderRadius: 20,
    fontWeight: 900,
    fontSize: 33,
    textTransform: 'none',
});

const DeleteButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #495057 30%, #212529 90%)',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #DD2C00 30%, #FF3D00 90%)',
    },
}));

const InfoBox = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: theme.spacing(2),
    marginBottom: 25,
    textAlign: 'center',
    color: 'white',
}));

const GradientIcon = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
}));

// Modal Style
const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    p: 0, // Remove padding
};

const TweetBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(120deg, #ffffff 0%, #f0f2f5 100%)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    position: 'relative',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    width: '100%', // Make it full width
}));

const TweetTitle = styled(Typography)(({ theme }) => ({
    color: '#1976d2', // MUI's primary blue
    fontSize: '1.1rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'center'
}));

const TweetText = styled(Typography)(({ theme }) => ({
    color: '#6c757d',
    fontSize: '1.3rem',
    lineHeight: 1.5,
    marginBottom: theme.spacing(2.5),
}));

const TweetDate = styled(Typography)(({ theme }) => ({
    color: '#657786',
    fontSize: '1.0rem',
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(2),
    fontStyle: 'italic',
}));

const GirlHeader = ({ girl, loadingGirl }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const conversationHistory = useStore((state) => state.conversationHistory);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        await deleteMessages({ girlId: girl.id });
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'user_deleted_chat', {
                event_category: 'CTA',
                event_label: 'Delete Button'
            });
        }
        handleCloseDeleteDialog();
    };

    const [isFullscreen, setIsFullscreen] = useState(false);
    const handleImageClick = () => {
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    function convertFirestoreTimestampToDate(timestamp) {
        if (!timestamp) return null;
        if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
            return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
        }
        if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
            return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
        }
        return new Date(timestamp);
    }

    if (loadingGirl) {
        // Display Skeleton components while loading
        return (
            <GlassCard>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative" mb={2}>
                            <Skeleton variant="circular" width={120} height={120} />
                        </Box>
                        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" width={250} height={50} sx={{ mb: 3, borderRadius: 2 }} />
                        <Stack spacing={2} width="100%">
                            {Array.from(new Array(5)).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" width="100%" height={50} />
                            ))}
                        </Stack>
                        {conversationHistory && conversationHistory.length > 0 && (
                            <Skeleton variant="rectangular" width={200} height={48} sx={{ mt: 2, borderRadius: 2 }} />
                        )}
                    </Box>
                </CardContent>
            </GlassCard>
        );
    }

    return (
        <>
            <GlassCard>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box position="relative" mb={2}>
                            <ProfileAvatar
                                src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`}
                                alt={girl.username}
                                onClick={handleImageClick}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, marginTop: -1, marginBottom: 1 }}>
                            <Box
                                sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: girl.isActive ? 'green' : 'red',
                                    marginRight: 1,
                                    animation: `${flash} ${girl.isActive ? '4s' : '4s'} infinite`,
                                }}
                            />
                            <Typography variant="body2" style={{ color: 'gray' }}>
                                {girl.isActive ? 'Activa' : 'Inactiva'}
                            </Typography>
                        </Box>
                        {!girl.isActive && convertFirestoreTimestampToDate(girl.lastSeenGirl) && (
                            <Typography variant="body2" style={{ marginTop: 1, color: 'gray' }}>
                                Activa{' '}
                                {formatDistanceToNow(convertFirestoreTimestampToDate(girl.lastSeenGirl), { addSuffix: true, locale: es })}
                            </Typography>
                        )}
                        <Box display="flex" justifyContent="center">
                            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white', marginTop: 1 }}>
                                {girl.username}
                            </Typography>
                            <VerifiedIcon/>
                        </Box>
                        <Box display="flex" justifyContent="center">
                            <Link href={`/dm`} passHref legacyBehavior>
                                <BackButton variant="contained" sx={{ mb: 3 }}>
                                    <KeyboardBackspaceIcon sx={{fontSize: 40}}/>
                                </BackButton>
                            </Link>
                            <Link href={`/${girl.id}`} passHref legacyBehavior>
                                <ViewProfileButton variant="contained" sx={{ mb: 3 }}>
                                    Perfil
                                </ViewProfileButton>
                            </Link>
                        </Box>

                        {/* Add the TweetBox here */}
                        {girl&&girl.tweet&&
                            <TweetBox>
                                <TweetTitle>
                                    último estado
                                </TweetTitle>
                                <TweetText>
                                    {girl.tweet.text}
                                </TweetText>
                                <TweetDate>
                                    {girl.tweet.timestamp
                                        ? formatDistanceToNow(convertFirestoreTimestampToDate(girl.tweet.timestamp), {
                                            addSuffix: true,
                                            locale: es
                                        })
                                        : 'just now'}
                                </TweetDate>
                            </TweetBox>
                        }

                        {/*<Stack spacing={2} width="100%">*/}
                        {/*    {girl && girl.audioFiles && girl.audioFiles.slice(0, 5).map((audioSrc, index) => (*/}
                        {/*        <AudioPlayer key={index} src={`https://d3sog3sqr61u3b.cloudfront.net/${audioSrc}`} />*/}
                        {/*    ))}*/}
                        {/*</Stack>*/}

                        {conversationHistory && conversationHistory.length > 0 && (
                            <DeleteButton
                                variant="contained"
                                startIcon={<DeleteForever />}
                                onClick={handleOpenDeleteDialog}
                                sx={{ mt: 2 }}
                            >
                                Borrar Mensajes
                            </DeleteButton>
                        )}
                    </Box>
                </CardContent>
            </GlassCard>
            <Modal
                open={isFullscreen}
                onClose={handleCloseFullscreen}
                aria-labelledby="fullscreen-image-modal"
                aria-describedby="modal-to-display-fullscreen-image"
                disableScrollLock
            >
                <Box sx={modalStyle}>
                    <img
                        src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`}
                        alt={`Post ${girl.id} Fullscreen`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '0',
                            cursor: 'pointer',
                        }}
                        onClick={handleCloseFullscreen}
                    />
                </Box>
            </Modal>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"¿Estás seguro de que quieres borrar todos los mensajes?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Todos los mensajes serán eliminados permanentemente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GirlHeader;



