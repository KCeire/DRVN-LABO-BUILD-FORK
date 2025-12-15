import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Attempt to connect to MongoDB
    await dbConnect();

    // Get database name and connection state
    const dbName = mongoose.connection.db?.databaseName || 'Not connected';
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    // List collections if connected
    let collections = [];
    if (mongoose.connection.readyState === 1) {
      const collectionList = await mongoose.connection.db?.listCollections().toArray();
      collections = collectionList?.map(col => col.name) || [];
    }

    // Return connection details
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection test successful!',
      details: {
        database: dbName,
        status: stateMap[connectionState] || 'Unknown',
        collections: collections,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    // If error, return detailed error message
    console.error('MongoDB connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check your MONGODB_URI in .env.local and ensure your IP is whitelisted in MongoDB Atlas'
    }, { status: 500 });
  }
}