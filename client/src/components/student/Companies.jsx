import React from "react";
import { assets } from "../../assets/assets";

const Companies = () => {
  return (
    <div className="pt-16 overflow-hidden">
      <p className=" text-base-content/70 text-center text-3xl mb-10">
        Confiança dos alunos de
      </p>

      <div className="relative max-w-7xl mt-6">
        <div className="flex gap-12 md:gap-20 animate-slide whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <img
                src={assets.microsoft_logo}
                alt="Microsoft"
                className="w-20 md:w-28 inline-block"
              />
              <img
                src={assets.walmart_logo}
                alt="Walmart"
                className="w-20 md:w-28 inline-block"
              />
              <img
                src={assets.accenture_logo}
                alt="Accenture"
                className="w-20 md:w-28 inline-block"
              />
              <img
                src={assets.adobe_logo}
                alt="Adobe"
                className="w-20 md:w-28 inline-block"
              />
              <img
                src={assets.paypal_logo}
                alt="Paypal"
                className="w-20 md:w-28 inline-block"
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
