import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { withAuth, withRole } from '../../../lib/prisma';

// GET - جلب مستخدم محدد
export const GET = withAuth(async (request, { params }) => {
  try {
    const { id } = params;

    // التحقق من الصلاحيات
    const isAdmin = request.user.role === 'ADMIN';
    const isOwnProfile = request.user.id === id;

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'ليس لديك صلاحية للوصول إلى هذا الملف الشخصي',
          code: 'INSUFFICIENT_PERMISSIONS',
        },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionType: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        isActive: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        // إحصائيات المحتوى
        _count: {
          select: {
            arabicSeries: true,
            englishSeries: true,
            turkishSeries: true,
            arabicMovies: true,
            englishMovies: true,
            turkishMovies: true,
            arabicSongs: true,
            englishSongs: true,
            turkishSongs: true,
            spaceToonSongs: true,
            arabicEpisodes: true,
            englishEpisodes: true,
            turkishEpisodes: true,
            baseMedia: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'المستخدم غير موجود',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'فشل في جلب بيانات المستخدم',
        code: 'USER_FETCH_ERROR',
      },
      { status: 500 }
    );
  }
});
