-- AlterTable
ALTER TABLE "arabic_episodes" ADD COLUMN     "language" TEXT DEFAULT 'ar';

-- AlterTable
ALTER TABLE "arabic_movies" ADD COLUMN     "language" TEXT DEFAULT 'ar';

-- AlterTable
ALTER TABLE "arabic_series" ADD COLUMN     "language" TEXT DEFAULT 'ar';

-- AlterTable
ALTER TABLE "arabic_songs" ADD COLUMN     "language" TEXT DEFAULT 'ar';

-- AlterTable
ALTER TABLE "english_episodes" ADD COLUMN     "language" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "english_movies" ADD COLUMN     "language" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "english_series" ADD COLUMN     "language" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "english_songs" ADD COLUMN     "language" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "turkish_episodes" ADD COLUMN     "language" TEXT DEFAULT 'tr';

-- AlterTable
ALTER TABLE "turkish_movies" ADD COLUMN     "language" TEXT DEFAULT 'tr';

-- AlterTable
ALTER TABLE "turkish_series" ADD COLUMN     "language" TEXT DEFAULT 'tr';

-- AlterTable
ALTER TABLE "turkish_songs" ADD COLUMN     "language" TEXT DEFAULT 'tr';
