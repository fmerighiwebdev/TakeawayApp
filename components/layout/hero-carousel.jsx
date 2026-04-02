"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

export default function HeroCarousel({
  images,
  className = "",
  autoplayDelay = 3500,
}) {
  const safeImages = (images ?? []).filter(Boolean);

  if (safeImages.length === 0) return null;

  if (safeImages.length === 1) {
    return (
      <div className={className}>
        <Image
          src={safeImages[0]}
          alt="Hero Image"
          fill
          priority
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        slidesPerView={1}
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={700}
        className="h-full w-full"
      >
        {safeImages.map((url, idx) => (
          <SwiperSlide key={`${url}-${idx}`} className="relative h-full w-full">
            <Image
              src={url}
              alt={`Hero Image ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}