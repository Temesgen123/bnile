'use client';
import Image from 'next/image';
import { useState } from 'react';

const ImageHover = ({
  src,
  hoverSrc,
  alt,
}: {
  src: string;
  hoverSrc: string;
  alt: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  let hoverTimeOut: ReturnType<typeof setTimeout>;
  const handleMouseEnter = () => {
    hoverTimeOut = setTimeout(() => setIsHovered(true), 1000);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeOut);
    setIsHovered(false);
  };

  return (
    <div
      className="relative h-52 "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="80vw"
        className={`object-contain transition-opacity duration-500 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        sizes="80vw"
        className={`absolute inset-0 object-contain transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default ImageHover;
