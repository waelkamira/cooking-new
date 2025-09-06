'use client';

import { Star, Heart, Eye, Calendar, Trophy, Users } from 'lucide-react';
import Image from 'next/image';

interface AnimeProfileProps {
  user?: {
    name: string;
    username: string;
    avatar: string;
    coverImage: string;
    bio: string;
    isSubscribed: boolean;
    likedSeries: Array<{
      title: string;
      image: string;
      rating: number;
    }>;
    stats: {
      animeWatched: number;
      episodesWatched: number;
      hoursWatched: number;
      favorites: number;
      followers: number;
      following: number;
    };
    badges: Array<{
      name: string;
      icon: string;
      color: string;
    }>;
    recentActivity: Array<{
      anime: string;
      episode: number;
      rating: number;
      timestamp: string;
    }>;
  };
}

export default function AnimeProfile({
  user = {
    name: 'أكيرا تاناكا',
    username: '@akira_otaku',
    avatar: '/anime-character-avatar.png',
    coverImage: '/anime-landscape-mountains-sunset.png',
    bio: 'عاشق للأنمي متحمس لاستكشاف عوالم ما وراء الواقع ✨',
    isSubscribed: true,
    likedSeries: [
      { title: 'هجوم العمالقة', image: '/images/photo-5.png', rating: 5 },
      {
        title: 'قاتل الشياطين',
        image: '/images/photo-5.png',
        rating: 5,
      },
      { title: 'ون بيس', image: '/images/photo-5.png', rating: 4 },
    ],
    stats: {
      animeWatched: 247,
      episodesWatched: 3420,
      hoursWatched: 1680,
      favorites: 42,
      followers: 1250,
      following: 380,
    },
    badges: [
      {
        name: 'أوتاكو نخبة',
        icon: '👑',
        color: 'from-yellow-400 to-orange-500',
      },
      {
        name: 'ماستر المشاهدة',
        icon: '⚡',
        color: 'from-blue-400 to-purple-500',
      },
      { name: 'ناقد', icon: '⭐', color: 'from-pink-400 to-red-500' },
    ],
    recentActivity: [
      {
        anime: 'هجوم العمالقة',
        episode: 24,
        rating: 5,
        timestamp: 'منذ ساعتين',
      },
      {
        anime: 'قاتل الشياطين',
        episode: 12,
        rating: 4,
        timestamp: 'منذ يوم واحد',
      },
      { anime: 'اسمك', episode: 1, rating: 5, timestamp: 'منذ 3 أيام' },
    ],
  },
}: AnimeProfileProps) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 "
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="relative mb-6 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl mt-6 sm:mt-32">
          {/* Cover Image */}
          <div className="relative h-48 sm:h-[500px] ">
            <Image
              src={user.coverImage || '/placeholder.svg'}
              layout="fill"
              objectFit="cover"
              objectPosition="bottom"
              alt="الغلاف"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-50" />

            {/* Profile Avatar */}
            <div className="absolute -bottom-12 right-6 z-50">
              <div className="relative">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/30 backdrop-blur-sm bg-white/10">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white/30" />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6 w-full">
            {/* Status Indicators */}
            <div className="flex justify-end items-center gap-2 w-full">
              <div className="px-3 py-1 rounded-full backdrop-blur-md bg-white/20 border border-white/30">
                <span className="text-white text-xs font-medium">متصل</span>
              </div>
              <div
                className={`px-3 py-1 rounded-full backdrop-blur-md border ${
                  user.isSubscribed
                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30'
                    : 'bg-white/20 border-white/30'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    user.isSubscribed ? 'text-yellow-300' : 'text-white'
                  }`}
                >
                  {user.isSubscribed ? '⭐ مشترك' : 'غير مشترك'}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.name}
              </h1>
              <p className="text-white/70 text-sm mb-3">{user.username}</p>
              <p className="text-white/80 text-sm leading-relaxed">
                {user.bio}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {user.stats.animeWatched}
                </div>
                <div className="text-xs text-white/60">أنمي</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {user.stats.episodesWatched}
                </div>
                <div className="text-xs text-white/60">حلقات</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {user.stats.hoursWatched}س
                </div>
                <div className="text-xs text-white/60">مشاهدة</div>
              </div>
            </div>

            {/* Social Stats */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-white text-sm">
                  {user.stats.favorites}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">
                  {user.stats.followers}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">
                  {user.stats.following}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Card */}
        <div className="mb-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            الإنجازات
          </h2>
          <div className="flex gap-3">
            {user.badges.map((badge, index) => (
              <div
                key={index}
                className={`flex-1 rounded-xl bg-gradient-to-r ${badge.color} p-3 text-center`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium text-white">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liked Series Card */}
        <div className="mb-6 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400" />
            المسلسلات المفضلة
          </h2>
          <div className="flex gap-4">
            {user.likedSeries.map((series, index) => (
              <div key={index} className="flex-1">
                <div className="relative rounded-lg overflow-hidden mb-2 aspect-[3/4]">
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={series.image || '/placeholder.svg'}
                    alt={series.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < series.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-white text-xs font-medium text-center leading-tight">
                  {series.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            النشاط الأخير
          </h2>
          <div className="space-y-4">
            {user.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">
                    {activity.anime}
                  </div>
                  <div className="text-white/60 text-xs">
                    الحلقة {activity.episode} • {activity.timestamp}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < activity.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
