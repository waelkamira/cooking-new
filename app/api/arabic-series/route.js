import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب المسلسلات العربية بناءً على اسم الكوكب
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
      prisma.arabicSeries.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.arabicSeries.count({
        where: whereClause,
      }),
    ]);

    console.log('series', series);

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
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المسلسلات' },
      { status: 500 }
    );
  }
}

// POST - إضافة مسلسل عربي جديد
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
      director,
      actors,
      production,
    } = body;

    const series = await prisma?.arabicSeries.create({
      data: {
        title,
        description,
        imageUrl,
        episodes: parseInt(episodes) || 1,
        season: parseInt(season) || 1,
        genre,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        planetName,
        director,
        actors,
        production,
        userId: request.user.id,
      },
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء المسلسل' },
      { status: 500 }
    );
  }
}

// PUT - تعديل مسلسل عربي
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
    const series = await prisma?.arabicSeries.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث المسلسل' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مسلسل عربي
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

    await prisma?.arabicSeries.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف المسلسل بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف المسلسل' }, { status: 500 });
  }
}
