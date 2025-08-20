// app/api/auth/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ authenticated: false });
  }
}