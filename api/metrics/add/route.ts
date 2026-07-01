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

    const {
      heartRate,
      bloodPressure,
      fetalMovement,
      contractions,
      hemoglobin,
    } = await request.json();

    const db = await getDatabase();
    const metricsCollection = db.collection('health_metrics');

    const metric = {
      userId: new ObjectId(decoded.userId),
      heartRate,
      bloodPressure,
      fetalMovement,
      contractions,
      hemoglobin,
      timestamp: new Date(),
    };

    const result = await metricsCollection.insertOne(metric);

    return NextResponse.json(
      {
        message: 'Metric recorded successfully',
        metricId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to record metric' },
      { status: 500 }
    );
  }
}
