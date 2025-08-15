import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  return (
    <div className="pt-16 overflow-hidden pb-16">
      <p className="font-bold text-center text-3xl mb-10">
        Confiança dos alunos de
      </p>

      <div className="relative max-w-7xl mt-6">
        <div className="flex gap-12 md:gap-20 animate-slide whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <img
                src={assets.ipb_logo}
                alt="IPB"
                className="w-32 md:w-40 inline-block object-contain"
              />
              <img
                src={assets.ipb_logo2}
                alt="IPB"
                className="w-32 md:w-40 inline-block object-contain"
              />
              <img
                src={assets.ipb_logo}
                alt="IPB"
                className="w-32 md:w-40 inline-block object-contain"
              />
              <img
                src={assets.ipb_logo2}
                alt="IPB"
                className="w-32 md:w-40 inline-block object-contain"
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
