import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export const SidebarContent = () => {
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
    <nav
      className="flex-1 p-3 sm:p-4 space-y-1"
      aria-label="Navegação do educador"
    >
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === "/educator"}
          className={({ isActive }) =>
            [
              "w-full inline-flex items-center gap-3 px-3 h-11 rounded-md transition",
              "hover:bg-slate-100",
              isActive ? "bg-slate-100 font-medium" : "bg-transparent",
            ].join(" ")
          }
        >
          <img
            src={item.icon}
            alt=""
            className="w-5 h-5 opacity-70"
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  if (!isEducator) return null;

  return (
    <aside
      className="hidden lg:flex w-64 lg:w-72 border-r border-slate-200 flex-col sticky top-0 h-screen bg-white"
      role="complementary"
      aria-label="Sidebar"
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
