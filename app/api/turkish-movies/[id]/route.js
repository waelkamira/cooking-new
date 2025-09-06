import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب فيلم تركي محدد
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const movie = await prisma.turkishMovie.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!movie) {
      return NextResponse.json({ error: 'الفيلم غير موجود' }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الفيلم' }, { status: 500 });
  }
}
