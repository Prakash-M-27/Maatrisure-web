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
      return NextResponse.json({ error: 'Only mothers can connect to providers' }, { status: 401 });
    }

    const { providerUniqueId, providerType } = await request.json();

    if (!providerUniqueId || !providerType) {
      return NextResponse.json(
        { error: 'Missing providerUniqueId or providerType' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const connectionsCollection = db.collection('provider_connections');

    // Find provider by unique ID
    const provider = await usersCollection.findOne({
      uniqueId: providerUniqueId,
      role: providerType,
    });

    if (!provider) {
      return NextResponse.json(
        { error: `${providerType} with ID ${providerUniqueId} not found` },
        { status: 404 }
      );
    }

    // Check if already connected
    const existingConnection = await connectionsCollection.findOne({
      motherId: new ObjectId(decoded.userId),
      providerId: provider._id,
    });

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Already connected to this provider' },
        { status: 400 }
      );
    }

    // Create connection
    const connection = {
      motherId: new ObjectId(decoded.userId),
      providerId: provider._id,
      providerType: providerType,
      providerName: provider.email,
      providerUniqueId: provider.uniqueId,
      connectedAt: new Date(),
    };

    const result = await connectionsCollection.insertOne(connection);

    return NextResponse.json(
      {
        message: `Successfully connected to ${providerType}`,
        connectionId: result.insertedId,
        provider: {
          id: provider._id,
          email: provider.email,
          uniqueId: provider.uniqueId,
          type: providerType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Provider connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to provider' },
      { status: 500 }
    );
  }
}
