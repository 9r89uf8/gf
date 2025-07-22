'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box, 
    Container, 
    Typography, 
    CircularProgress, 
    IconButton,
    Avatar,
    Chip,
    Paper,
    Divider,
    Button,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import ImageIcon from '@mui/icons-material/Image';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5),
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: '#ffffff',
    borderRadius: '16px 16px 0 0',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing(3),
        padding: theme.spacing(2.5),
    },
}));

const MessageContainer = styled(Box)(({ theme }) => ({
    maxHeight: '60vh',
    overflowY: 'auto',
    padding: theme.spacing(2),
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
        '&:hover': {
            background: '#555',
        },
    },
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: theme.spacing(2),
}));

const BubbleContent = styled(Paper)(({ theme, isUser }) => ({
    maxWidth: '70%',
    padding: theme.spacing(1.5, 2),
    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    background: isUser 
        ? 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)' 
        : '#f0f0f0',
    color: isUser ? '#ffffff' : 'rgba(15, 23, 42, 0.95)',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
}));

const MediaBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    borderRadius: '12px',
    overflow: 'hidden',
    '& img': {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
    },
}));

const InfoChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    background: 'rgba(0, 0, 0, 0.05)',
}));

export default function AdminConversationsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/v2/admin/conversations/recent', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(response.status === 403 ? 'Admin access required' : 'Failed to fetch conversations');
            }

            const data = await response.json();
            setConversations(data.conversations);
            setCurrentIndex(0);
        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(conversations.length - 1, prev + 1));
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button variant="contained" onClick={() => router.push('/admin')}>
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    if (conversations.length === 0) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="info">No conversations found</Alert>
                <Button variant="contained" onClick={() => router.push('/admin')} sx={{ mt: 2 }}>
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    const currentConversation = conversations[currentIndex];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                py: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => router.push('/admin')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'rgba(15, 23, 42, 0.95)',
                            fontWeight: 700,
                        }}
                    >
                        Admin Conversation Viewer
                    </Typography>
                </Box>

                <ModernCard variant="elevated" animate={false}>
                    {/* Conversation Header */}
                    <HeaderBox>
                        {/* Navigation Controls - Mobile First */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            order: { xs: 1, md: 2 },
                            width: { xs: '100%', md: 'auto' },
                            justifyContent: { xs: 'center', md: 'flex-end' }
                        }}>
                            <Typography variant="body2">
                                {currentIndex + 1} / {conversations.length}
                            </Typography>
                            <IconButton 
                                onClick={handlePrevious} 
                                disabled={currentIndex === 0}
                                sx={{ color: '#ffffff' }}
                            >
                                <NavigateBeforeIcon />
                            </IconButton>
                            <IconButton 
                                onClick={handleNext} 
                                disabled={currentIndex === conversations.length - 1}
                                sx={{ color: '#ffffff' }}
                            >
                                <NavigateNextIcon />
                            </IconButton>
                        </Box>
                        
                        {/* User and Girl Info */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: { xs: 1.5, sm: 2 },
                            order: { xs: 2, md: 1 },
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            width: { xs: '100%', md: 'auto' }
                        }}>
                            <Avatar 
                                src={currentConversation.user?.profilePic} 
                                alt={currentConversation.user?.name}
                                sx={{ 
                                    width: { xs: 32, sm: 40, md: 48 }, 
                                    height: { xs: 32, sm: 40, md: 48 } 
                                }}
                            >
                                <PersonIcon />
                            </Avatar>
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                                    }}
                                >
                                    {currentConversation.user?.name || 'Unknown User'}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        opacity: 0.8,
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    {currentConversation.user?.email}
                                </Typography>
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mx: { xs: 1, sm: 2 },
                                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                                }}
                            >
                                →
                            </Typography>
                            <Avatar 
                                src={currentConversation.girl?.pictureUrl} 
                                alt={currentConversation.girl?.name}
                                sx={{ 
                                    width: { xs: 32, sm: 40, md: 48 }, 
                                    height: { xs: 32, sm: 40, md: 48 } 
                                }}
                            >
                                <SmartToyIcon />
                            </Avatar>
                            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                                    }}
                                >
                                    {currentConversation.girl?.name || 'Unknown Girl'}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        opacity: 0.8,
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
                                    @{currentConversation.girl?.username}
                                </Typography>
                            </Box>
                        </Box>
                    </HeaderBox>

                    <CardContentWrapper>
                        {/* Conversation Info */}
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <InfoChip 
                                label={`${currentConversation.messageCount} messages`} 
                                size="small" 
                            />
                            <InfoChip 
                                label={`Last: ${formatTimestamp(currentConversation.lastActivity)}`} 
                                size="small" 
                            />
                            {currentConversation.user?.premium && (
                                <InfoChip 
                                    label="Premium User" 
                                    size="small" 
                                    color="primary"
                                />
                            )}
                            <InfoChip 
                                label={`Free Messages: ${currentConversation.limits.freeMessages}`} 
                                size="small" 
                            />
                            {currentConversation.girl?.audioEnabled && (
                                <InfoChip 
                                    label={`Free Audio: ${currentConversation.limits.freeAudio}`} 
                                    size="small" 
                                    icon={<AudiotrackIcon sx={{ fontSize: 16 }} />}
                                />
                            )}
                            {currentConversation.girl?.imagesEnabled && (
                                <InfoChip 
                                    label={`Free Images: ${currentConversation.limits.freeImages}`} 
                                    size="small" 
                                    icon={<ImageIcon sx={{ fontSize: 16 }} />}
                                />
                            )}
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Messages */}
                        <MessageContainer>
                            {currentConversation.messages.map((message, index) => (
                                <MessageBubble key={message.id || index} isUser={message.role === 'user'}>
                                    <Box sx={{ maxWidth: '70%' }}>
                                        <BubbleContent isUser={message.role === 'user'} elevation={1}>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {message.content}
                                            </Typography>
                                            
                                            {message.mediaUrl && message.mediaType === 'image' && (
                                                <MediaBox>
                                                    <img src={message.mediaUrl} alt="Message media" />
                                                </MediaBox>
                                            )}
                                            
                                            {message.mediaUrl && message.mediaType === 'audio' && (
                                                <Box sx={{ mt: 1 }}>
                                                    <audio controls style={{ width: '100%', maxWidth: '300px' }}>
                                                        <source src={message.mediaUrl} type="audio/mpeg" />
                                                    </audio>
                                                </Box>
                                            )}
                                            
                                            <Box sx={{ 
                                                mt: 1, 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                gap: 1
                                            }}>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        opacity: 0.7,
                                                        color: message.role === 'user' ? '#ffffff' : 'inherit'
                                                    }}
                                                >
                                                    {formatTimestamp(message.timestamp)}
                                                </Typography>
                                                
                                                {message.liked && (
                                                    <FavoriteIcon 
                                                        sx={{ 
                                                            fontSize: 16, 
                                                            color: message.role === 'user' ? '#ffffff' : '#e91e63'
                                                        }} 
                                                    />
                                                )}
                                            </Box>
                                        </BubbleContent>
                                    </Box>
                                </MessageBubble>
                            ))}
                        </MessageContainer>
                    </CardContentWrapper>
                </ModernCard>
            </Container>
        </Box>
    );
}