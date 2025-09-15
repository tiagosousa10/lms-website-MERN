import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import { CATEGORIES } from "../../constants/categories";

const CoursesList = () => {
  const { navigate, allCourses, fetchCategories, fetchAllCourses } =
    useContext(AppContext);

  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState("");

  // carregar categorias e cursos (sem filtro) no arranque
  useEffect(() => {
    fetchCategories?.();
    fetchAllCourses?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAllCourses({ category: category || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // filtrar por título no cliente (com base em `input`)
  useEffect(() => {
    if (Array.isArray(allCourses) && allCourses.length > 0) {
      const list = input
        ? allCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        : allCourses.slice();

      setFilteredCourses(list);
    } else {
      setFilteredCourses([]);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="h-full md:px-36 px-8 py-20 text-left">
        <div className="flex md:flex-row flex-col items-start gap-6 justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Lista de Cursos
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Início
              </span>{" "}
              / <span>Lista de Cursos</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Filtro por categoria */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="category"
                className="text-sm text-gray-600 whitespace-nowrap"
              >
                Categoria:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-shadow outline-none shadow-sm"
              >
                <option value="">Todas</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* SearchBar existente */}
            <SearchBar data={input} />
          </div>
        </div>

        {/* “chip” para limpar busca pelo título */}
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600 rounded-md">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt="Ícone de fechar"
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        {/* “chip” para limpar a categoria */}
        {selectedCategory && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600 rounded-md ml-3">
            <p>{selectedCategory}</p>
            <img
              src={assets.cross_icon}
              alt="Limpar categoria"
              className="cursor-pointer"
              onClick={() => setSelectedCategory("")}
            />
          </div>
        )}

        <div className="flex flex-row">
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 my-16 md:px-0 gap-8 mx-auto w-full">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}

            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">
                Sem resultados para os filtros aplicados.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursesList;
