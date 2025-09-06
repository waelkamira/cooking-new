import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب مسلسل تركي واحد بكل حلقاته
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const series = await prisma.turkishSeries.findUnique({
      where: { id },
      include: {
        turkishEpisodes: {
          orderBy: [{ seasonNumber: 'asc' }, { episodeNumber: 'asc' }],
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!series) {
      return NextResponse.json({ error: 'المسلسل غير موجود' }, { status: 404 });
    }

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب المسلسل' }, { status: 500 });
  }
}
