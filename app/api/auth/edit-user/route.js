// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { uploadToFirebaseStorage } from "@/app/middleware/firebaseStorage";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
        await authMiddleware(req);
        const id = req.user.uid;
        const formData = await req.formData();
        const email = formData.get('email');
        const name = formData.get('name');
        const file = formData.get('image');

        // Update the user's email in Firebase Authentication
        await adminAuth.updateUser(id, { email });

        // Prepare the update data
        const updatedData = {
            email,
            name
        };

        // Handle file upload if a new image is provided
        if (file) {
            const fileExtension = file.type.split('/')[1];
            const filePath = `users-profile/${uuidv4()}.${fileExtension}`;

            // Convert the file to a buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const fileUrl = await uploadToFirebaseStorage(buffer, filePath, file.mimetype);

            // Only add profilePic to updatedData if a new image was uploaded
            updatedData.profilePic = fileUrl;
        }

        // Update the user's information in Firestore
        const userRef = adminDb.firestore().collection('users').doc(id);
        await userRef.update(updatedData);

        // Retrieve the updated user data from Firestore
        const updatedUserDoc = await userRef.get();
        const updatedUserData = updatedUserDoc.data();

        return new Response(JSON.stringify(updatedUserData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
