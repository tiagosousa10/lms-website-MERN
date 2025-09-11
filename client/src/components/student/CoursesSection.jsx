import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="w-full mx-auto px-4 py-16">
      {/* Header */}
      <header className="max-w-[680px] mx-auto text-center mb-12">
        <h2 className="text-3xl font-medium text-[#0e0e0e]">
          Aprende com os melhores
        </h2>
        <p className="mt-4 text-base font-normal text-[#565656] leading-normal">
          Descobre os nossos cursos mais bem avaliados em várias categorias.
          Desde programação e design até negócios e bem-estar, os nossos cursos
          são criados para gerar resultados.
        </p>
      </header>

      {/* Grid de cursos (mesma lógica: mostra 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ml-8 mb-12">
        {allCourses.slice(0, 4).map((course, idx) => (
          <CourseCard key={course._id ?? idx} course={course} />
        ))}
      </div>

      {/* CTA "Ver todos os cursos" com estilo outline da marca */}
      <div className="flex justify-center">
        <Button
          asChild
          variant="outline"
          className="h-auto px-6 py-2 rounded-[5px] border-[#213448] text-[#213448] hover:bg-[#213448] hover:text-white"
        >
          <Link to="/course-list">Ver todos os Cursos</Link>
        </Button>
      </div>
    </section>
  );
};

export default CoursesSection;
