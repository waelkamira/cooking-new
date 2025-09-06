import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - بحث سريع في جميع المحتويات
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!query) {
      return NextResponse.json({ error: 'كلمة البحث مطلوبة' }, { status: 400 });
    }

    const [
      arabicSeries,
      englishSeries,
      turkishSeries,
      arabicMovies,
      englishMovies,
      turkishMovies,
      arabicSongs,
      englishSongs,
      turkishSongs,
      spaceToonSongs,
    ] = await Promise.all([
      // المسلسلات العربية
      prisma.arabicSeries.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true,
        },
      }),

      // المسلسلات الإنجليزية
      prisma.englishSeries.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true,
        },
      }),

      // المسلسلات التركية
      prisma.turkishSeries.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true,
        },
      }),

      // الأفلام العربية
      prisma.arabicMovie.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true,
        },
      }),

      // الأفلام الإنجليزية
      prisma.englishMovie.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true,
        },
      }),

      // الأفلام التركية
      prisma.turkishMovie.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          type: true,
        },
      }),

      // الأغاني العربية
      prisma.arabicSong.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { artist: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          artist: true,
          type: true,
        },
      }),

      // الأغاني الإنجليزية
      prisma.englishSong.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { artist: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          artist: true,
          type: true,
        },
      }),

      // الأغاني التركية
      prisma.turkishSong.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { artist: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          artist: true,
          type: true,
        },
      }),

      // أغاني سبيس تون
      prisma.spaceToonSong.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { artist: { contains: query, mode: 'insensitive' } },
            { cartoon: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          artist: true,
          cartoon: true,
          type: true,
        },
      }),
    ]);

    // دمج النتائج مع إضافة نوع المحتوى
    const results = [
      ...arabicSeries.map((item) => ({
        ...item,
        contentType: 'arabic-series',
      })),
      ...englishSeries.map((item) => ({
        ...item,
        contentType: 'english-series',
      })),
      ...turkishSeries.map((item) => ({
        ...item,
        contentType: 'turkish-series',
      })),
      ...arabicMovies.map((item) => ({ ...item, contentType: 'arabic-movie' })),
      ...englishMovies.map((item) => ({
        ...item,
        contentType: 'english-movie',
      })),
      ...turkishMovies.map((item) => ({
        ...item,
        contentType: 'turkish-movie',
      })),
      ...arabicSongs.map((item) => ({ ...item, contentType: 'arabic-song' })),
      ...englishSongs.map((item) => ({ ...item, contentType: 'english-song' })),
      ...turkishSongs.map((item) => ({ ...item, contentType: 'turkish-song' })),
      ...spaceToonSongs.map((item) => ({
        ...item,
        contentType: 'space-toon-song',
      })),
    ];

    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Quick search error:', error);
    return NextResponse.json({ error: 'فشل في البحث السريع' }, { status: 500 });
  }
}
