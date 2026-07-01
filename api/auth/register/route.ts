import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword, generateOTP } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, password, phone, role } = await request.json();

    if (!email || !password || !phone || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedPassword = await hashPassword(password);
    const uniqueId = role === 'doctor' || role === 'asha'
      ? `${role.toUpperCase()}-${Date.now()}`
      : undefined;

    // Create user with unverified status
    const newUser = {
      email,
      password: hashedPassword,
      phone,
      role, // 'mother', 'asha', 'doctor'
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isVerified: false,
      uniqueId: uniqueId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // In production, send OTP via SMS/Email
    console.log(`[v0] OTP for ${email}: ${otp}`);

    return NextResponse.json(
      {
        message: 'User registered. Please verify with OTP.',
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
