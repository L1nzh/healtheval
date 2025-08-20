import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('test');
    await collection.insertOne({ test: 'hello', time: new Date() });
    return NextResponse.json({ success: true, message: 'Connected to MongoDB!' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}