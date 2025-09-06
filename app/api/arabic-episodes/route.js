import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import authMiddleware from '../../../lib/prisma';

// GET - جلب جميع الحلقات العربية
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const seriesId = searchParams.get('seriesId');
    const skip = (page - 1) * limit;

    let whereClause = {};
    if (seriesId) {
      whereClause = { seriesId };
    }

    const [episodes, total] = await Promise.all([
      prisma.arabicEpisode.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          series: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
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
        orderBy: [{ seasonNumber: 'asc' }, { episodeNumber: 'asc' }],
      }),
      prisma.arabicEpisode.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      episodes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في جلب الحلقات العربية' },
      { status: 500 }
    );
  }
}

// POST - إضافة حلقة عربية جديدة
export const POST = authMiddleware(async (request) => {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      duration,
      episodeNumber,
      seasonNumber,
      releaseDate,
      videoUrl,
      subtitlesUrl,
      isFree,
      seriesId,
    } = body;

    // التحقق من وجود المسلسل
    const series = await prisma.arabicSeries.findUnique({
      where: { id: seriesId },
    });

    if (!series) {
      return NextResponse.json({ error: 'المسلسل غير موجود' }, { status: 404 });
    }

    const episode = await prisma.arabicEpisode.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || series.imageUrl,
        duration,
        episodeNumber: parseInt(episodeNumber),
        seasonNumber: parseInt(seasonNumber) || 1,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        videoUrl,
        subtitlesUrl,
        isFree: Boolean(isFree),
        seriesId,
        userId: request.user.id,
      },
    });

    return NextResponse.json(episode, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء الحلقة العربية' },
      { status: 500 }
    );
  }
});

// PUT - تعديل حلقة عربية
export const PUT = authMiddleware(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الحلقة مطلوب' }, { status: 400 });
    }

    const body = await request.json();
    const episode = await prisma.arabicEpisode.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(episode);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث الحلقة العربية' },
      { status: 500 }
    );
  }
});

// DELETE - حذف حلقة عربية
export const DELETE = authMiddleware(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الحلقة مطلوب' }, { status: 400 });
    }

    await prisma.arabicEpisode.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الحلقة العربية بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في حذف الحلقة العربية' },
      { status: 500 }
    );
  }
});
