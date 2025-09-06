import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب جميع الأغاني الإنجليزية
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const planetName = searchParams.get('planetName');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;
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
    const [songs, total] = await Promise.all([
      prisma.englishSong.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.englishSong.count(),
    ]);

    return NextResponse.json({
      songs,
      pagination: {
        page,
        limit,
        skip,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في جلب الأغاني الإنجليزية' },
      { status: 500 }
    );
  }
}

// POST - إضافة أغنية إنجليزية جديدة
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
      spotifyLink,
      audioUrl,
    } = body;

    const song = await prisma.englishSong.create({
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
        spotifyLink,
        audioUrl,
        userId: request.user.id,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في إنشاء الأغنية الإنجليزية' },
      { status: 500 }
    );
  }
}

// PUT - تعديل أغنية إنجليزية
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
    const song = await prisma.englishSong.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في تحديث الأغنية الإنجليزية' },
      { status: 500 }
    );
  }
}

// DELETE - حذف أغنية إنجليزية
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'معident الأغنية مطلوب' },
        { status: 400 }
      );
    }

    await prisma.englishSong.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'تم حذف الأغنية الإنجليزية بنجاح' });
  } catch (error) {
    return NextResponse.json(
      { error: 'فشل في حذف الأغنية الإنجليزية' },
      { status: 500 }
    );
  }
}
