// Chat.js
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getMessagesTest } from "@/app/services/chatService";
import { checkIfCookie } from '@/app/services/authService';
import {
    likeMessage,
} from '@/app/services/chatService';
import { Box, CircularProgress, Container, styled, Typography, Paper, Divider, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import GirlHeader from '@/app/components/chat/GirlHeader';
import MediaPreviewComponent from "@/app/components/chat/MediaPreviewComponent";

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(12),
}));

const UserInfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
}));

const UserInfo = ({ userData }) => {
    // Format the timestamp to a readable date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';

        // Check if timestamp is a Firestore timestamp
        if (timestamp && typeof timestamp.toDate === 'function') {
            return timestamp.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // If it's already a Date or a timestamp number
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <UserInfoCard elevation={3}>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <Divider style={{ marginBottom: '10px' }} />
            <Typography><strong>User ID:</strong> {userData.id}</Typography>
            {userData.email && <Typography><strong>Email:</strong> {userData.email}</Typography>}
            {userData.displayName && <Typography><strong>Name:</strong> {userData.displayName}</Typography>}
            <Typography><strong>messages:</strong> {userData.freeMessages}</Typography>
            <Typography><strong>audio:</strong> {userData.freeAudio}</Typography>
            <Typography><strong>images:</strong> {userData.freeImages}</Typography>
            <Typography><strong>premium:</strong> {userData.premium?'premium':'free'}</Typography>
        </UserInfoCard>
    );
};

const ChatTest = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const loadingGirl = useStore((state) => state.loadingGirl);

    const [userRecords, setUserRecords] = useState([]);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                const response = await getMessagesTest({ id: 'BgHd9LWDnFFhS6BoaqwL' });

                if (response && Array.isArray(response)) {
                    setUserRecords(response);
                    setError(null);
                } else if (response && response.error) {
                    setError(response.error);
                    setUserRecords([]);
                } else {
                    setError('Unexpected response format');
                    setUserRecords([]);
                }
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError(err.message || 'Failed to fetch messages');
                setUserRecords([]);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleClearMedia = () => {
        setMedia(null);
        setMediaPreview(null);
        setMediaType(null);
    };

    const handleLike = async ({ id }) => {
        await likeMessage({ messageUid: id, girlId: girl.id });
    };

    // Navigate to next user
    const handleNextUser = () => {
        if (currentUserIndex < userRecords.length - 1) {
            setCurrentUserIndex(currentUserIndex + 1);
        }
    };

    // Navigate to previous user
    const handlePrevUser = () => {
        if (currentUserIndex > 0) {
            setCurrentUserIndex(currentUserIndex - 1);
        }
    };

    // Get current user and their messages
    const getCurrentUserData = () => {
        if (userRecords.length === 0) return null;
        return userRecords[currentUserIndex];
    };

    const currentUserData = getCurrentUserData();

    return (
        <StyledContainer maxWidth="sm">
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                    {error}
                </Alert>
            ) : userRecords.length === 0 ? (
                <Alert severity="info" sx={{ marginTop: 2 }}>
                    No users found in the last 5 days.
                </Alert>
            ) : (
                <>
                    {/* User navigation controls */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
                        <button
                            onClick={handlePrevUser}
                            disabled={currentUserIndex === 0}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentUserIndex === 0 ? '#e0e0e0' : '#1976d2',
                                color: currentUserIndex === 0 ? '#757575' : 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: currentUserIndex === 0 ? 'default' : 'pointer'
                            }}
                        >
                            Previous User
                        </button>
                        <Typography>
                            User {currentUserIndex + 1} of {userRecords.length}
                        </Typography>
                        <button
                            onClick={handleNextUser}
                            disabled={currentUserIndex === userRecords.length - 1}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: currentUserIndex === userRecords.length - 1 ? '#e0e0e0' : '#1976d2',
                                color: currentUserIndex === userRecords.length - 1 ? '#757575' : 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: currentUserIndex === userRecords.length - 1 ? 'default' : 'pointer'
                            }}
                        >
                            Next User
                        </button>
                    </Box>

                    {/* Display user info */}
                    {currentUserData && <UserInfo userData={currentUserData.userData} />}

                    {/* Display conversation */}
                    {girl && currentUserData && (
                        <>
                            {currentUserData.displayMessages.length === 0 ? (
                                <Alert severity="info">No messages found for this user.</Alert>
                            ) : (
                                <ConversationHistory
                                    conversationHistory={currentUserData.displayMessages}
                                    user={user}
                                    handleLike={handleLike}
                                    girl={girl}
                                    loading={false}
                                />
                            )}
                        </>
                    )}

                    {/* Image Preview */}
                    {mediaPreview && (
                        <MediaPreviewComponent
                            mediaPreview={mediaPreview}
                            mediaType={mediaType}
                            handleClearMedia={handleClearMedia}
                        />
                    )}
                </>
            )}
        </StyledContainer>
    );
};

export default ChatTest;