// app/components/v2/ChatHeaderV2.js
import React, { useState } from 'react';
import { Box, Typography, Avatar, Paper, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import Link from 'next/link';

const ChatHeaderV2 = ({ girl, limits, user, onClearMessages, messages }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [clearing, setClearing] = useState(false);
    
    // Total message limit - can be easily changed later
    const totalMessageLimit = 20;
    
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleClearClick = () => {
        setAnchorEl(null);
        setClearDialogOpen(true);
    };
    
    const handleClearCancel = () => {
        setClearDialogOpen(false);
    };
    
    const handleClearConfirm = async () => {
        setClearing(true);
        await onClearMessages();
        setClearing(false);
        setClearDialogOpen(false);
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 1.5, 
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                minHeight: '60px'
            }}
        >
            {girl && (
                <Link href={`/${girl.id}`} passHref>
                    <Avatar
                        src={girl.picture ? 
                            `https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down` : 
                            girl.profileImage
                        }
                        sx={{ 
                            width: 40, 
                            height: 40,
                            cursor: 'pointer',
                            backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)'
                        }}
                    />
                </Link>
            )}
            <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                    {girl ? girl.name : 'Cargando...'}
                </Typography>
                {girl && girl.isActive && (
                    <Typography variant="caption" color="text.secondary">
                        Activa ahora
                    </Typography>
                )}
            </Box>
            
            {/* Circular progress ring for message limits */}
            {limits && user && !user.premium && (
                <Box 
                    sx={{ 
                        position: 'relative',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Background circle */}
                    <svg 
                        width="32" 
                        height="32" 
                        style={{ 
                            position: 'absolute',
                            transform: 'rotate(-90deg)'
                        }}
                    >
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="#e0e0e0"
                            strokeWidth="3"
                        />
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="#0095f6"
                            strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 14 * ((limits.freeMessages || 0) / totalMessageLimit)} ${2 * Math.PI * 14}`}
                            strokeLinecap="round"
                            style={{
                                transition: 'stroke-dasharray 0.3s ease'
                            }}
                        />
                    </svg>
                    {/* Center number */}
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            fontSize: '11px',
                            fontWeight: 600,
                            color: limits.freeMessages > 3 ? '#0095f6' : '#ff3040',
                            zIndex: 1
                        }}
                    >
                        {limits.freeMessages || 0}
                    </Typography>
                </Box>
            )}
            
            {/* Menu Button */}
            {messages && messages.length > 0 && (
                <IconButton
                    onClick={handleMenuClick}
                    sx={{ p: 1 }}
                >
                    <MoreVert />
                </IconButton>
            )}
            
            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleClearClick}>
                    Borrar mensajes
                </MenuItem>
            </Menu>
            
            {/* Confirmation Dialog */}
            <Dialog
                open={clearDialogOpen}
                onClose={handleClearCancel}
                aria-labelledby="clear-dialog-title"
                aria-describedby="clear-dialog-description"
            >
                <DialogTitle id="clear-dialog-title">
                    ¿Borrar todos los mensajes?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="clear-dialog-description">
                        Esto eliminará permanentemente todos los mensajes de esta conversación.
                        Tus cuotas de mensajes no se restablecerán. Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClearCancel} color="primary">
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleClearConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={clearing}
                    >
                        {clearing ? 'Borrando...' : 'Borrar mensajes'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ChatHeaderV2;