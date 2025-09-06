import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب جميع الأغاني التركية
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
      prisma.turkishSong.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.turkishSong.count(),
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
      { error: 'فشل في جلب الأغاني التركية' },
      { status: 500 }
    );
  }
}

// POST - إضافة أغنية تركية جديدة
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
      isTraditional,
      audioUrl,
    } = body;

    const song = await prisma.turkishSong.create({
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
        isTraditional: Boolean(isTraditional),
        audioUrl,
        userId: request.user.id,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء الأغنية التركية' },
      { status: 500 }
    );
  }
}

// PUT - تعديل أغنية تركية
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
    const song = await prisma.turkishSong.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث الأغنية التركية' },
      { status: 500 }
    );
  }
}

// DELETE - حذف أغنية تركية
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

    await prisma.turkishSong.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الأغنية التركية بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في حذف الأغنية التركية' },
      { status: 500 }
    );
  }
}
