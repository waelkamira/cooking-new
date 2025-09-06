'use client';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';
import { inputsContext } from './Context';
import Image from 'next/image';
import Loading from './Loading';
import CurrentUser from './CurrentUser';
import { motion } from 'framer-motion'; // استيراد Framer Motion
import { FaEye, FaStar } from 'react-icons/fa'; // استيراد أيقونات

export default function ZomurodaPlanetMostViewed() {
  const [page, setPage] = useState(1);
  const [zomurodaMostViewed, setZomurodaMostViewed] = useState([]);
  const { newSeries, deletedSeries } = useContext(inputsContext);
  const router = useRouter();
  const user = CurrentUser();
  // console.log('user', user);

  const [zomurodaMostViewedSliderRef, zomurodaMostViewedInstanceRef] =
    useKeenSlider({
      loop: false,
      mode: 'free',
      rtl: true,
      slides: {
        perView: 3,
        spacing: 5,
      },
      slideChanged(slider) {
        const currentSlide = slider.track.details.rel;
        const totalSlides = slider.track.details.slides.length;

        // جلب المزيد من المسلسلات عند الوصول إلى الشريحة الأخيرة
        if (currentSlide >= totalSlides - 3) {
          setPage((prevPage) => prevPage + 1);
        }
      },
    });

  useEffect(() => {
    fetchZomurodaMostViewed();
  }, [newSeries, deletedSeries, page]);

  useEffect(() => {
    if (zomurodaMostViewedInstanceRef.current) {
      zomurodaMostViewedInstanceRef.current.update();
    }
  }, [zomurodaMostViewed]);

  async function fetchZomurodaMostViewed() {
    try {
      const response = await fetch(
        `/api/serieses?page=${page}&planetName=زمردة&limit=4&mostViewed=${true}`
      );
      const json = await response?.json();
      if (response.ok) {
        // console.log('json', json);
        const existingIds = new Set(
          zomurodaMostViewed.map((series) => series.id)
        );
        const newZomurodaMostViewed = json.filter(
          (series) => !existingIds.has(series.id)
        );

        if (newZomurodaMostViewed.length > 0) {
          setZomurodaMostViewed((prevZomurodaMostViewed) => [
            ...prevZomurodaMostViewed,
            ...newZomurodaMostViewed,
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching zomuroda:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden p-2 ">
      <h1 className="w-full text-start p-2 text-white">الأكثر مشاهدة</h1>

      <div ref={zomurodaMostViewedSliderRef} className="keen-slider shadow-lg">
        {zomurodaMostViewed?.length === 0 ? (
          <Loading />
        ) : (
          zomurodaMostViewed?.map((series) => (
            <div
              key={series.id}
              className="keen-slider__slide snap-center flex flex-col items-center"
            >
              <motion.div // استخدام motion.div للصورة المتحركة
                className="flex flex-col items-center justify-start flex-shrink-0 px-2 w-full"
                key={series.id}
                onClick={() => {
                  router.push(
                    `/seriesAndEpisodes?seriesName=${series?.seriesName}`
                  );
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-24 h-32 sm:w-full sm:h-64 rounded-md overflow-hidden hover:cursor-pointer">
                  <Image
                    loading="lazy"
                    src={series.seriesImage}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top"
                    alt={series.seriesName}
                  />
                  {/* إضافة معلومات إضافية */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <FaEye className="mr-1" />
                      <span>{series.views || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="mr-1" />
                      <span>{series.rating || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <h1 className="text-white text-center m-2 text-[10px] sm:text-[15px] w-full line-clamp-2 font-bold">
                  {series.seriesName}
                </h1>
              </motion.div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
