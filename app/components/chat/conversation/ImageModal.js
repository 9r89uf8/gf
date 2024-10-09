// ImageModal.js

import React from 'react';
import { Modal } from '@mui/material';

function ImageModal({ open, handleClose, imageSrc }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-image"
            aria-describedby="modal-image-fullscreen"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <img
                src={`https://d3sog3sqr61u3b.cloudfront.net/${imageSrc}`}
                alt="Expanded Image"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                onClick={handleClose} // Close modal when image is clicked
            />
        </Modal>
    );
}

export default ImageModal;
