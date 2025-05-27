import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-home-heading-large text-home-heading-small font-bold relative text-gray-800 max-w-3xl mx-auto">
        Potencia o teu futuro com cursos desenhados para{" "}
        <span className="text-blue-600"> se adaptarem às tuas escolhas. </span>
        <img
          src={assets.sketch}
          alt="esboço"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
        Reunimos instrutores de classe mundial, conteúdo interativo e uma
        comunidade de apoio para te ajudar a alcançar os teus objetivos pessoais
        e profissionais.
      </p>

      <p className="md:hidden text-gray-500 max-w-sm mx-auto">
        Reunimos instrutores de classe mundial para te ajudar a alcançar os teus
        objetivos profissionais.
      </p>

      <SearchBar />
    </div>
  );
};

export default Hero;
