-- AlterEnum
ALTER TYPE "ContentType" ADD VALUE 'EPISODE';

-- AlterTable
ALTER TABLE "arabic_movies" ADD COLUMN     "subtitles_url" TEXT,
ADD COLUMN     "video_url" TEXT;

-- AlterTable
ALTER TABLE "arabic_songs" ADD COLUMN     "audio_url" TEXT;

-- AlterTable
ALTER TABLE "english_movies" ADD COLUMN     "subtitles_url" TEXT,
ADD COLUMN     "video_url" TEXT;

-- AlterTable
ALTER TABLE "english_songs" ADD COLUMN     "audio_url" TEXT;

-- AlterTable
ALTER TABLE "space_toon_songs" ADD COLUMN     "audio_url" TEXT;

-- AlterTable
ALTER TABLE "turkish_movies" ADD COLUMN     "subtitles_url" TEXT,
ADD COLUMN     "video_url" TEXT;

-- AlterTable
ALTER TABLE "turkish_songs" ADD COLUMN     "audio_url" TEXT;

-- CreateTable
CREATE TABLE "arabic_episodes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "duration" TEXT,
    "episode_number" INTEGER NOT NULL,
    "season_number" INTEGER NOT NULL DEFAULT 1,
    "releaseDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "video_url" TEXT NOT NULL,
    "subtitles_url" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "seriesId" TEXT,
    "userId" TEXT,

    CONSTRAINT "arabic_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "english_episodes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "duration" TEXT,
    "episode_number" INTEGER NOT NULL,
    "season_number" INTEGER NOT NULL DEFAULT 1,
    "releaseDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "video_url" TEXT NOT NULL,
    "subtitles_url" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "seriesId" TEXT,
    "userId" TEXT,

    CONSTRAINT "english_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turkish_episodes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "duration" TEXT,
    "episode_number" INTEGER NOT NULL,
    "season_number" INTEGER NOT NULL DEFAULT 1,
    "releaseDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "video_url" TEXT NOT NULL,
    "subtitles_url" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "seriesId" TEXT,
    "userId" TEXT,

    CONSTRAINT "turkish_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "arabic_episodes_seriesId_idx" ON "arabic_episodes"("seriesId");

-- CreateIndex
CREATE INDEX "arabic_episodes_userId_idx" ON "arabic_episodes"("userId");

-- CreateIndex
CREATE INDEX "english_episodes_seriesId_idx" ON "english_episodes"("seriesId");

-- CreateIndex
CREATE INDEX "english_episodes_userId_idx" ON "english_episodes"("userId");

-- CreateIndex
CREATE INDEX "turkish_episodes_seriesId_idx" ON "turkish_episodes"("seriesId");

-- CreateIndex
CREATE INDEX "turkish_episodes_userId_idx" ON "turkish_episodes"("userId");

-- AddForeignKey
ALTER TABLE "arabic_episodes" ADD CONSTRAINT "arabic_episodes_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "arabic_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arabic_episodes" ADD CONSTRAINT "arabic_episodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "english_episodes" ADD CONSTRAINT "english_episodes_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "english_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "english_episodes" ADD CONSTRAINT "english_episodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turkish_episodes" ADD CONSTRAINT "turkish_episodes_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "turkish_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turkish_episodes" ADD CONSTRAINT "turkish_episodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
