import HomePage from '../../components/HomePage';
import HomePageSidesPhotos from '../../components/HomePageSidesPhotos';

export default function Home() {
  return (
    <div className="relative w-full flex justify-center ">
      <HomePage />
      <HomePageSidesPhotos />
    </div>
  );
}
