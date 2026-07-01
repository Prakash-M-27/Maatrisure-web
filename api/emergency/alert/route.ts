import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'mother') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    const db = await getDatabase();
    const emergencyCollection = db.collection('emergency_alerts');
    const usersCollection = db.collection('users');

    // Get mother's info
    const mother = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!mother) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find assigned providers
    const connections = await db
      .collection('provider_connections')
      .find({ motherId: new ObjectId(decoded.userId) })
      .toArray();

    // Create emergency alert
    const alert = {
      motherId: new ObjectId(decoded.userId),
      motherEmail: mother.email,
      message: message || 'Emergency Alert from Mother',
      status: 'active',
      severity: 'critical',
      assignedProviders: connections.map((c) => c.providerId),
      timestamp: new Date(),
      resolvedAt: null,
    };

    const result = await emergencyCollection.insertOne(alert);

    // In production, send notifications via push/SMS
    console.log('[v0] Emergency alert created:', result.insertedId);
    console.log('[v0] Alert recipients:', connections.length);

    return NextResponse.json(
      {
        message: 'Emergency alert sent to assigned providers',
        alertId: result.insertedId,
        recipientCount: connections.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Emergency alert error:', error);
    return NextResponse.json(
      { error: 'Failed to send emergency alert' },
      { status: 500 }
    );
  }
}
