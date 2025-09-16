import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  const logos = [
    assets.ipb_logo,
    assets.ipb_logo2,
    assets.ipb_logo,
    assets.ipb_logo2,
  ];

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <p className="font-bold text-center text-2xl md:text-3xl mb-8">
          Confiança dos alunos de
        </p>

        <div className="relative overflow-hidden">
          <div className="flex gap-10 md:gap-16 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap">
            {[...Array(2)].map((_, k) => (
              <React.Fragment key={k}>
                {logos.map((src, i) => (
                  <img
                    key={`${k}-${i}`}
                    src={src}
                    alt="Logótipo"
                    className="inline-block object-contain h-10 sm:h-12 md:h-14 xl:h-16"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
