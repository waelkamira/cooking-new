import Link from 'next/link';
import React from 'react';

export default function Button({ style, title, onClick, path = '', icon }) {
  // console.log('style: ', style);
  return (
    <Link href={path} className="w-full">
      <button
        type="submit"
        onClick={() => onClick}
        className={
          style +
          ` relative flex items-center justify-between shadow-lg hover:bg-white/20 text-white border hover:border-white/30 transition-all duration-300  pr-3 my-2 sm:text-lg sm:p-2 text-sm p-1 px-2 text-nowrap bg-five select-none rounded-full w-full max-h-12 hover:text-white`
        }
      >
        <span className="absolute top-1 md:top-2 right-0 flex justify-end items-center w-1/6">
          {icon}|
        </span>
        <span className="w-full text-center">{title}</span>{' '}
      </button>
    </Link>
  );
}
