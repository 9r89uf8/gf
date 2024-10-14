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
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import ActiveIndicator from './ActiveIndicator';
import AudioPlayer from './AudioPlayer';
import { DeleteForever } from "@mui/icons-material";
import { deleteMessages } from "@/app/services/chatService";

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

const EnlargedImage = styled('img')({
    height: 280,
    objectFit: 'contain',
});

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    right: 7,
    top: 5,
    color: 'white',
}));

const GirlHeader = ({ girl, handleProfileClick }) => {
    const [isImageEnlarged, setIsImageEnlarged] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
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


    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = async () => {
        await deleteMessages({girlId: girl.id});
        handleCloseDeleteDialog();
    };

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
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: 'white' }}>
                            {girl.username}
                            <VerifiedIcon
                                sx={{ ml: 1, verticalAlign: 'middle', color: '#4FC3F7' }}
                            />
                        </Typography>
                        <ViewProfileButton
                            variant="contained"
                            onClick={handleProfileClick}
                            sx={{ mb: 3 }}
                        >
                            Fotos
                        </ViewProfileButton>
                        <Stack spacing={2} width="100%">
                            {audios.slice(0, 2).map((audioSrc, index) => (
                                <AudioPlayer key={index} src={audioSrc} />
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
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
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
                        <CancelTwoToneIcon sx={{ fontSize: 36 }}/>
                    </CloseButton>
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
