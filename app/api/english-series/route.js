import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب جميع المسلسلات الإنجليزية
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const planetName = searchParams.get('planetName');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
  // Mock data for demonstration
  const mockSeries = [
    {
      id: '1',
      seriesName: 'Space Adventure Chronicles',
      seriesImage: '/images/photo-1.png',
      rating: 4.8,
      episodes: 24,
    },

    {
      id: '2',
      seriesName: 'Cosmic Explorers',
      seriesImage: '/images/photo-2.png',
      rating: 4.7,
      episodes: 18,
    },
    {
      id: '3',
      seriesName: 'Stellar Odyssey',
      seriesImage: '/images/photo-3.png',
      rating: 4.9,
      episodes: 12,
    },
    {
      id: '4',
      seriesName: 'Galactic Pioneers',
      seriesImage: '/images/photo-4.png',
      rating: 4.6,
      episodes: 36,
    },
    {
      id: '5',
      seriesName: 'Nebula Voyagers',
      seriesImage: '/images/photo-5.png',
      rating: 4.5,
      episodes: 24,
    },
    {
      id: '6',
      seriesName: 'Space Adventure Chronicles',
      seriesImage: '/images/photo-1.png',
      rating: 4.8,
      episodes: 24,
    },
  ];
  console.log('page', page);
  console.log('skip', skip);
  console.log('limit', limit);
  console.log('planetName', planetName);

  try {
    // بناء كائن where للبحث بناءً على planetName إذا كان موجوداً
    const whereClause = planetName
      ? {
          planetName: {
            contains: planetName,
            mode: 'insensitive', // للبحث غير حساس لحالة الأحرف
          },
        }
      : {};
    const [series, total] = await Promise.all([
      prisma.englishSeries.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.englishSeries.count(),
    ]);
    return NextResponse.json({
      mockSeries,
      series,
      pagination: {
        page,
        limit,
        total,
        skip,

        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في جلب المسلسلات الإنجليزية' },
      { status: 500 }
    );
  }
}

// POST - إضافة مسلسل إنجليزي جديد
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      episodes,
      season,
      genre,
      releaseDate,
      planetName,
      network,
      imdbRating,
    } = body;

    const series = await prisma.englishSeries.create({
      data: {
        title,
        description,
        imageUrl,
        episodes: parseInt(episodes) || 1,
        season: parseInt(season) || 1,
        genre,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        planetName,
        network,
        imdbRating: imdbRating ? parseFloat(imdbRating) : null,
        userId: request.user.id,
      },
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء المسلسل الإنجليزي' },
      { status: 500 }
    );
  }
}

// PUT - تعديل مسلسل إنجليزي
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'معرف المسلسل مطلوب' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const series = await prisma.englishSeries.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث المسلسل الإنجليزي' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مسلسل إنجليزي
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'معرف المسلسل مطلوب' },
        { status: 400 }
      );
    }

    await prisma.englishSeries.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف المسلسل الإنجليزي بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في حذف المسلسل الإنجليزي' },
      { status: 500 }
    );
  }
}
