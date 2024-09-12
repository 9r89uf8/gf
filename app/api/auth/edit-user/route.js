// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';

export async function PUT(req) {
    const { email, name, phone, id } = await req.json();


    try {
        // Update the user's email in Firebase Authentication
        await adminAuth.updateUser(id, { email });



        // Update the user's information in Firestore
        const userRef = adminDb.firestore().collection('users').doc(id);

        const updatedData = {
            email,
            name,
            phone
        };


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
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
