import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Badge, Avatar, Modal, Button, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import LikesIcon from "@mui/icons-material/Favorite";
import { keyframes, styled } from '@mui/material/styles';

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(3.4); }
  100% { transform: scale(1); }
`;

const AnimatedLikesIcon = styled(LikesIcon)(({ theme }) => ({
    color: 'red',
    animation: `${pop} 0.3s ease-in-out`,
}));

const BlueGradientHeartIcon = styled(LikesIcon)(({ theme }) => ({
    fontSize: 28,
    color: 'white',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${pop} 0.3s ease-in-out`,
}));


const UserMessage = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(to right, #2c3e50, #4a5568)',
    boxShadow: '0 4px 6px rgba(72, 87, 118, 0.3), 0 1px 3px rgba(0, 0, 0, 0.08)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    alignSelf: 'flex-end',
    color: '#f8f9fa',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));

const AssistantMessage = styled(Typography)(({ theme }) => ({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .2)',
    color: 'black',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
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
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));

function ConversationHistory({ conversationHistory, user, audios, handleLike, girl }) {
    const messagesEndRef = useRef(null);
    const router = useRouter();

    // State variables for modal
    const [openModal, setOpenModal] = useState(false);
    const [modalImageSrc, setModalImageSrc] = useState('');

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

    // Functions to handle modal open and close
    const handleOpenModal = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalImageSrc('');
    };

    return (
        <>
            {conversationHistory &&
                conversationHistory
                    .filter((message) => ['user', 'assistant'].includes(message.role))
                    .map((message, index) => {
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
                                            <div onClick={(e) => { message.likeTimestamp = Date.now(); e.preventDefault(); e.stopPropagation(); handleLike({id: message.id, image: message.image}); }}>
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
                                                        <AssistantMessage style={{ fontSize: 24 }}>
                                                            {message.content}
                                                        </AssistantMessage>
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
                                                    <AssistantMessage style={{ fontSize: 24 }}>
                                                        {message.content}
                                                    </AssistantMessage>
                                                )}

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
                                                            Pudes comprar premium aqui
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
                                            </div>
                                        </Badge>
                                    </Box>
                                </Box>
                            );
                        }
                    })}
            <div ref={messagesEndRef} />

            {/* Modal component for displaying the image */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-image"
                aria-describedby="modal-image-fullscreen"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <img
                    src={`https://d3sog3sqr61u3b.cloudfront.net/${modalImageSrc}`}
                    alt="Expanded Image"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    onClick={handleCloseModal} // Close modal when image is clicked
                />
            </Modal>
        </>
    );
}

export default ConversationHistory;



