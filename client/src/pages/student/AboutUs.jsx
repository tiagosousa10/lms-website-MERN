import React from "react";
import { Flag, Users, Heart, Calendar } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { assets } from "../../assets/assets";

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

// equipa (corrige variável 'name' inexistente)
const team = [
  {
    name: "Tiago Sousa",
    role: "CEO",
    photo: assets.about_us_tiago,
    bio: "Apaixonado por educação acessível e inovação pedagógica. Focado em criar experiências de aprendizagem impactantes.",
  },
];

export const AboutUs = () => {
  return (
    <div className="bg-white min-h-screen w-full">
      <div className="bg-white overflow-x-hidden mx-auto relative">
        {/* Hero / Sobre Nós */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-10 md:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="order-2 md:order-1">
              <h1 className="font-semibold text-[#37353e] text-3xl md:text-4xl mb-4">
                Sobre Nós
              </h1>
              <p className="text-black/80 text-[15px] leading-relaxed">
                A tsAcademy nasceu da paixão por educação acessível e de
                qualidade. Guiados por transparência, inovação e comunidade,
                ajudamos milhares de alunos a alcançarem os seus sonhos.
              </p>
            </div>

            <div className="order-1 md:order-2 mx-auto md:mx-0">
              <img
                className="w-72 h-72 md:w-[376px] md:h-[374px] object-contain"
                alt="Ilustração Sobre Nós"
                src={assets.about_us}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Cards de valores */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {featureCards.map(({ title, description, Icon }) => (
              <Card
                key={title}
                className="rounded-[10px] border border-[#547792] bg-white hover:shadow-md transition"
              >
                <CardContent className="h-full p-5 flex flex-col items-center justify-center gap-2 relative">
                  <div className="w-12 h-12 rounded-full bg-[#94b4c11a] border border-[#94b4c133] flex items-center justify-center absolute top-4">
                    <Icon
                      className="w-6 h-6 text-[#547792]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="pt-12 text-center">
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

        {/* Equipa */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="font-semibold text-[#37353e] text-2xl md:text-3xl mb-6 md:mb-8">
            A Nossa Equipa
          </h2>

          <div className="bg-[#213448] rounded-[12px] border border-[#ecefca33] p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center">
              {team.map((m) => (
                <div
                  key={m.name}
                  className="text-center bg-[#1a2a3a] rounded-[10px] border border-[#ecefca1f] p-5"
                >
                  <div className="mx-auto mb-4">
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="font-semibold text-white">{m.name}</h3>
                  <p className="text-sm text-white/70">{m.role}</p>
                </div>
              ))}

              <div className="px-2 py-2 lg:px-4 lg:py-4">
                <p className="text-white text-base md:text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
                <div className="mt-6">
                  <img
                    src={assets.mern}
                    alt="Stack MERN"
                    className="mx-auto w-40 md:w-64 object-contain"
                  />
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
