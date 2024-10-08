// MessageItem.js

import React from 'react';
import { Box, Typography, Badge, Avatar, Button, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import {
    AnimatedLikesIcon,
    BlueGradientHeartIcon,
    UserMessage,
    AssistantMessage,
    ResponseMessage,
} from './styles';

function MessageItem({
                         message,
                         index,
                         conversationHistory,
                         audios,
                         handleLike,
                         handleOpenModal,
                         girl,
                         getLastUserMessage,
                     }) {
    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/novia-virtual');
    };

    const isDifferentRole =
        index === 0 || conversationHistory[index - 1].role !== message.role;
    const isFirstAssistantMessage =
        message.role === 'assistant' && (isDifferentRole || index === 0);
    const lastUserMessage = isFirstAssistantMessage
        ? getLastUserMessage(index)
        : null;

    const hasNextTwoMessages = index + 1 < conversationHistory.length;
    const isNextMessageSameRole =
        hasNextTwoMessages &&
        message.role === conversationHistory[index + 1].role;

    const audioMessage = audios.find((audio) => audio.uid === message.uid);

    if (message.role === 'user') {
        // Render user's message
        return (
            <Box
                key={index}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    marginTop: 3,
                }}
            >
                {message.image ? (
                    <>
                        <img
                            src={message.image}
                            alt="user message"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '8px',
                                marginTop: 9,
                                cursor: 'pointer',
                            }}
                            onClick={() => handleOpenModal(message.image)} // Open modal on click
                        />
                        <Badge
                            badgeContent={
                                message.liked ? (
                                    <BlueGradientHeartIcon key={message.likeTimestamp} />
                                ) : null
                            }
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <UserMessage style={{ fontSize: 24 }}>
                                {message.content}
                            </UserMessage>
                        </Badge>
                    </>
                ) : (
                    <Badge
                        badgeContent={
                            message.liked ? (
                                <BlueGradientHeartIcon key={message.likeTimestamp} />
                            ) : null
                        }
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <UserMessage style={{ fontSize: 24 }}>
                            {message.content}
                        </UserMessage>
                    </Badge>
                )}
            </Box>
        );
    } else {
        // Determine whether to show the avatar
        const shouldDisplayAvatar =
            (index === 0 || conversationHistory[index - 1].role !== 'assistant') &&
            !(lastUserMessage && isNextMessageSameRole);

        return (
            <Box
                key={index}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                {/* Render lastUserMessage as ResponseMessage with avatar on top */}
                {lastUserMessage && isNextMessageSameRole && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginLeft: 2,
                        }}
                    >
                        {/* Assistant's Avatar */}
                        <Avatar
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                            onClick={handleProfileClick}
                            sx={{
                                backgroundImage:
                                    'linear-gradient(to right, #ff8fab, #fb6f92)',
                                width: 54,
                                height: 54,
                                marginBottom: 1,
                                marginTop: 3,
                            }}
                        />
                        <Typography
                            variant="body2"
                            gutterBottom
                            style={{ margin: '2px auto -2px 0px', color: 'white' }}
                        >
                            te respondió
                        </Typography>
                        <ResponseMessage style={{ fontSize: 24 }}>
                            {lastUserMessage.content}
                        </ResponseMessage>
                    </Box>
                )}
                {/* Assistant's message */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        margin: 1,
                        maxWidth: '300px',
                    }}
                >
                    {/* Show avatar based on shouldDisplayAvatar */}
                    {shouldDisplayAvatar && (
                        <Avatar
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                            onClick={handleProfileClick}
                            sx={{
                                backgroundImage:
                                    'linear-gradient(to right, #ff8fab, #fb6f92)',
                                width: 54,
                                height: 54,
                                marginBottom: 1,
                                marginTop: 3,
                            }}
                        />
                    )}
                    <Badge
                        badgeContent={
                            message.liked ? (
                                <AnimatedLikesIcon key={message.likeTimestamp} />
                            ) : null
                        }
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <>
                            {message.image ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        margin: 1,
                                        maxWidth: '200px',
                                    }}
                                >
                                    <img
                                        src={`https://d3sog3sqr61u3b.cloudfront.net/${message.image}`}
                                        alt="assistant message"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '300px',
                                            borderRadius: '8px',
                                            marginTop: 9,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleOpenModal(message.image)} // Open modal on click
                                    />
                                    <div onClick={(e) => {
                                        message.likeTimestamp = Date.now();
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleLike({id: message.id});
                                    }}
                                         style={{marginTop: 2, marginBottom: -5}}
                                    >
                                        <AssistantMessage style={{fontSize: 24, marginLeft: -3,}}>
                                            {message.content}
                                        </AssistantMessage>
                                    </div>
                                </Box>
                            ) : audioMessage ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        margin: 1,
                                        maxWidth: '200px',
                                    }}
                                >
                                    <audio controls>
                                        <source
                                            src={`data:audio/mpeg;base64,${audioMessage.audioData}`}
                                            type="audio/mpeg"
                                        />
                                    </audio>
                                </Box>
                            ) : (
                                <div onClick={(e) => {
                                    message.likeTimestamp = Date.now();
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleLike({id: message.id});
                                }}>
                                    <AssistantMessage style={{ fontSize: 24 }}>
                                        {message.content}
                                    </AssistantMessage>
                                </div>
                            )}
                        </>
                    </Badge>
                </Box>
                {/* Display the Buy Premium button if displayLink is true */}
                {message.displayLink && (
                    <Paper
                        elevation={4}
                        sx={{
                            margin: '0 auto',
                            padding: 2,
                            marginTop: 3,
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #495057 30%, #212529 90%)',
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 1, color: 'white' }}>
                            Puedes comprar premium aquí
                        </Typography>
                        <Button
                            variant="contained"
                            href="/premium" // Replace with your premium page URL
                            sx={{
                                marginTop: 1,
                                fontSize: 18,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                border: 0,
                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                            }}
                        >
                            Premium
                        </Button>
                    </Paper>
                )}
            </Box>
        );
    }
}

export default MessageItem;
