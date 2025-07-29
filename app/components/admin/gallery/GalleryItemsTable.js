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
    Tooltip,
    TextField,
    Switch,
    FormControlLabel,
    useMediaQuery,
    useTheme,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
        height: 8,
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(15, 23, 42, 0.05)',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(15, 23, 42, 0.2)',
        borderRadius: 4,
        '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
        },
    },
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

const MobileCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(15, 23, 42, 0.08)',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        transform: 'translateY(-2px)',
    }
}));

export default function GalleryItemsTable({ items, loading, selectedGirl, onRefresh, onDelete }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [previewDialog, setPreviewDialog] = useState({ open: false, url: '', type: '' });
    const [thumbnailErrors, setThumbnailErrors] = useState({});
    
    // Edit dialog states
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        text: '',
        isPremium: false,
        displayToGallery: true
    });
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

    const handleEditClick = (item) => {
        setItemToEdit(item);
        setEditFormData({
            text: item.text || '',
            isPremium: item.isPremium || false,
            displayToGallery: item.displayToGallery !== false
        });
        setEditDialogOpen(true);
    };

    const handleEditConfirm = async () => {
        if (!itemToEdit) return;

        setEditing(true);
        try {
            const response = await fetch('/api/v2/gallery/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId: itemToEdit.id,
                    text: editFormData.text,
                    isPremium: editFormData.isPremium,
                    displayToGallery: editFormData.displayToGallery
                })
            });

            if (response.ok) {
                onRefresh();
                setEditDialogOpen(false);
                setItemToEdit(null);
            } else {
                const error = await response.json();
                console.error('Edit failed:', error);
            }
        } catch (error) {
            console.error('Edit error:', error);
        } finally {
            setEditing(false);
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
                    ) : isMobile ? (
                        // Mobile Card View
                        <Box>
                            {items.map((item) => (
                                <MobileCard key={item.id}>
                                    <Grid container spacing={2}>
                                        <Grid item size={{ xs: 4 }}>
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
                                        </Grid>
                                        <Grid item size={{ xs: 8 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Chip
                                                        icon={item.mediaType === 'image' ? <PhotoIcon /> : <VideoFileIcon />}
                                                        label={item.mediaType}
                                                        size="small"
                                                        sx={{ 
                                                            color: 'rgba(15, 23, 42, 0.9)',
                                                            borderRadius: 16
                                                        }}
                                                    />
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
                                                </Box>
                                                {item.text && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TextFieldsIcon sx={{ fontSize: 18, color: 'rgba(71, 85, 105, 0.6)' }} />
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                color: 'rgba(15, 23, 42, 0.9)',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                            title={item.text}
                                                        >
                                                            {item.text}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
                                                    <IconButton 
                                                        size="small"
                                                        onClick={() => handleEditClick(item)}
                                                        sx={{ 
                                                            color: 'rgba(71, 85, 105, 0.8)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(15, 23, 42, 0.08)'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
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
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </MobileCard>
                            ))}
                        </Box>
                    ) : (
                        // Desktop Table View
                        <StyledTableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, minWidth: 100 }}>Preview</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, minWidth: 80 }}>Type</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, minWidth: 100 }}>Status</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, minWidth: 150 }}>Text</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, minWidth: 100 }}>Visibility</TableCell>
                                        <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, minWidth: 120 }}>Actions</TableCell>
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
                                                    <Tooltip title="Edit">
                                                        <IconButton 
                                                            size="small"
                                                            onClick={() => handleEditClick(item)}
                                                            sx={{ 
                                                                color: 'rgba(71, 85, 105, 0.8)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(15, 23, 42, 0.08)'
                                                                }
                                                            }}
                                                        >
                                                            <EditIcon />
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

            {/* Edit Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 16,
                    }
                }}
            >
                <DialogTitle sx={{ color: 'rgba(15, 23, 42, 0.95)' }}>Edit Gallery Item</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                        <TextField
                            label="Text (optional)"
                            value={editFormData.text}
                            onChange={(e) => setEditFormData({ ...editFormData, text: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(15, 23, 42, 0.3)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1a1a1a',
                                    },
                                },
                                '& label.Mui-focused': {
                                    color: '#1a1a1a',
                                },
                            }}
                        />
                        
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editFormData.isPremium}
                                    onChange={(e) => setEditFormData({ ...editFormData, isPremium: e.target.checked })}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#FFD700',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 215, 0, 0.08)',
                                            },
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#FFD700',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <StarIcon sx={{ color: editFormData.isPremium ? '#FFD700' : 'rgba(71, 85, 105, 0.8)', fontSize: 20 }} />
                                    <Typography>Premium Content</Typography>
                                </Box>
                            }
                        />
                        
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editFormData.displayToGallery}
                                    onChange={(e) => setEditFormData({ ...editFormData, displayToGallery: e.target.checked })}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: 'rgba(34, 197, 94, 0.9)',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: 'rgba(34, 197, 94, 0.9)',
                                        },
                                    }}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {editFormData.displayToGallery ? 
                                        <VisibilityIcon sx={{ color: 'rgba(34, 197, 94, 0.9)', fontSize: 20 }} /> : 
                                        <VisibilityOffIcon sx={{ color: 'rgba(239, 68, 68, 0.9)', fontSize: 20 }} />
                                    }
                                    <Typography>Display in Gallery</Typography>
                                </Box>
                            }
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setEditDialogOpen(false)} 
                        sx={{ color: 'rgba(71, 85, 105, 0.8)' }}
                        disabled={editing}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEditConfirm} 
                        variant="contained"
                        disabled={editing}
                        sx={{
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                            color: '#ffffff',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)',
                            },
                            '&:disabled': {
                                background: 'rgba(0, 0, 0, 0.12)',
                            },
                        }}
                    >
                        {editing ? 'Saving...' : 'Save Changes'}
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