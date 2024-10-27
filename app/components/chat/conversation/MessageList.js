// MessageList.js

import React from 'react';
import MessageItem from './MessageItem';

function MessageList({ conversationHistory, handleLike, handleOpenModal, girl, getLastUserMessage }) {
    return (
        <>
            {conversationHistory &&
                conversationHistory
                    .filter((message) => ['user', 'assistant'].includes(message.role))
                    .map((message, index) => (
                        <MessageItem
                            key={index}
                            message={message}
                            index={index}
                            conversationHistory={conversationHistory}
                            handleLike={handleLike}
                            handleOpenModal={handleOpenModal}
                            girl={girl}
                            getLastUserMessage={getLastUserMessage}
                        />
                    ))
            }
        </>
    );
}

export default MessageList;
