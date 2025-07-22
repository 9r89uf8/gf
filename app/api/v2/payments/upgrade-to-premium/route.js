import { NextResponse } from 'next/server';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { adminDb } from "@/app/utils/firebaseAdmin";

export async function POST(request) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const userId = authResult.user.uid;
    const body = await request.json();
    const { sessionId, paymentDetails, metadata } = body;
    console.log(metadata)

    console.log(`Upgrading user ${userId} to premium after successful payment`);

    // Use a transaction to prevent race conditions
    const db = adminDb.firestore();
    
    const transactionResult = await db.runTransaction(async (transaction) => {
      // Get user reference
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      
      // Check if this payment has already been processed
      if (userData?.payments) {
        const existingPayment = userData.payments.find(payment => payment.id === sessionId);
        if (existingPayment) {
          console.log(`Payment with sessionId ${sessionId} has already been processed`);
          return {
            alreadyProcessed: true,
            paymentRecord: existingPayment
          };
        }
      }
      
      // Calculate premium expiration based on duration
      let premiumExpiresAt = null;
      const durationDays = parseInt(paymentDetails.metadata?.productDuration) || 0;
      
      if (durationDays > 0) {
        premiumExpiresAt = new Date();
        premiumExpiresAt.setDate(premiumExpiresAt.getDate() + durationDays);
      }
      
      // Create payment record
      const paymentRecord = {
        id: sessionId,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        date: new Date(),
        duration: durationDays || null,
        status: 'completed',
        expiresAt: premiumExpiresAt,
        productType: paymentDetails.metadata?.productType || 'premium',
        metadata: paymentDetails.metadata || {}
      };
      
      // Update user within transaction
      transaction.update(userRef, {
        premium: true,
        payments: adminDb.firestore.FieldValue.arrayUnion(paymentRecord)
      });
      
      return {
        alreadyProcessed: false,
        paymentRecord: paymentRecord
      };
    });
    
    // If payment was already processed, return early
    if (transactionResult.alreadyProcessed) {
      // Get the current user data
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
        alreadyProcessed: true,
        paymentRecord: transactionResult.paymentRecord,
        user: userData
      });
    }

    // Get all girls
    const girlsSnapshot = await adminDb
        .firestore()
        .collection('girls')
        .orderBy('priority', 'desc')
        .get();

    const girls = [];
    girlsSnapshot.forEach(doc => {
      girls.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`Found ${girls.length} girls to update conversations for`);

    // Update conversations for all girls
    const conversationUpdates = [];
    for (const girl of girls) {
      const conversationId = `${userId}_${girl.id}`;
      const conversationRef = adminDb.firestore().collection('conversations').doc(conversationId);

      // Check if conversation exists
      const conversationDoc = await conversationRef.get();

      if (conversationDoc.exists) {
        // Update existing conversation
        console.log(`Updating existing conversation: ${conversationId}`);
        conversationUpdates.push(
            conversationRef.update({
              freeMessages: 1000,
              freeAudio: 1000,
              freeImages: 1000,
              updatedAt: new Date()
            })
        );
      } else {
        // Create new conversation with premium benefits
        console.log(`Creating new conversation: ${conversationId}`);
        conversationUpdates.push(
            conversationRef.set({
              userId: userId,
              girlId: girl.id,
              freeMessages: 1000,
              freeAudio: 1000,
              freeImages: 1000,
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date()
            })
        );
      }
    }

    // Execute all conversation updates
    await Promise.all(conversationUpdates);

    console.log(`Successfully updated user ${userId} to premium and updated ${conversationUpdates.length} conversations`);

    // Get the updated user data
    const updatedUserDoc = await db.collection('users').doc(userId).get();
    const updatedUserData = updatedUserDoc.data();

    return NextResponse.json({
      success: true,
      message: 'User upgraded to premium successfully',
      conversationsUpdated: conversationUpdates.length,
      paymentRecord: transactionResult.paymentRecord,
      user: updatedUserData
    });

  } catch (error) {
    console.error('Error upgrading user to premium:', error);

    return NextResponse.json(
        { error: error.message || 'Failed to upgrade user' },
        { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
  );
}