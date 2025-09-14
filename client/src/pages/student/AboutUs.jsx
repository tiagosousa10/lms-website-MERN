// LmsAboutUs.tsx
import React from "react";
import { SearchIcon, Flag, Users, Heart, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { assets } from "../../assets/assets";

// Cards de valores/missão (conteúdo do AboutUs, estilo do segundo)
const featureCards = [
  {
    title: "Nossa Missão",
    description: "Educar. Inspirar. Transformar.",
    Icon: Flag,
  },
  {
    title: "Quem Somos",
    description: "Professores experientes dedicados ao teu sucesso.",
    Icon: Users,
  },
  {
    title: "O Que Valorizamos",
    description: "Integridade, suporte e melhoria contínua.",
    Icon: Heart,
  },
  {
    title: "A Nossa História",
    description: "Lançados em 2021, já formámos +5.000 alunos.",
    Icon: Calendar,
  },
];

export const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white overflow-x-hidden max-w-[1440px] mx-auto relative">
        {/* Hero / Sobre Nós */}
        <section className="flex flex-col-reverse md:flex-row items-start justify-between px-[24px] md:px-[147px] pt-[60px] md:pt-[100px] pb-[100px]  gap-10">
          <div className="flex-1 max-w-[589px] flex flex-col mt-10 ">
            <h1 className="font-semibold text-[#37353e] text-4xl mb-6">
              Sobre Nós
            </h1>
            <p className="text-black/80 text-[15px] leading-relaxed max-w-[560px]">
              A tsAcademy nasceu da paixão por educação acessível e de
              qualidade. Guiados pelos valores de transparência, inovação e
              comunidade, ajudamos milhares de alunos a alcançarem os seus
              sonhos.
            </p>
          </div>
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img
              className="w-[320px] h-[320px] md:w-[376px] md:h-[374px]"
              alt="Ilustração Sobre Nós"
              src={assets.about_us}
            />
          </div>
        </section>

        {/* Cards de valores/mission (shadcn Card, layout do 2º JSX) */}
        <section className="px-[24px] md:px-[81px] pb-[100px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1274px] mx-auto">
            {featureCards.map(({ title, description, Icon }) => (
              <Card
                key={title}
                className="h-[140px] rounded-[10px] border border-solid border-[#547792] bg-white hover:shadow-md transition"
              >
                <CardContent className="h-full p-4 flex flex-col items-center justify-center gap-2 relative">
                  <div className="w-12 h-12 rounded-full bg-[#94b4c11a] border border-[#94b4c133] flex items-center justify-center absolute top-3">
                    <Icon className="w-6 h-6 text-[#547792]" />
                  </div>
                  <div className="pt-10 text-center">
                    <div className="font-semibold text-black text-sm">
                      {title}
                    </div>
                    <div className="text-black/70 text-sm mt-1">
                      {description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Equipa (estilo painel escuro do 2º JSX mas com grid da tua lógica) */}
        <section className="px-[24px] md:px-[147px] pb-[100px]">
          <h2 className="font-semibold text-[#37353e] text-3xl md:text-4xl mb-[36px] md:mb-[56px]">
            A Nossa Equipa
          </h2>

          <div className="bg-[#213448] rounded-[12px] border border-[#ecefca33] p-8 md:p-10">
            <div className="flex flex-row justify-between">
              <div
                key={name}
                className="text-center bg-[#1a2a3a] rounded-[10px] border border-[#ecefca1f] p-5"
              >
                <div className="avatar mx-auto mb-4">
                  <div className="size-64">
                    <img
                      src={assets.about_us_tiago}
                      alt={name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-white">Tiago Sousa</h3>
                <p className="text-sm text-white/70">CEO</p>
              </div>
              <div className="px-4 items-center  py-4 w-3/4 flex flex-col justify-between">
                <div>
                  <p className="text-white text-xl p-8 ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. <br />
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                    <br /> Duis aute irure dolor in reprehenderit in voluptate
                    velit esse cillum dolore eu fugiat nulla pariatur.{" "}
                  </p>
                </div>
                <div className="p-6">
                  <img src={assets.mern} alt="" className="mx-auto w-2/4" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
