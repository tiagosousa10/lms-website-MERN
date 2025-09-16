import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import { CATEGORIES } from "../../constants/categories";

const CoursesList = () => {
  const { navigate, allCourses = [], fetchAllCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [category, setCategory] = useState("");

  // carregar cursos no arranque
  useEffect(() => {
    fetchAllCourses?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch ao mudar categoria (server-side filter, se suportado)
  useEffect(() => {
    fetchAllCourses?.({ category: category || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // filtro client-side por título (param de rota)
  useEffect(() => {
    const list = Array.isArray(allCourses) ? allCourses : [];
    const filtered = input
      ? list.filter((it) =>
          it.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      : list.slice();
    setFilteredCourses(filtered);
  }, [allCourses, input]);

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header + filtros */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Lista de Cursos
            </h1>
            <p className="text-gray-500">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-600 underline"
              >
                Início
              </button>{" "}
              / <span>Lista de Cursos</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Categoria */}
            <label className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Categoria:
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-shadow outline-none shadow-sm"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* SearchBar */}
            <SearchBar data={input} />
          </div>
        </div>

        {/* chips de limpeza */}
        <div className="flex flex-wrap gap-2 pt-6">
          {input && (
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 border text-gray-600 rounded-md"
              onClick={() => navigate("/course-list")}
              title="Limpar pesquisa"
            >
              <span className="truncate max-w-[12ch]">{input}</span>
              <img src={assets.cross_icon} alt="" className="w-4 h-4" />
            </button>
          )}
          {category && (
            <button
              className="inline-flex items-center gap-2 px-3 py-1.5 border text-gray-600 rounded-md"
              onClick={() => setCategory("")}
              title="Limpar categoria"
            >
              <span className="truncate max-w-[14ch]">{category}</span>
              <img src={assets.cross_icon} alt="" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* grelha de cursos */}
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Sem resultados para os filtros aplicados.
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CoursesList;
