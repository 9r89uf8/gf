'use client';

import React from 'react';
import Image from 'next/image';
import { CameraIcon, AudioIcon } from './icons';
import styles from './Hero.module.css';

const ChatPreview = () => {
  return (
    <div className={styles.chatPreviewContainer}>
      <div className={styles.chatPreview}>
        <div className={styles.chatCard}>
          {/* Chat Header */}
          <div className={styles.chatHeader}>
            <Image 
              src="/andrea.webp" 
              alt="Andrea" 
              className={styles.chatAvatar}
              width={48}
              height={48}
              priority
              quality={90}
            />
            <div className={styles.chatUserInfo}>
              <h3 className={styles.chatUsername}>Andrea</h3>
              <div className={styles.onlineStatus}>
                <span className={styles.onlineDot}></span>
                <span>En línea ahora</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className={styles.chatMessages}>
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <p>Hola cariño 💕 ¿Cómo estás? Me encantaría conocerte mejor...</p>
            </div>
            
            <div className={`${styles.message} ${styles.userMessage}`}>
              <p>Hola Andrea! Me encanta tu perfil</p>
            </div>
            
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <p>Ay que lindo! 🥰 ¿Te gustaría ver algunas fotos exclusivas?</p>
              <div className={styles.messageIcons}>
                <CameraIcon />
                <AudioIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;