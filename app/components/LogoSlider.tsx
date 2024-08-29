"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const logos = [
  '/brands/1.jpg',
  '/brands/2.png',
  '/brands/4.png',
  '/brands/5.png',
  '/brands/6.svg',
  '/brands/7.svg',
  '/brands/9.svg',

];

const LogoSlider: React.FC = () => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition((prevPosition) => (prevPosition - 1) % (logos.length * 200));
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full overflow-hidden ">
      <h2 className="text-center text-2xl dark:text-white text-black font-bold mb-8">Trusted by Top Companies</h2>
      <div className="relative w-full">
        <div
          className="flex transition-transform duration-1000 ease-linear"
          style={{ transform: `translateX(${position}px)` }}
        >
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex-shrink-0 w-48 mx-8">
              <Image src={logo} alt={`Company logo ${index + 1}`} width={150} height={50} objectFit="contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;