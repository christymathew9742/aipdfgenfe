// app/api/proxy-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing file URL', { status: 400 });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'application/pdf';
    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return new NextResponse('Failed to fetch PDF', { status: 500 });
  }
}
