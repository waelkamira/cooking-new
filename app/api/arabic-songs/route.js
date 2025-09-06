import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب جميع الأغاني العربية
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
            mode: 'insensitive', // للبحث غير حساس لحالة الأحرف
          },
        }
      : {};
    const [songs, total] = await Promise.all([
      prisma.arabicSong.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.arabicSong.count(),
    ]);

    return NextResponse.json({
      mockSeries,
      songs,
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
      { error: 'فشل في جلب الأغاني العربية' },
      { status: 500 }
    );
  }
}

// POST - إضافة أغنية عربية جديدة
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
      artist,
      album,
      lyrics,
      audioUrl,
    } = body;

    const song = await prisma.arabicSong.create({
      data: {
        title,
        description,
        imageUrl,
        duration,
        genre,
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        planetName,
        artist,
        album,
        lyrics,
        audioUrl,
        userId: request.user.id,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء الأغنية العربية' },
      { status: 500 }
    );
  }
}

// PUT - تعديل أغنية عربية
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'معرف الأغنية مطلوب' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const song = await prisma.arabicSong.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث الأغنية العربية' },
      { status: 500 }
    );
  }
}

// DELETE - حذف أغنية عربية
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'معرف الأغنية مطلوب' },
        { status: 400 }
      );
    }

    await prisma.arabicSong.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الأغنية العربية بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في حذف الأغنية العربية' },
      { status: 500 }
    );
  }
}
