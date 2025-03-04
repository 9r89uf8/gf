// Chat.js
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getArchivedMessages } from "@/app/services/chatService";
import {
    likeMessage,
} from '@/app/services/chatService';
import {
    Box,
    CircularProgress,
    Container,
    styled,
    Button,
    Typography,
    Paper,
    Grid,
    Stack,
    IconButton
} from '@mui/material';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import MediaPreviewComponent from "@/app/components/chat/MediaPreviewComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(12),
}));

const NavigationControls = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const UserInfoCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const ChatTest = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const loadingGirl = useStore((state) => state.loadingGirl);

    const [recentUsers, setRecentUsers] = useState([]);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchArchivedUsers = async () => {
            try {
                setLoading(true);
                const response = await getArchivedMessages();

                if (response && response.recentUsers && response.recentUsers.length > 0) {
                    setRecentUsers(response.recentUsers);
                    setTotalUsers(response.count || response.recentUsers.length);

                    // Initialize with the first user
                    const firstUser = response.recentUsers[0];
                    setConversationHistory(firstUser.messages || []);
                    setUserData(firstUser.userData || null);
                } else {
                    console.error("No recent users found");
                }
            } catch (error) {
                console.error("Error fetching archived messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedUsers();
    }, []);

    // Change to the next user
    const handleNextUser = () => {
        if (currentUserIndex < recentUsers.length - 1) {
            const nextIndex = currentUserIndex + 1;
            setCurrentUserIndex(nextIndex);

            const nextUser = recentUsers[nextIndex];
            setConversationHistory(nextUser.messages || []);
            setUserData(nextUser.userData || null);
        }
    };

    // Change to the previous user
    const handlePreviousUser = () => {
        if (currentUserIndex > 0) {
            const prevIndex = currentUserIndex - 1;
            setCurrentUserIndex(prevIndex);

            const prevUser = recentUsers[prevIndex];
            setConversationHistory(prevUser.messages || []);
            setUserData(prevUser.userData || null);
        }
    };

    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    const handleClearMedia = () => {
        setMedia(null);
        setMediaPreview(null);
        setMediaType(null);
    };

    const handleLike = async ({id}) => {
        await likeMessage({ messageUid: id, girlId: girl.id});
    };

    // Format archive date
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <StyledContainer maxWidth="sm">
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : recentUsers.length === 0 ? (
                <Typography variant="h6" align="center" my={4}>
                    No recently archived users found
                </Typography>
            ) : (
                <>
                    <NavigationControls elevation={2}>
                        <IconButton
                            onClick={handlePreviousUser}
                            disabled={currentUserIndex === 0}
                        >
                            <ArrowBackIcon />
                        </IconButton>

                        <Typography variant="body1">
                            User {currentUserIndex + 1} of {totalUsers}
                        </Typography>

                        <IconButton
                            onClick={handleNextUser}
                            disabled={currentUserIndex === recentUsers.length - 1}
                        >
                            <ArrowForwardIcon />
                        </IconButton>
                    </NavigationControls>

                    {userData && (
                        <UserInfoCard elevation={1}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <PersonIcon fontSize="large" />
                                </Grid>
                                <Grid item xs>
                                    {/*<Typography variant="body1">*/}
                                    {/*    User ID: {recentUsers[currentUserIndex]?.userId || 'Unknown'}*/}
                                    {/*</Typography>*/}
                                    <Typography variant="body2">
                                        Archived At: {formatDate(userData.archivedAt)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Email: {userData.userData.email}
                                    </Typography>
                                    <Typography variant="body2">
                                        Messages: {userData.userData.freeMessages}
                                    </Typography>
                                    <Typography variant="body2">
                                        Audios: {userData.userData.freeAudio}
                                    </Typography>
                                    <Typography variant="body2">
                                        Images: {userData.userData.freeImages}
                                    </Typography>
                                    <Typography variant="body2">
                                        Premium: {userData.userData.premium?'premium':'free'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </UserInfoCard>
                    )}

                    {girl && (
                        <ConversationHistory
                            conversationHistory={conversationHistory}
                            user={user}
                            handleLike={handleLike}
                            girl={girl}
                            loading={loadingGirl}
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
        </StyledContainer>
    );
};

export default ChatTest;