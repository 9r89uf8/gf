'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkIcon from '@mui/icons-material/Link';
import { useState } from 'react';

const ShareButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(241, 245, 249, 0.8)',
  color: 'rgba(51, 65, 85, 0.9)',
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
}));

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Box>
      <Tooltip title="Compartir en Twitter">
        <ShareButton onClick={() => handleShare('twitter')} aria-label="share on twitter">
          <TwitterIcon />
        </ShareButton>
      </Tooltip>
      
      <Tooltip title="Compartir en Facebook">
        <ShareButton onClick={() => handleShare('facebook')} aria-label="share on facebook">
          <FacebookIcon />
        </ShareButton>
      </Tooltip>
      
      <Tooltip title="Compartir en LinkedIn">
        <ShareButton onClick={() => handleShare('linkedin')} aria-label="share on linkedin">
          <LinkedInIcon />
        </ShareButton>
      </Tooltip>
      
      <Tooltip title="Compartir en WhatsApp">
        <ShareButton onClick={() => handleShare('whatsapp')} aria-label="share on whatsapp">
          <WhatsAppIcon />
        </ShareButton>
      </Tooltip>
      
      <Tooltip title={copied ? 'Copiado!' : 'Copiar enlace'}>
        <ShareButton onClick={handleCopyLink} aria-label="copy link">
          <LinkIcon />
        </ShareButton>
      </Tooltip>
    </Box>
  );
}