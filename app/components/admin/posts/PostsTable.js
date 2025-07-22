import React, { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { Delete, Refresh, VideoCall, PlayCircleOutline, TextFields } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    border: '1px solid rgba(203, 213, 225, 0.3)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
}));

export default function PostsTable({ posts, loading, selectedGirl, onRefresh, onDelete }) {
    const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null });
    const [thumbnailErrors, setThumbnailErrors] = useState({});

    const handleDeletePost = async () => {
        if (!deleteDialog.postId) return;

        try {
            const response = await fetch(`/api/v2/posts/admin/delete?postId=${deleteDialog.postId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                onDelete();
            } else {
                const data = await response.json();
                console.error('Delete error:', data.error);
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setDeleteDialog({ open: false, postId: null });
        }
    };

    const renderMediaPreview = (post) => {
        if (post.mediaType === 'text') {
            return (
                <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: 1, 
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TextFields sx={{ color: 'rgba(15, 23, 42, 0.95)' }} />
                </Box>
            );
        }

        if (!post.mediaUrl) return null;

        if (post.mediaType === 'image') {
            return (
                <img 
                    src={post.mediaUrl} 
                    alt="" 
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
                />
            );
        }

        // Video
        if (post.uploadId && !thumbnailErrors[post.id]) {
            return (
                <Box sx={{ position: 'relative', width: 50, height: 50 }}>
                    <img 
                        src={`https://videodelivery.net/${post.uploadId}/thumbnails/thumbnail.jpg?time=1s&height=50`}
                        alt="Video thumbnail"
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                        onError={() => {
                            setThumbnailErrors(prev => ({ ...prev, [post.id]: true }));
                        }}
                    />
                    <PlayCircleOutline 
                        sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            fontSize: 24,
                            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                        }} 
                    />
                </Box>
            );
        }

        return (
            <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: 1, 
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <VideoCall sx={{ color: 'rgba(15, 23, 42, 0.95)' }} />
            </Box>
        );
    };

    const getMediaTypeColor = (mediaType) => {
        switch (mediaType) {
            case 'image': return 'primary';
            case 'video': return 'secondary';
            case 'text': return 'success';
            default: return 'default';
        }
    };

    return (
        <>
            <ModernCard variant="elevated" animate={true}>
                <CardContentWrapper>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                            Posts
                        </Typography>
                        <IconButton 
                            onClick={onRefresh} 
                            disabled={!selectedGirl || loading}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(15, 23, 42, 0.05)',
                                }
                            }}
                        >
                            <Refresh sx={{ color: 'rgba(15, 23, 42, 0.95)' }} />
                        </IconButton>
                    </Box>

                    {loading ? (
                    <LinearProgress />
                ) : posts.length > 0 ? (
                    <StyledTableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: { xs: 300, sm: 500 } }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Preview</TableCell>
                                    <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Text</TableCell>
                                    <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            {renderMediaPreview(post)}
                                        </TableCell>
                                        <TableCell sx={{ color: 'rgba(51, 65, 85, 0.9)' }}>
                                            {post.text.substring(0, 50)}...
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={post.mediaType} 
                                                size="small" 
                                                color={getMediaTypeColor(post.mediaType)} 
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {post.mediaType === 'text' ? (
                                                <Chip
                                                    label="Published"
                                                    size="small"
                                                    color="info"
                                                />
                                            ) : (
                                                <Chip
                                                    label={post.cloudflareUploadPending ? 'Uploading' : 'Uploaded'}
                                                    size="small"
                                                    color={post.cloudflareUploadPending ? 'warning' : 'success'}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => setDeleteDialog({ open: true, postId: post.id })}
                                                sx={{ color: '#ef4444' }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                ) : (
                    <Typography sx={{ color: 'rgba(71, 85, 105, 0.8)', textAlign: 'center' }}>
                        {selectedGirl ? 'No posts yet' : 'Select a girl to view posts'}
                    </Typography>
                )}
                </CardContentWrapper>
            </ModernCard>

            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, postId: null })}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this post?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, postId: null })}>Cancel</Button>
                    <Button onClick={handleDeletePost} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}