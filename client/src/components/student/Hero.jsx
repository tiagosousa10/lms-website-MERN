import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 py-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-[#f4f7fc] via-[#e8f0fb] to-[#dce9f8] ">
      <h1 className="md:text-5xl text-3xl font-bold text-base-content max-w-3xl mx-auto leading-snug relative">
        Potencia o teu futuro com cursos desenhados para{" "}
        <span className="text-primary">se adaptarem às tuas escolhas.</span>
        <img
          src={assets.sketch}
          alt="esboço"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-base-content/70 max-w-2xl mx-auto text-lg">
        Reunimos instrutores de classe mundial, conteúdo interativo e uma
        comunidade de apoio para te ajudar a alcançar os teus objetivos pessoais
        e profissionais.
      </p>

      <p className="md:hidden text-base-content/70 max-w-sm mx-auto text-base">
        Reunimos instrutores de classe mundial para te ajudar a alcançar os teus
        objetivos profissionais.
      </p>

      <SearchBar />
    </div>
  );
};

export default Hero;
