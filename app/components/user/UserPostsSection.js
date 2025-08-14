'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardMedia,
    Grid,
    CardContent,
    CardActions,
    Avatar,
    AvatarGroup,
    Button,
    CircularProgress,
    Fab,
    Alert,
    Collapse,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { ModernCard } from '@/app/components/ui/ModernCard';

// Lazy load PostUploadModal
const PostUploadModal = dynamic(() => import('./PostUploadModal'), {
    ssr: false
});

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: '#ffffff',
    '&:hover': {
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    }
}));

const PostCard = styled(ModernCard)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
}));

const formatRelativeTime = (timestamp) => {
    // Handle Firestore Timestamp object
    const date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    return `hace ${Math.floor(diffInSeconds / 604800)} semanas`;
};

const UserPostsSection = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [deletingPost, setDeletingPost] = useState(null);
    const [expandedComments, setExpandedComments] = useState({});
    const [displayCount, setDisplayCount] = useState(6); // Initial load limit
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/v2/user-posts/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            setPosts(data.posts || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = async (postId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            return;
        }

        setDeletingPost(postId);
        try {
            const response = await fetch(`/api/v2/user-posts/delete?postId=${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            setError('Error al eliminar la publicación');
        } finally {
            setDeletingPost(null);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
        setOpenUploadModal(false);
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress sx={{ color: '#1a1a1a' }} />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        mb: 3, 
                        fontWeight: 700,
                        color: 'rgba(15, 23, 42, 0.95)'
                    }}
                >
                    Mis Publicaciones
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {posts.length === 0 ? (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            color: 'rgba(71, 85, 105, 0.8)'
                        }}
                    >
                        <AddPhotoAlternateIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6">
                            No tienes publicaciones aún
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            ¡Comparte tu primera foto!
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Grid container spacing={3}>
                        {posts.slice(0, displayCount).map((post) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                                <PostCard variant="flat" animate={false}>
                                    <Box sx={{ position: 'relative', height: 300 }}>
                                        <Image
                                            src={post.imageUrl}
                                            alt="User post"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            loading="lazy"
                                            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                        />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {post.text && (
                                            <Typography variant="body2" color="text.secondary">
                                                {post.text}
                                            </Typography>
                                        )}
                                        {post.createdAt && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: 'rgba(71, 85, 105, 0.6)',
                                                    display: 'block',
                                                    mt: 1
                                                }}
                                            >
                                                {formatRelativeTime(post.createdAt)}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FavoriteIcon sx={{ color: '#8992ff', fontSize: 20 }} />
                                                <Typography variant="body2">
                                                    {post.likes.length}
                                                </Typography>
                                                {post.likes.length > 0 && (
                                                    <AvatarGroup max={3} sx={{ ml: 1 }}>
                                                        {post.likes.map((like, index) => (
                                                            <Link key={index} href={`/${like.girlId}`} passHref style={{ textDecoration: 'none' }}>
                                                                <Avatar
                                                                    src={like.profilePic}
                                                                    sx={{ width: 24, height: 24 }}
                                                                />
                                                            </Link>
                                                        ))}
                                                    </AvatarGroup>
                                                )}
                                            </Box>
                                            
                                            <IconButton
                                                onClick={() => toggleComments(post.id)}
                                                sx={{ 
                                                    color: '#64748b',
                                                    padding: '4px',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(100, 116, 139, 0.08)'
                                                    }
                                                }}
                                            >
                                                <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />
                                                <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                    {post.comments?.length || 0}
                                                </Typography>
                                            </IconButton>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleDeletePost(post.id)}
                                            disabled={deletingPost === post.id}
                                            sx={{ color: '#ef4444' }}
                                        >
                                            {deletingPost === post.id ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <DeleteIcon />
                                            )}
                                        </IconButton>
                                    </CardActions>
                                    
                                    <Collapse in={expandedComments[post.id]} timeout="auto" unmountOnExit>
                                        <Divider />
                                        <Box sx={{ 
                                            bgcolor: 'rgba(248, 250, 252, 0.5)',
                                            maxHeight: 300,
                                            overflowY: 'auto'
                                        }}>
                                            {post.comments && post.comments.length > 0 ? (
                                                <List sx={{ py: 0 }}>
                                                    {post.comments.map((comment, index) => (
                                                        <React.Fragment key={index}>
                                                            <ListItem alignItems="flex-start" sx={{ px: 2, py: 1 }}>
                                                                <ListItemAvatar>
                                                                    <Link href={`/${comment.girlId}`} passHref style={{ textDecoration: 'none' }}>
                                                                        <Avatar
                                                                            src={comment.profilePic}
                                                                            sx={{ width: 32, height: 32 }}
                                                                        />
                                                                    </Link>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                                {comment.name}
                                                                            </Typography>
                                                                            <Typography 
                                                                                variant="caption" 
                                                                                sx={{ color: 'rgba(71, 85, 105, 0.6)' }}
                                                                            >
                                                                                {formatRelativeTime(comment.createdAt)}
                                                                            </Typography>
                                                                        </Box>
                                                                    }
                                                                    secondary={
                                                                        <Typography 
                                                                            variant="body2" 
                                                                            sx={{ 
                                                                                color: 'rgba(15, 23, 42, 0.85)',
                                                                                mt: 0.5
                                                                            }}
                                                                        >
                                                                            {comment.comment}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </ListItem>
                                                            {index < post.comments.length - 1 && (
                                                                <Divider variant="inset" component="li" />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
                                                        No hay comentarios aún
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Collapse>
                                </PostCard>
                            </Grid>
                        ))}
                    </Grid>
                    
                    {posts.length > displayCount && (
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                onClick={() => {
                                    setLoadingMore(true);
                                    setTimeout(() => {
                                        setDisplayCount(prev => prev + 6);
                                        setLoadingMore(false);
                                    }, 300);
                                }}
                                disabled={loadingMore}
                                sx={{
                                    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                    color: '#ffffff',
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                                    },
                                }}
                            >
                                {loadingMore ? (
                                    <CircularProgress size={20} sx={{ color: 'white' }} />
                                ) : (
                                    'Cargar más'
                                )}
                            </Button>
                        </Box>
                    )}
                    </>
                )}
            </Box>

            <StyledFab
                onClick={() => setOpenUploadModal(true)}
                aria-label="add post"
            >
                <AddPhotoAlternateIcon />
            </StyledFab>

            {openUploadModal && (
                <PostUploadModal
                    open={openUploadModal}
                    onClose={() => setOpenUploadModal(false)}
                    onPostCreated={handlePostCreated}
                />
            )}
        </>
    );
};

export default UserPostsSection;