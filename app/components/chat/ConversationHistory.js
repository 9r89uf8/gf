import React, { useEffect, useRef } from 'react';
import {Box, Typography, Badge, styled, Avatar} from '@mui/material';
import { useRouter } from 'next/navigation';
import LikesIcon from "@mui/icons-material/Favorite";

const UserMessage = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(to right, #343a40, #343a40)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    alignSelf: 'flex-end',
    color: '#f8f9fa',
    userSelect: 'none', // Add this line
    WebkitUserSelect: 'none', // Add this line for webkit browsers
    msUserSelect: 'none', // Add this line for IE/Edge
}));

const AssistantMessage = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(to right, #00b4d8, #0077b6)',
    color: 'black',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    userSelect: 'none', // Add this line
    WebkitUserSelect: 'none', // Add this line for webkit browsers
    msUserSelect: 'none', // Add this line for IE/Edge
    margin: theme.spacing(1),
    alignSelf: 'flex-start',
    cursor: 'pointer',
    '&:hover': {
        opacity: 0.8,
    },
}));

const ResponseMessage = styled(Typography)(({ theme }) => ({
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    color: 'black',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    marginBottom: -5,
    marginLeft: 20,
    alignSelf: 'flex-start',
    userSelect: 'none', // Add this line
    WebkitUserSelect: 'none', // Add this line for webkit browsers
    msUserSelect: 'none', // Add this line for IE/Edge
}));

function ConversationHistory({ conversationHistory, user, audios, handleLike, girl }) {
    const messagesEndRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversationHistory]);

    const getLastUserMessage = (currentIndex) => {
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (conversationHistory[i].role === 'user') {
                return conversationHistory[i];
            }
        }
        return null;
    };

    const handleProfileClick = () => {
        router.push('/novia-virtual');
    };

    return (
        <>
            {conversationHistory && conversationHistory.filter(message => ['user', 'assistant'].includes(message.role)).map((message, index) => {
                const isDifferentRole = index === 0 || conversationHistory[index - 1].role !== message.role;
                const isFirstAssistantMessage = message.role === 'assistant' && (isDifferentRole || index === 0);
                const lastUserMessage = isFirstAssistantMessage ? getLastUserMessage(index) : null;

                const hasNextTwoMessages = index + 1 < conversationHistory.length;
                const isNextMessageSameRole = hasNextTwoMessages && message.role === conversationHistory[index + 1].role;

                const audioMessage = audios.find(audio => audio.uid === message.uid);

                return message.role === 'user' ? (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 3 }}>
                        {message.image ? (
                            <img src={message.image} alt="user message" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', marginTop: 9 }} />
                        ) : (
                            <UserMessage style={{fontSize: 22}}>
                                {message.content}
                            </UserMessage>
                        )}
                    </Box>
                ) : (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {lastUserMessage && isNextMessageSameRole && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <Typography variant="body2" gutterBottom style={{margin: '2px auto -2px 20px'}}>
                                    replied to you
                                </Typography>
                                <ResponseMessage style={{fontSize: 22}}>
                                    {lastUserMessage.content}
                                </ResponseMessage>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 1, maxWidth: '200px' }}>
                            <Avatar src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                    onClick={() => handleProfileClick()}
                                    sx={{ backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)', width: 54, height: 54, marginBottom: 1, marginTop: 3 }}/>
                        <Badge
                            badgeContent={message.liked ? <LikesIcon style={{color: 'red'}}/> : null}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <div onClick={() => handleLike(message.id)}>
                                {audioMessage ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: 1, maxWidth: '200px' }}>
                                        <audio controls>
                                            <source src={`data:audio/mpeg;base64,${audioMessage.audioData}`} type="audio/mpeg" />
                                        </audio>
                                    </Box>
                                ) : (
                                    <AssistantMessage style={{fontSize: 22}}>
                                        {message.content}
                                    </AssistantMessage>
                                )}
                            </div>
                        </Badge>
                        </Box>
                    </Box>
                );
            })}
            <div ref={messagesEndRef} />
        </>
    );
}

export default ConversationHistory;