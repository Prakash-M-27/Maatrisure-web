import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const metricsCollection = db.collection('health_metrics');

    const queryUserId = request.nextUrl.searchParams.get('userId') || decoded.userId;

    const metrics = await metricsCollection
      .find({ userId: new ObjectId(queryUserId) })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(
      {
        metrics,
        count: metrics.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Fetch metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
