// src/app/api/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Submission } from '@/types';
import { getCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getCollection('submissions');
    const submissions = await collection
      .find({})
      .sort({ timestamp: -1 }) // 最新的在前
      .toArray();

    // MongoDB 返回的 _id 是 ObjectId，需要转成字符串或删除
    const serialized = submissions.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(), // 可选：保留 ID
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('GET DATA ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newSubmission: Submission = await req.json();
    const submissionWithTimestamp = {
      ...newSubmission,
      timestamp: new Date().toISOString(),
    };

    const collection = await getCollection('submissions');
    const result = await collection.insertOne(submissionWithTimestamp);

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId.toString() 
    });
  } catch (error) {
    console.error('SUBMIT DATA ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to submit data' },
      { status: 500 }
    );
  }
}