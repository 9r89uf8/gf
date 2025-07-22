'use client';
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    CircularProgress,
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import PhotoIcon from '@mui/icons-material/Photo';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    overflow: 'hidden',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'rgba(15, 23, 42, 0.04)',
    },
    '& td': {
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    },
    '&:last-child td': {
        borderBottom: 'none',
    }
}));

const MediaPreview = styled('div')(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    border: '2px solid rgba(15, 23, 42, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    '& video': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    }
}));

const PremiumBadge = styled(Chip)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: '#000',
    fontWeight: 600,
    '& .MuiChip-icon': {
        color: '#000',
    }
}));

export default function GalleryItemsTable({ items, loading, selectedGirl, onRefresh, onDelete }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [previewDialog, setPreviewDialog] = useState({ open: false, url: '', type: '' });
    const [thumbnailErrors, setThumbnailErrors] = useState({});

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        setDeleting(true);
        try {
            const response = await fetch('/api/v2/gallery/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: itemToDelete.id })
            });

            if (response.ok) {
                onDelete();
                setDeleteDialogOpen(false);
                setItemToDelete(null);
            } else {
                const error = await response.json();
                console.error('Delete failed:', error);
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handlePreviewClick = (mediaUrl, mediaType) => {
        setPreviewDialog({ open: true, url: mediaUrl, type: mediaType });
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    if (!selectedGirl) {
        return (
            <ModernCard variant="elevated" animate={true}>
                <CardContentWrapper>
                    <Typography variant="h6" sx={{ color: 'rgba(71, 85, 105, 0.8)', textAlign: 'center' }}>
                        Select a girl to view gallery items
                    </Typography>
                </CardContentWrapper>
            </ModernCard>
        );
    }

    return (
        <>
            <ModernCard variant="elevated" animate={true}>
                <CardContentWrapper>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                            Gallery Items
                        </Typography>
                        <IconButton 
                            onClick={onRefresh} 
                            sx={{ 
                                color: 'rgba(15, 23, 42, 0.7)',
                                '&:hover': {
                                    backgroundColor: 'rgba(15, 23, 42, 0.08)'
                                }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                            <CircularProgress />
                        </Box>
                    ) : items.length === 0 ? (
                        <Typography sx={{ color: 'rgba(71, 85, 105, 0.8)', textAlign: 'center', py: 5 }}>
                            No gallery items yet
                        </Typography>
                    ) : (
                        <StyledTableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Preview</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Type</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Status</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Text</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Visibility</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <StyledTableRow key={item.id}>
                                            <TableCell>
                                                <MediaPreview onClick={() => handlePreviewClick(item.mediaUrl, item.mediaType)}>
                                                    {item.cloudflareUploadPending ? (
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            height: '100%',
                                                            background: 'rgba(15, 23, 42, 0.05)'
                                                        }}>
                                                            <CircularProgress size={30} />
                                                        </Box>
                                                    ) : item.mediaType === 'image' ? (
                                                        <img src={item.mediaUrl} alt="Gallery item" />
                                                    ) : item.uploadId && !thumbnailErrors[item.id] ? (
                                                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                                            <img 
                                                                src={`https://videodelivery.net/${item.uploadId}/thumbnails/thumbnail.jpg?time=1s&height=80`}
                                                                alt="Video thumbnail"
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={() => {
                                                                    setThumbnailErrors(prev => ({ ...prev, [item.id]: true }));
                                                                }}
                                                            />
                                                            <PlayCircleOutlineIcon 
                                                                sx={{ 
                                                                    position: 'absolute', 
                                                                    top: '50%', 
                                                                    left: '50%', 
                                                                    transform: 'translate(-50%, -50%)',
                                                                    color: 'white',
                                                                    fontSize: 32,
                                                                    filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.7))',
                                                                    pointerEvents: 'none'
                                                                }} 
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            height: '100%',
                                                            background: 'rgba(15, 23, 42, 0.05)',
                                                            cursor: 'pointer'
                                                        }}>
                                                            <VideoFileIcon sx={{ fontSize: 40, color: 'rgba(71, 85, 105, 0.8)' }} />
                                                        </Box>
                                                    )}
                                                </MediaPreview>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={item.mediaType === 'image' ? <PhotoIcon /> : <VideoFileIcon />}
                                                    label={item.mediaType}
                                                    size="small"
                                                    sx={{ 
                                                        color: 'rgba(15, 23, 42, 0.9)',
                                                        borderRadius: 16
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {item.isPremium ? (
                                                    <PremiumBadge
                                                        icon={<StarIcon />}
                                                        label="Premium"
                                                        size="small"
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={<LockIcon />}
                                                        label="Free"
                                                        size="small"
                                                        sx={{ 
                                                            color: 'rgba(71, 85, 105, 0.8)',
                                                            background: 'rgba(15, 23, 42, 0.05)',
                                                            borderRadius: 16
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.text ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TextFieldsIcon sx={{ fontSize: 18, color: 'rgba(71, 85, 105, 0.6)' }} />
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: 'rgba(15, 23, 42, 0.9)',
                                                                maxWidth: 150,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                            title={item.text}
                                                        >
                                                            {item.text}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.5)' }}>
                                                        No text
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={item.displayToGallery !== false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    label={item.displayToGallery !== false ? 'Visible' : 'Hidden'}
                                                    size="small"
                                                    sx={{ 
                                                        color: item.displayToGallery !== false ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                                                        background: item.displayToGallery !== false ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        borderRadius: 16,
                                                        '& .MuiChip-icon': {
                                                            color: item.displayToGallery !== false ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handlePreviewClick(item.mediaUrl, item.mediaType)}
                                                            sx={{ 
                                                                color: 'rgba(71, 85, 105, 0.8)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(15, 23, 42, 0.08)'
                                                                }
                                                            }}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleDeleteClick(item)}
                                                            sx={{ 
                                                                color: '#ef4444',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(239, 68, 68, 0.08)'
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
                    )}
                </CardContentWrapper>
            </ModernCard>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 16,
                    }
                }}
            >
                <DialogTitle sx={{ color: 'rgba(15, 23, 42, 0.95)' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                        Are you sure you want to delete this gallery item? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog
                open={previewDialog.open}
                onClose={() => setPreviewDialog({ open: false, url: '', type: '' })}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 16,
                    }
                }}
            >
                <DialogContent>
                    {previewDialog.type === 'image' ? (
                        <img 
                            src={previewDialog.url} 
                            alt="Preview" 
                            style={{ width: '100%', borderRadius: 12 }} 
                        />
                    ) : (
                        <video 
                            src={previewDialog.url} 
                            controls 
                            style={{ width: '100%', borderRadius: 12 }} 
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setPreviewDialog({ open: false, url: '', type: '' })} 
                        sx={{ 
                            color: 'rgba(15, 23, 42, 0.95)',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: 'rgba(15, 23, 42, 0.08)'
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}