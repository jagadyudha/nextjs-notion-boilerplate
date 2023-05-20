'use client';

import NextImage from 'next/image';
import { useState } from 'react';

export const NotionImage: React.FC<{
  src: string;
  alt: string;
  blockId: string;
}> = ({ src, alt, blockId }) => {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <NextImage
      src={imageSrc}
      alt={alt}
      fill
      className="object-contain p-0 m-0 bg-blue-300 !w-auto rounded overflow-hidden"
      onError={async () => {
        const res = await fetch(`/api/images?blockId=${blockId}`).then((res) =>
          res.json()
        );
        setImageSrc(res.imageSrc);
      }}
    />
  );
};
