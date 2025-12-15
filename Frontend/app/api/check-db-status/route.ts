import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Get database info
    const dbName = mongoose.connection.db?.databaseName || 'Not connected';
    const connectionState = mongoose.connection.readyState;

    // Check DEV_MODE status
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

    // Get user count
    const userCount = await User.countDocuments();

    // Get sample users (first 5)
    const sampleUsers = await User.find({})
      .select('firstName lastName username email walletAddress createdAt')
      .limit(5)
      .lean();

    // List all collections
    let collections = [];
    if (mongoose.connection.readyState === 1) {
      const collectionList = await mongoose.connection.db?.listCollections().toArray();
      collections = collectionList?.map(col => col.name) || [];
    }

    return NextResponse.json({
      success: true,
      database: {
        name: dbName,
        connected: connectionState === 1,
        collections: collections
      },
      devMode: {
        enabled: isDevMode,
        message: isDevMode ?
          '⚠️ DEV_MODE is ON - Using mock data, not real database for auth' :
          '✅ DEV_MODE is OFF - Using real database'
      },
      users: {
        count: userCount,
        samples: sampleUsers.length > 0 ? sampleUsers : 'No users found in database'
      },
      recommendation: {
        nextStep: isDevMode && userCount > 0 ?
          'You have real users in database. Consider setting NEXT_PUBLIC_DEV_MODE=false in .env.local' :
          isDevMode && userCount === 0 ?
          'No users in database yet. Keep DEV_MODE=true for now or create test users' :
          'Database is properly configured and DEV_MODE is off'
      }
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      devMode: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
      hint: 'Check MongoDB URI and ensure database name is specified'
    }, { status: 500 });
  }
}