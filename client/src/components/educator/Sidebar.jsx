import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: "Painel de Controlo", path: "/educator", icon: assets.home_icon },
    {
      name: "Adicionar Curso",
      path: "/educator/add-course",
      icon: assets.add_icon,
    },
    {
      name: "Os Meus Cursos",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Alunos Inscritos",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    isEducator && (
      <aside className="w-64 bg-base-200 border-r border-base-300 hidden md:flex flex-col h-screen sticky top-0">
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/educator"}
              className={({ isActive }) =>
                `btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  isActive ? "btn-active" : ""
                }`
              }
            >
              <img
                src={item.icon}
                alt={`Ícone de ${item.name}`}
                className="w-5 h-5 opacity-70"
              />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    )
  );
};

export default Sidebar;
