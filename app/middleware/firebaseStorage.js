// server/firebaseStorage.js
import {adminDb} from '@/app/utils/firebaseAdmin';
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const bucket = adminDb.storage().bucket('gs://ai-gf-9913f.appspot.com'); // Your Firebase Storage bucket

const uploadToFirebaseStorage = (buffer, fileName, type) => {
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: type,
        },
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
            console.error('Error uploading file:', error);
            reject(error);
        });

        blobStream.on('finish', () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
            resolve(publicUrl);
        });

        blobStream.end(buffer);
    });
};



module.exports = {
    upload,
    uploadToFirebaseStorage,
};
