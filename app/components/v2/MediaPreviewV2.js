// app/components/v2/MediaPreviewV2.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Modal, Fade, Backdrop } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Animations
const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components
const PreviewBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(248,249,250,0.98))',
  borderTop: '1px solid rgba(0,0,0,0.08)',
  backdropFilter: 'blur(10px)',
  animation: `${slideUp} 0.3s ease-out`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
    animation: `${pulse} 2s ease-in-out infinite`,
  }
}));

const MediaThumbnail = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: 'rgba(0,0,0,0.02)',
  border: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(10px)',
  color: '#1a1a1a',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.95)',
    transform: 'scale(1.1)',
  }
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  height: '90vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
}));

const MediaInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0,0,0,0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '12px 24px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  maxWidth: '90%',
}));

const AudioVisualizer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  height: '60px',
  '& .bar': {
    width: '3px',
    backgroundColor: '#1a1a1a',
    borderRadius: '2px',
    animation: `${pulse} 1.2s ease-in-out infinite`,
  }
}));

const MediaPreviewV2 = ({ selectedMedia, mediaPreview, onClear }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [fileSize, setFileSize] = useState('');

    useEffect(() => {
        if (selectedMedia?.file) {
            // Format file size
            const size = selectedMedia.file.size;
            if (size < 1024) {
                setFileSize(`${size} B`);
            } else if (size < 1024 * 1024) {
                setFileSize(`${(size / 1024).toFixed(1)} KB`);
            } else {
                setFileSize(`${(size / (1024 * 1024)).toFixed(1)} MB`);
            }
        }
    }, [selectedMedia]);

    if (!mediaPreview && !selectedMedia) return null;

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const getFileName = () => {
        if (!selectedMedia?.file) return '';
        const name = selectedMedia.file.name;
        return name.length > 30 ? name.substring(0, 27) + '...' : name;
    };

    return (
        <>
            {/* Inline Preview Bar */}
            <PreviewBar sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <MediaThumbnail 
                        onClick={handleModalOpen}
                        sx={{ 
                            width: selectedMedia.type === 'audio' ? '80px' : 'auto',
                            height: '80px'
                        }}
                    >
                        {selectedMedia.type === 'image' && mediaPreview && (
                            <img 
                                src={mediaPreview} 
                                alt="Preview" 
                                style={{ 
                                    height: '80px',
                                    width: 'auto',
                                    maxWidth: '120px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }} 
                            />
                        )}
                        {selectedMedia.type === 'video' && mediaPreview && (
                            <video 
                                src={mediaPreview} 
                                style={{ 
                                    height: '80px',
                                    width: 'auto',
                                    maxWidth: '120px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                                muted
                            />
                        )}
                        {selectedMedia.type === 'audio' && (
                            <Box 
                                sx={{ 
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
                                }}
                            >
                                <AudioVisualizer>
                                    {[...Array(5)].map((_, i) => (
                                        <Box
                                            key={i}
                                            className="bar"
                                            sx={{
                                                height: `${20 + Math.random() * 30}px`,
                                                animationDelay: `${i * 0.1}s`
                                            }}
                                        />
                                    ))}
                                </AudioVisualizer>
                            </Box>
                        )}
                    </MediaThumbnail>
                    
                    <Box flex={1}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 600,
                                color: 'rgba(15, 23, 42, 0.95)'
                            }}
                        >
                            {getFileName()}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: 'rgba(71, 85, 105, 0.8)' 
                            }}
                        >
                            {selectedMedia.type === 'image' && '📷 Imagen'}
                            {selectedMedia.type === 'video' && '🎥 Video'}
                            {selectedMedia.type === 'audio' && '🎵 Audio'}
                            {' • '}{fileSize}
                        </Typography>
                    </Box>
                    
                    <IconButton 
                        onClick={onClear}
                        sx={{ 
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </PreviewBar>

            {/* Full Screen Modal */}
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(5px)'
                    }
                }}
            >
                <Fade in={modalOpen}>
                    <ModalContent onClick={handleModalClose}>
                        <CloseButton 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleModalClose();
                            }}
                            size="large"
                        >
                            <CloseIcon />
                        </CloseButton>

                        {selectedMedia.type === 'image' && mediaPreview && (
                            <img
                                src={mediaPreview}
                                alt="Full preview"
                                style={{
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        {selectedMedia.type === 'video' && mediaPreview && (
                            <video
                                src={mediaPreview}
                                controls
                                autoPlay
                                style={{
                                    maxWidth: '90%',
                                    maxHeight: '90%',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        {selectedMedia.type === 'audio' && (
                            <Box
                                sx={{
                                    width: '400px',
                                    maxWidth: '90%',
                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                    borderRadius: '20px',
                                    p: 4,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        gap: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        <AudiotrackIcon 
                                            sx={{ 
                                                fontSize: '60px', 
                                                color: 'white' 
                                            }} 
                                        />
                                    </Box>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            textAlign: 'center',
                                            color: 'rgba(15, 23, 42, 0.95)',
                                            fontWeight: 600
                                        }}
                                    >
                                        {selectedMedia.file.name}
                                    </Typography>
                                    <audio 
                                        controls 
                                        src={mediaPreview}
                                        style={{ width: '100%' }}
                                        autoPlay
                                    />
                                </Box>
                            </Box>
                        )}

                        <MediaInfo>
                            <InsertDriveFileIcon fontSize="small" />
                            <Typography variant="body2">
                                {selectedMedia.file.name} • {fileSize}
                            </Typography>
                        </MediaInfo>
                    </ModalContent>
                </Fade>
            </Modal>
        </>
    );
};

export default MediaPreviewV2;