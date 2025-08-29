import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const collection = await getCollection('questions');
    
    // Get total count for pagination metadata
    const totalCount = await collection.countDocuments();
    
    // Fetch paginated questions
    const questions = await collection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      questions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}