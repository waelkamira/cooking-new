import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب جميع الأفلام العربية
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const planetName = searchParams.get('planetName');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
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
  try {
    // بناء كائن where للبحث بناءً على planetName إذا كان موجوداً
    const whereClause = planetName
      ? {
          planetName: {
            contains: planetName,
            mode: 'insensitive',
          },
        }
      : {};

    const [movies, total] = await Promise.all([
      prisma.arabicMovie.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.arabicMovie.count(),
    ]);

    return NextResponse.json({
      mockSeries,
      movies,
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
      { error: 'فشل في جلب الأفلام العربية' },
      { status: 500 }
    );
  }
}

// POST - إضافة فيلم عربي جديد
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      duration,
      genre,
      releaseDate,
      planetName,
      director,
      actors,
      production,
      videoUrl,
      subtitlesUrl,
    } = body;

    const movie = await prisma.arabicMovie.create({
      data: {
        title,
        description,
        imageUrl,
        duration,
        genre,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        planetName,
        director,
        actors,
        production,
        videoUrl,
        subtitlesUrl,
        userId: request.user.id,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء الفيلم العربي' },
      { status: 500 }
    );
  }
}

// PUT - تعديل فيلم عربي
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الفيلم مطلوب' }, { status: 400 });
    }

    const body = await request.json();
    const movie = await prisma.arabicMovie.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث الفيلم العربي' },
      { status: 500 }
    );
  }
}

// DELETE - حذف فيلم عربي
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الفيلم مطلوب' }, { status: 400 });
    }

    await prisma.arabicMovie.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الفيلم العربي بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في حذف الفيلم العربي' },
      { status: 500 }
    );
  }
}
