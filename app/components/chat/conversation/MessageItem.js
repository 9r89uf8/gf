import React, { useRef, useEffect } from 'react';
import { Box, Avatar, Badge, styled, Typography, Button, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import HeartIcon from "@/app/components/chat/conversation/HeartIcon";
import { useStore } from '@/app/store/store';

// Existing styled components remain the same...
const MessageBubble = styled(Box)(({ theme, isUser }) => ({
    maxWidth: 300,
    padding: theme.spacing(2),
    borderRadius: 16,
    fontSize: 22,
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    position: 'relative',
    // Add these properties to prevent text selection
    WebkitUserSelect: 'none',  // Safari
    MozUserSelect: 'none',     // Firefox
    msUserSelect: 'none',      // IE/Edge
    userSelect: 'none',        // Standard syntax
    WebkitTouchCallout: 'none', // Disable iOS callout
}));

const PremiumMessage = styled(Paper)(({ theme }) => ({
    margin: '16px auto',
    padding: theme.spacing(2),
    textAlign: 'center',
    background: 'linear-gradient(45deg, #495057 30%, #212529 90%)',
    color: 'white',
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '4px',
    padding: '8px 16px',
    borderRadius: 16,
    backgroundColor: theme.palette.grey[100],
    width: 'fit-content',
    marginTop: theme.spacing(1),
}));

const TypingDot = styled(Box)(({ delay }) => ({
    width: '8px',
    height: '8px',
    backgroundColor: '#6c757d',
    borderRadius: '50%',
    animation: 'typingAnimation 1.4s infinite',
    animationDelay: delay,
    '@keyframes typingAnimation': {
        '0%, 100%': {
            transform: 'translateY(0px)',
        },
        '50%': {
            transform: 'translateY(-4px)',
        },
    },
}));

const MediaContent = styled(Box)({
    '& img, & video, & audio': {
        maxWidth: '100%',
        maxHeight: 300,
        borderRadius: 8,
        cursor: 'pointer',
        objectFit: 'cover',
        marginBottom: 8,
    },
});

const MessageFooter = styled(Box)({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
    '& svg': {
        fontSize: 23,
    },
});

const TimeStamp = styled(Typography)(({ theme, isUser }) => ({
    fontSize: '0.75rem',
    color: isUser ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
}));

const StatusIndicator = ({ sent, seen }) => {
    if (seen) {
        return <DoneAllIcon sx={{ color: 'white', fontSize: 20 }} />;
    }
    if (sent) {
        return <CheckIcon sx={{ color: 'white', fontSize: 20 }} />;
    }
    return null;
};

const MessageContent = ({ content, image, video, audioData, onClick, mediaType }) => (
    <Box>
        <MediaContent>
            {audioData ? (
                <audio controls>
                    <source src={`data:audio/mpeg;base64,${audioData}`} type="audio/mpeg" />
                </audio>
            ) : (
                <>
                    {image && mediaType==='image' && (
                        <img
                            src={image}
                            alt="message attachment"
                            onClick={() => onClick(image)}
                        />
                    )}
                    {image && mediaType==='audio' && (
                        <audio controls>
                            <source src={image} type="audio/mpeg"/>
                        </audio>
                    )}
                    {video && mediaType === 'video' && (
                        <video
                            src={video}
                            controls
                            onClick={() => onClick(video)}
                        />
                    )}
                    {content&&mediaType!=='audio' && (<Box>{content}</Box>)}
                </>
            )}
        </MediaContent>
    </Box>
);

const MessageItem = ({
                         message,
                         index,
                         conversationHistory,
                         handleOpenModal,
                         handleLike,
                         girl,
                     }) => {
    const isUser = message.role === 'user';
    const showAvatar = index === 0 ||
        conversationHistory[index - 1]?.role !== message.role;
    const user = useStore((state) => state.user);

    function convertFirestoreTimestampToDate(timestamp) {
        if (!timestamp) return null;
        if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
            return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
        }
        if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
            return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
        }
        return new Date(timestamp);
    }

    const isLastSeenUserMessage = () => {
        if (!isUser || !message.seen) return false;

        // Get all messages after this one
        const laterMessages = conversationHistory.slice(index + 1);

        // Check if there are any seen user messages after this one
        const hasSeenUserMessagesAfter = laterMessages.some(
            msg => msg.role === 'user' && msg.seen
        );

        return !hasSeenUserMessagesAfter;
    };

    const formattedTime = (timestamp) => {
        const date = convertFirestoreTimestampToDate(timestamp);
        if (!date) return '';

        if (isToday(date)) {
            return format(date, 'h:mm a', { locale: es })
                .replace('AM', 'am')
                .replace('PM', 'pm');
        } else {
            return format(date, 'd MMM h:mm a', { locale: es })
                .replace('.', '')
                .replace('AM', 'am')
                .replace('PM', 'pm');
        }
    };

    const shouldShowTypingIndicator = isLastSeenUserMessage() && girl.girlIsTyping;

    return (
        <Box sx={{ mb: shouldShowTypingIndicator ? 0 : 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    mt: 3,
                    mx: 2,
                }}
            >
                {!isUser && showAvatar && (
                    <Avatar
                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                        sx={{
                            width: 48,
                            height: 48,
                            mb: 1,
                            cursor: 'pointer',
                            backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)',
                        }}
                    />
                )}

                <Badge
                    badgeContent={message.liked ? <HeartIcon/> : null}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: isUser ? 'right' : 'left',
                    }}
                >
                    <Box>
                        <MessageBubble
                            isUser={isUser}
                            onClick={() => !isUser && handleLike({ id: message.id })}
                        >
                            <MessageContent
                                content={!message.audioData ? message.content : null}
                                image={isUser && message.image ? message.image : !isUser && message.image ? `https://d3sog3sqr61u3b.cloudfront.net/${message.image}` : null}
                                video={isUser && message.image ? message.image: !isUser && message.video ? `https://d3sog3sqr61u3b.cloudfront.net/${message.video}`: null}
                                audioData={message.audioData}
                                onClick={handleOpenModal}
                                mediaType={message.mediaType?message.mediaType:null}
                            />

                            <MessageFooter>
                                <TimeStamp isUser={isUser}>
                                    {formattedTime(message.timestamp)}
                                </TimeStamp>
                                {isUser && (
                                    <StatusIndicator sent={message.sent} seen={message.seen} />
                                )}
                            </MessageFooter>
                        </MessageBubble>

                        {message.displayLink && !user.premium && (
                            <PremiumMessage elevation={4}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Puedes comprar premium aquí
                                </Typography>
                                <Button
                                    variant="contained"
                                    href="/premium"
                                    sx={{
                                        fontSize: 18,
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        border: 0,
                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                        color: 'white',
                                        padding: '8px 24px',
                                    }}
                                >
                                    Premium
                                </Button>
                            </PremiumMessage>
                        )}
                    </Box>
                </Badge>
            </Box>

            {shouldShowTypingIndicator && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 3, mx: 2 }}>
                    <Avatar
                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                        sx={{
                            width: 48,
                            height: 48,
                            mb: 1,
                            marginRight: 1,
                            backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)',
                        }}
                    />
                    <TypingIndicator>
                        <TypingDot delay="0s" />
                        <TypingDot delay="0.2s" />
                        <TypingDot delay="0.4s" />
                    </TypingIndicator>
                </Box>
            )}
        </Box>
    );
};

export default MessageItem;

