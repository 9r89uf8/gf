// app/test-v2/[id]/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { checkIfCookie } from '@/app/services/authService';
import { getGirl } from '@/app/services/girlService';
import { loadConversation, sendMessage as sendMessageService, likeMessage as likeMessageService, clearMessages as clearMessagesService } from '@/app/services/chatService';
import { Box, Container, Typography, CircularProgress, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Link from 'next/link';
import { db } from '@/app/utils/firebaseClient';
import { doc, onSnapshot } from 'firebase/firestore';

// Import V2 components
import ChatHeaderV2 from '@/app/components/v2/ChatHeaderV2';
import MessagesContainerV2 from '@/app/components/v2/MessagesContainerV2';
import MediaPreviewV2 from '@/app/components/v2/MediaPreviewV2';
import ChatInputV2 from '@/app/components/v2/ChatInputV2';

export default function TestV2Page({params}) {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    
    // Get user and girl data from store
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    
    // Get V2 conversation state and actions from store
    const conversationId = `${user?.uid}_${params.id}`;
    const conversation = useStore((state) => state.getConversationV2(conversationId));
    const messages = useStore((state) => state.getMessagesV2(conversationId));
    const limits = useStore((state) => state.getLimitsV2(conversationId));
    const sending = useStore((state) => state.sendingMessageV2);
    const error = useStore((state) => state.errorV2);
    
    // Get V2 store actions (only the ones we still need in the component)
    const setActiveConversationV2 = useStore((state) => state.setActiveConversationV2);
    const setConversationV2 = useStore((state) => state.setConversationV2);
    const setMessagesV2 = useStore((state) => state.setMessagesV2);
    const setLimitsV2 = useStore((state) => state.setLimitsV2);
    const setErrorV2 = useStore((state) => state.setErrorV2);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            await checkIfCookie(); // Load user data if logged in
            if (params.id) {
                await getGirl({ id: params.id }); // Load girl data from URL param
            }
            setLoading(false);
        };
        initializeData();
    }, [params.id]);

    // Auto-load conversation when user and params are ready
    useEffect(() => {
        if (user && params.id && !loading) {
            const conversationId = `${user.uid}_${params.id}`;
            setActiveConversationV2(conversationId);
            loadConversationData(user.uid, params.id);
        }
    }, [user, params.id, loading, setActiveConversationV2]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Add snapshot listener for real-time updates
    useEffect(() => {
        if (!user || !params.id) return;

        const conversationId = `${user.uid}_${params.id}`;
        const conversationRef = doc(db, 'conversations', conversationId);

        const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                
                // Update messages in store
                setMessagesV2(conversationId, data.messages || []);
                
                // Update limits in store
                if (data.freeAudio !== undefined || data.freeImages !== undefined || data.freeMessages !== undefined) {
                    setLimitsV2(conversationId, {
                        freeAudio: data.freeAudio || 0,
                        freeImages: data.freeImages || 0,
                        freeMessages: data.freeMessages || 0
                    });
                }

                // Update conversation in store
                setConversationV2(conversationId, data);
            }
        }, (error) => {
            console.error('Error listening to conversation:', error);
            setErrorV2('Failed to sync conversation');
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, [user, params.id, setMessagesV2, setLimitsV2, setConversationV2, setErrorV2]);

    const loadConversationData = async (userId, girlId) => {
        try {
            await loadConversation(userId, girlId);
        } catch (err) {
            console.error('Error loading conversation:', err);
        }
    };

    const sendMessage = async () => {
        if ((!message.trim() && !selectedMedia) || !user || !params.id) return;
        
        try {
            // Prepare clean user data
            const cleanUserData = {
                uid: user.uid,
                country: user.country,
                email: user.email,
                expired: user.expired,
                expirationDate: user.expirationDate,
                profilePic: user.profilePic,
                profilePicDescription: user.profilePicDescription,
                premium: user.premium,
                name: user.name
            };

            // Prepare clean girl data
            const cleanGirlData = {
                id: girl.id,
                username: girl.username,
                name: girl.name,
                fullName: girl.fullName,
                birthDate: girl.birthDate,
                instagram: girl.instagram,
                brothers: girl.brothers,
                mom: girl.mom,
                dad: girl.dad,
                sexActivity: girl.sexActivity,
                sexHistory: girl.sexHistory,
                sexStory: girl.sexStory,
                country: girl.country,
                bio: girl.bio,
                age: girl.age,
                videosEnabled: girl.videosEnabled,
                audioEnabled: girl.audioEnabled,
                imagesEnabled: girl.imagesEnabled,
                audioId: girl.audioId,
                isActive: girl.isActive,
                private: girl.private,
                isPrivate: girl.private || girl.isPrivate,
                priority: girl.priority,
                audioFiles: girl.audioFiles,
                premium: girl.premium,
                followersCount: girl.followersCount,
                backgroundUrl: girl.backgroundUrl,
                pictureUrl: girl.pictureUrl,
                isSleeping: girl.isSleeping
            };

            await sendMessageService({
                userId: user.uid,
                girlId: params.id,
                message,
                selectedMedia,
                userData: cleanUserData,
                girlData: cleanGirlData,
                limits: {
                    freeAudio: limits.freeAudio || 0,
                    freeImages: limits.freeImages || 0,
                    freeMessages: limits.freeMessages || 0
                }
            });
            
            // Clear inputs
            setMessage('');
            setSelectedMedia(null);
            setMediaPreview(null);

        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const likeMessage = async (messageId) => {
        if (!user || !params.id) return;
        
        try {
            await likeMessageService({
                userId: user.uid,
                girlId: params.id,
                messageId
            });
        } catch (err) {
            console.error('Error liking message:', err);
        }
    };

    const handleMediaSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const type = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 
                        file.type.startsWith('audio/') ? 'audio' : null;
            
            if (type) {
                setSelectedMedia({ file, type });
                
                // Clear text message when media is selected
                setMessage('');
                
                // Create preview for images and videos
                if (type === 'image' || type === 'video') {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setMediaPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    setMediaPreview(null);
                }
            }
        }
    };

    const clearMedia = () => {
        setSelectedMedia(null);
        setMediaPreview(null);
    };

    const clearMessages = async () => {
        if (!user || !params.id) return;
        
        try {
            await clearMessagesService({
                userId: user.uid,
                girlId: params.id
            });
            
            // The snapshot listener will automatically update the UI
            // when the messages are cleared from the database
            
        } catch (err) {
            console.error('Error clearing messages:', err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', p: 0 }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    minHeight: '100vh',
                    bgcolor: '#fff'
                }}
            >
                <ChatHeaderV2 
                    girl={girl} 
                    limits={limits} 
                    user={user} 
                    messages={messages}
                    onClearMessages={clearMessages}
                />

                {!user ? (
                    <Box 
                        flex={1} 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        flexDirection="column"
                    >
                        <Typography variant="h6" gutterBottom>
                            Please log in to chat
                        </Typography>
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <Box
                                sx={{
                                    mt: 2,
                                    px: 3,
                                    py: 1,
                                    bgcolor: '#0095f6',
                                    color: 'white',
                                    borderRadius: 1,
                                    '&:hover': { bgcolor: '#0084e1' }
                                }}
                            >
                                Go to Login
                            </Box>
                        </Link>
                    </Box>
                ) : (
                    <>
                        <MessagesContainerV2
                            messages={messages}
                            user={user}
                            girl={girl}
                            onLikeMessage={likeMessage}
                            messagesEndRef={messagesEndRef}
                        />
                        {error && (
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: '#fafafa',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    color="error"
                                    sx={{ textAlign: 'center' }}
                                >
                                    {error}
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                    {/* Premium Button */}
                                    <Link href="/products" style={{ textDecoration: 'none' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'rgba(0,0,0,0.6)',
                                                    mb: 0.5
                                                }}
                                            >
                                                Comprar
                                            </Typography>
                                            <Box
                                                sx={{
                                                    background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E53 30%, #FE6B8B 60%, #FF8E53 90%)',
                                                    borderRadius: '20px',
                                                    padding: '8px 24px',
                                                    display: 'inline-block',
                                                    boxShadow: '0 3px 10px 2px rgba(255, 105, 135, .3)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 5px 15px 3px rgba(255, 105, 135, .4)',
                                                        background: 'linear-gradient(45deg, #FF8E53 0%, #FE6B8B 30%, #FF6B6B 60%, #FE6B8B 90%)',
                                                    }
                                                }}
                                            >
                                                <Typography
                                                    variant="button"
                                                    sx={{
                                                        color: '#fff',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem',
                                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                                    }}
                                                >
                                                    ✨ Premium
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Link>

                                    {/* Different Girl Button */}
                                    <Link href="/chicas-ia" style={{ textDecoration: 'none' }}>
                                        <Box
                                            sx={{
                                                background: '#ffffff',
                                                border: '2px solid #e0e0e0',
                                                borderRadius: '20px',
                                                padding: '8px 24px',
                                                display: 'inline-block',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    borderColor: '#d0d0d0',
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, .1)',
                                                }
                                            }}
                                        >
                                            <Typography
                                                variant="button"
                                                sx={{
                                                    color: '#666',
                                                    fontWeight: 'medium',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                💬 Hablar con otra chica
                                            </Typography>
                                        </Box>
                                    </Link>
                                </Box>
                            </Box>
                        )}

                        <MediaPreviewV2
                            selectedMedia={selectedMedia}
                            mediaPreview={mediaPreview}
                            onClear={clearMedia}
                        />

                        <ChatInputV2
                            message={message}
                            setMessage={setMessage}
                            onSendMessage={sendMessage}
                            onMediaSelect={handleMediaSelect}
                            selectedMedia={selectedMedia}
                            sending={sending}
                            error={error}
                            fileInputRef={fileInputRef}
                        />
                    </>
                )}
            </Box>
        </Container>
    );
}