import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { prisma } from '../lib/prisma';

// middleware المصادقة الأساسي
export async function authMiddleware(request) {
  try {
    // الحصول على التوكن من NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    // التحقق من وجود التوكن
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'غير مصرح بالوصول. يلزم تسجيل الدخول.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // التحقق من صلاحية التوكن
    const currentTime = Math.floor(Date.now() / 1000);
    if (token.exp && token.exp < currentTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'انتهت صلاحية الجلسة. يلزم تسجيل الدخول مرة أخرى.',
          code: 'TOKEN_EXPIRED',
        },
        { status: 401 }
      );
    }

    // جلب بيانات المستخدم الكاملة من قاعدة البيانات
    const user = await prisma.user.findUnique({
      where: { id: token.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        subscriptionType: true,
        subscriptionEnd: true,
      },
    });

    // التحقق من وجود المستخدم ونشاطه
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'المستخدم غير موجود.',
          code: 'USER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'الحساب معطل. يرجى التواصل مع الدعم.',
          code: 'ACCOUNT_DISABLED',
        },
        { status: 403 }
      );
    }

    // التحقق من صلاحية الاشتراك إذا لزم الأمر
    if (user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'انتهت صلاحية الاشتراك. يرجى تجديد الاشتراك.',
          code: 'SUBSCRIPTION_EXPIRED',
        },
        { status: 403 }
      );
    }

    // إضافة بيانات المستخدم إلى request
    request.user = user;

    return null; // الاستمرار إلى الـ handler
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'خطأ في المصادقة',
        code: 'AUTH_ERROR',
      },
      { status: 500 }
    );
  }
}

// middleware للتحقق من المصادقة
export function withAuth(handler) {
  return async (request) => {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;
    return handler(request);
  };
}

// middleware للتحقق من الصلاحيات
export function withRole(handler, requiredRoles) {
  return async (request) => {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    if (!requiredRoles.includes(request.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد.',
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredRoles,
          userRole: request.user.role,
        },
        { status: 403 }
      );
    }

    return handler(request);
  };
}

// middleware للتحقق من ملكية المورد أو الصلاحيات
export function withOwnershipOrRole(handler, requiredRoles = []) {
  return async (request, resourceId = null) => {
    const authResponse = await authMiddleware(request);
    if (authResponse) return authResponse;

    // إذا كان لديه الصلاحيات المطلوبة، السماح بالوصول
    if (requiredRoles.includes(request.user.role)) {
      return handler(request);
    }

    // إذا لم يكن هناك resourceId، رفض الوصول
    if (!resourceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'معرف المورد مطلوب للتحقق من الملكية.',
          code: 'RESOURCE_ID_REQUIRED',
        },
        { status: 400 }
      );
    }

    // التحقق من ملكية المورد
    const isOwner = await checkResourceOwnership(
      request.user.id,
      resourceId,
      request
    );

    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: 'ليس لديك صلاحية الوصول إلى هذا المورد.',
          code: 'RESOURCE_OWNERSHIP_REQUIRED',
        },
        { status: 403 }
      );
    }

    return handler(request);
  };
}

// دالة مساعدة للتحقق من ملكية المورد
async function checkResourceOwnership(userId, resourceId, request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    if (pathname.includes('/users/')) {
      // للمستخدمين، التحقق إذا كان userId يطابق resourceId
      return userId === resourceId;
    }

    if (
      pathname.includes('/arabic-series/') ||
      pathname.includes('/english-series/') ||
      pathname.includes('/turkish-series/')
    ) {
      const series = await prisma[getModelName(pathname)].findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      return series && series.userId === userId;
    }

    if (
      pathname.includes('/arabic-movies/') ||
      pathname.includes('/english-movies/') ||
      pathname.includes('/turkish-movies/')
    ) {
      const movie = await prisma[getModelName(pathname)].findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      return movie && movie.userId === userId;
    }

    if (
      pathname.includes('/arabic-songs/') ||
      pathname.includes('/english-songs/') ||
      pathname.includes('/turkish-songs/') ||
      pathname.includes('/space-toon-songs/')
    ) {
      const song = await prisma[getModelName(pathname)].findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      return song && song.userId === userId;
    }

    if (
      pathname.includes('/arabic-episodes/') ||
      pathname.includes('/english-episodes/') ||
      pathname.includes('/turkish-episodes/')
    ) {
      const episode = await prisma[getModelName(pathname)].findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      return episode && episode.userId === userId;
    }

    return false;
  } catch (error) {
    console.error('Ownership check error:', error);
    return false;
  }
}

// دالة مساعدة للحصول على اسم النموذج من المسار
function getModelName(pathname) {
  if (pathname.includes('/arabic-series/')) return 'arabicSeries';
  if (pathname.includes('/english-series/')) return 'englishSeries';
  if (pathname.includes('/turkish-series/')) return 'turkishSeries';
  if (pathname.includes('/arabic-movies/')) return 'arabicMovie';
  if (pathname.includes('/english-movies/')) return 'englishMovie';
  if (pathname.includes('/turkish-movies/')) return 'turkishMovie';
  if (pathname.includes('/arabic-songs/')) return 'arabicSong';
  if (pathname.includes('/english-songs/')) return 'englishSong';
  if (pathname.includes('/turkish-songs/')) return 'turkishSong';
  if (pathname.includes('/space-toon-songs/')) return 'spaceToonSong';
  if (pathname.includes('/arabic-episodes/')) return 'arabicEpisode';
  if (pathname.includes('/english-episodes/')) return 'englishEpisode';
  if (pathname.includes('/turkish-episodes/')) return 'turkishEpisode';

  return null;
}
