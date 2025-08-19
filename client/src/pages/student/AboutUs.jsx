// AboutUs.jsx
import React from "react";
import { Flag, Users, Heart, Calendar } from "lucide-react"; // 🌟 Certifica-te que os ícones existem

const AboutUs = () => {
  return (
    <div className=" min-h-screen px-6 md:px-20 py-12 space-y-12 bg-gradient-to-b from-[#f4f7fc] via-[#e8f0fb] to-[#dce9f8] ">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-base-content">Sobre Nós</h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          A tsAcademy nasceu da paixão por educação acessível e de qualidade.
          Guiados pelos valores de transparência, inovação e comunidade,
          ajudamos milhares de alunos a alcançarem os seus sonhos.
        </p>
      </section>

      {/* Valores / Missão */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div className="flex flex-col items-center p-6 bg-base-100 rounded-lg shadow">
          <Flag className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Nossa Missão</h3>
          <p className="text-base-content/70 mt-2">
            Educar. Inspirar. Transformar.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-base-100 rounded-lg shadow">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Quem Somos</h3>
          <p className="text-base-content/70 mt-2">
            Professores experientes dedicados ao teu sucesso.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-base-100 rounded-lg shadow">
          <Heart className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold">O Que Valorizamos</h3>
          <p className="text-base-content/70 mt-2">
            Integridade, suporte e melhoria contínua.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-base-100 rounded-lg shadow">
          <Calendar className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold">A Nossa História</h3>
          <p className="text-base-content/70 mt-2">
            Lançados em 2021, já formámos +5.000 alunos.
          </p>
        </div>
      </section>

      {/* Equipa */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-base-content text-center">
          A Nossa Equipa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {["Ana", "Bruno", "Carla", "Diogo"].map((name) => (
            <div
              key={name}
              className="p-4 bg-base-100 rounded-lg shadow text-center"
            >
              <div className="avatar mx-auto mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${name}`} alt={name} />
                </div>
              </div>
              <h3 className="font-semibold">{name} Silva</h3>
              <p className="text-sm text-base-content/70">Professor</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-base-100 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-base-content mb-6 text-center">
          A Nossa Viagem
        </h2>
        <div className="relative border-l-2 border-base-300 pl-8 space-y-8">
          {[
            { year: "2021", text: "Fundação da tsAcademy" },
            { year: "2022", text: "Primeiros 1.000 alunos" },
            { year: "2023", text: "Lançamento do módulo de comunidade" },
            { year: "2024", text: "Parcerias internacionais" },
          ].map((evt) => (
            <div key={evt.year} className="relative">
              <div className="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                {evt.year}
              </div>
              <p className="text-base-content/70 ml-4">{evt.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <button className="btn btn-primary btn-lg px-8">
          Junte-se à Nossa Comunidade
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
