import Image from 'next/image';
import React from 'react';

export default function HomePageSidesPhotos() {
  return (
    <div className="hidden xl:block h-full z-0">
      <div className="absolute w-[800px] h-full -left-0 top-0  ">
        <Image
          priority
          src={'/vegetables2.png'}
          layout="fill"
          objectFit="cover"
          alt="photo"
        />
      </div>
      <div className="absolute w-[800px] h-full -right-0 top-0 rotate-180">
        <Image
          priority
          src={'/vegetables2.png'}
          layout="fill"
          objectFit="cover"
          alt="photo"
        />
      </div>
    </div>
  );
}
