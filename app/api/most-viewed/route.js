import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - جلب المسلسلات العربية الأعلى مشاهدة
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const [series, total] = await Promise.all([
      // جلب المسلسلات مرتبة حسب عدد المشاهدات (تنازلي)
      prisma.arabicSeries.findMany({
        skip,
        take: limit,
        orderBy: { viewsCount: 'desc' }, // الترتيب حسب الأعلى مشاهدة
      }),
      // حساب العدد الإجمالي للمسلسلات (للتقسيم إلى صفحات)
      prisma.arabicSeries.count(),
    ]);

    return NextResponse.json({
      series,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
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
