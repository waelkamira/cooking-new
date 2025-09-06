import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب حلقة تركية محددة
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const episode = await prisma.turkishEpisode.findUnique({
      where: { id },
      include: {
        series: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            genre: true,
          },
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

    if (!episode) {
      return NextResponse.json({ error: 'الحلقة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json(episode);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الحلقة' }, { status: 500 });
  }
}
