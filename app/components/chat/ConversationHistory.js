// ConversationHistory.js

import React, { useEffect, useRef, useState } from 'react';
import MessageList from "@/app/components/chat/conversation/MessageList";
import ImageModal from "@/app/components/chat/conversation/ImageModal";

function ConversationHistory({ conversationHistory, user, audios, handleLike, girl }) {
    const messagesEndRef = useRef(null);

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
            <MessageList
                conversationHistory={conversationHistory}
                audios={audios}
                handleLike={handleLike}
                handleOpenModal={handleOpenModal}
                girl={girl}
                getLastUserMessage={getLastUserMessage}
            />
            <div ref={messagesEndRef} />
            <ImageModal
                open={openModal}
                handleClose={handleCloseModal}
                imageSrc={modalImageSrc}
            />
        </>
    );
}

export default ConversationHistory;




