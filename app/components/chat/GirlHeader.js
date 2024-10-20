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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Skeleton, // Import Skeleton
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import ActiveIndicator from './ActiveIndicator';
import AudioPlayer from './AudioPlayer';
import { DeleteForever } from "@mui/icons-material";
import { deleteMessages } from "@/app/services/chatService";
import Link from 'next/link';
import {keyframes} from "@mui/system";
import {formatDistanceToNow} from "date-fns";
import {es} from "date-fns/locale";
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
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
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

const DeleteButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FF3D00 30%, #FF6E40 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 0, 0, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    '&:hover': {
        background: 'linear-gradient(45deg, #DD2C00 30%, #FF3D00 90%)',
    },
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
                                src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                alt={girl.username}
                                onClick={handleImageClick}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, marginTop:-1, marginBottom:1 }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: girl.isActive ? 'green' : 'red',
                                marginRight: 1,
                                animation: `${flash} ${girl.isActive ? '2s' : '2s'} infinite`,
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
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
                            {girl.username}
                            <VerifiedIcon
                                sx={{ ml: 1, verticalAlign: 'middle', color: '#4FC3F7' }}
                            />
                        </Typography>
                        <Link href={`/${girl.id}`} passHref legacyBehavior>
                            <ViewProfileButton
                                variant="contained"
                                sx={{ mb: 3 }}
                            >
                                Fotos
                            </ViewProfileButton>
                        </Link>
                        <Stack spacing={2} width="100%">
                            {girl && girl.audioFiles && girl.audioFiles.slice(0, 5).map((audioSrc, index) => (
                                <AudioPlayer key={index} src={`https://d3sog3sqr61u3b.cloudfront.net/${audioSrc}`} />
                            ))}
                        </Stack>

                        {conversationHistory && conversationHistory.length > 0 &&
                            <DeleteButton
                                variant="contained"
                                startIcon={<DeleteForever />}
                                onClick={handleOpenDeleteDialog}
                                sx={{ mt: 2 }}
                            >
                                Borrar Mensajes
                            </DeleteButton>
                        }
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
                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                        alt={`Post ${girl.id} Fullscreen`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain', // Maintain aspect ratio
                            borderRadius: '0', // Remove border radius for a cleaner look
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

