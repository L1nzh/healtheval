import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '3'), 10); // Max 3 questions per session

    const collection = await getCollection('questions');
    
    // Get questions with answeredTimes <= 3, randomly selected
    // Handle both string and number formats for answeredTimes
    const questions = await collection
      .aggregate([
        { 
          $match: { 
            $or: [
              { answeredTimes: { $lte: 3 } },
              { answeredTimes: { $in: ["0", "1", "2", "3"] } }
            ]
          } 
        },
        { $sample: { size: limit } }
      ])
      .toArray();

    // Get total count of eligible questions for metadata
    const totalCount = await collection.countDocuments({
      $or: [
        { answeredTimes: { $lte: 3 } },
        { answeredTimes: { $in: ["0", "1", "2", "3"] } }
      ]
    });

    return NextResponse.json({
      questions,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount,
        hasNext: false,
        hasPrev: false,
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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const collection = await getCollection('questions');
    
    // First, get the current document to check the data type
    const currentDoc = await collection.findOne({ _id: new ObjectId(questionId) });
    
    if (!currentDoc) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Convert string answeredTimes to number if needed, then increment
    let updateOperation;
    if (typeof currentDoc.answeredTimes === 'string') {
      const currentCount = parseInt(currentDoc.answeredTimes) || 0;
      updateOperation = { $set: { answeredTimes: currentCount + 1 } };
    } else {
      updateOperation = { $inc: { answeredTimes: 1 } };
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(questionId) },
      updateOperation
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Question answered times updated'
    });

  } catch (error) {
    console.error('Error updating answered times:', error);
    return NextResponse.json(
      { error: 'Failed to update answered times' },
      { status: 500 }
    );
  }
}