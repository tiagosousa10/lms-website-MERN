import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses = [] } = useContext(AppContext);

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <header className="max-w-[680px] mx-auto text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-medium text-[#0e0e0e]">
            Aprende com os melhores
          </h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base font-normal text-[#565656] leading-normal">
            Descobre os nossos cursos mais bem avaliados em várias categorias.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-10">
          {(allCourses || []).slice(0, 4).map((course, idx) => (
            <CourseCard key={course?._id ?? idx} course={course} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            asChild
            variant="outline"
            className="h-auto px-6 py-2 rounded-md border-[#213448] text-[#213448] hover:bg-[#213448] hover:text-white"
          >
            <Link to="/course-list">Ver todos os Cursos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
