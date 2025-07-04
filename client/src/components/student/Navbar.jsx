import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import { GraduationCap } from "lucide-react";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm z-10 px-6 md:px-20">
      {/* NAVBAR START: menu mobile + logo + SearchBar desktop */}
      <div className="navbar-start flex flex-wrap items-center gap-4 ">
        {/* Botão hamburger só no mobile */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
          >
            {user && (
              <>
                <li>
                  <button onClick={becomeEducator}>
                    {isEducator ? "Área de Formador" : "Quero Ensinar"}
                  </button>
                </li>
                <li>
                  <Link to="/my-enrollments">Meu Aprendizado</Link>
                </li>
                <li>
                  <Link to="/community">Comunidade</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Logo sempre visível */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="avatar">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src="logo.jpg" alt="tsAcademy" className="object-cover" />
            </div>
          </div>
          <span className="font-medium text-lg">tsAcademy</span>
        </div>

        {/* SearchBar apenas em desktop, com animação de entrada */}
        {user && (
          <div className=" hidden lg:flex lg:ml-6 lg:w-96  transition-all duration-300 ease-in-out ">
            <SearchBar />
          </div>
        )}
      </div>

      {/* NAVBAR CENTER: links desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2 ml-20">
          {user && (
            <>
              <li>
                <Link to="/course-list">Explorar Cursos</Link>
              </li>
              <li>
                <Link to="/my-enrollments">Meu Aprendizado</Link>
              </li>
              <li>
                <Link to="/community">Comunidade</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* NAVBAR END: autenticação */}
      <div className="navbar-end flex items-center space-x-10">
        {user ? (
          <>
            <button
              onClick={becomeEducator}
              className="btn btn-outline btn-sm flex items-center gap-2 normal-case"
            >
              <GraduationCap className="h-5 w-5" />
              {isEducator ? "Área de Formador" : "Quero Ensinar"}
            </button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "rounded-full",
                  userButtonAnchor: "btn btn-ghost btn-circle",
                },
              }}
            />
          </>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="btn btn-primary normal-case flex items-center gap-2"
          >
            <GraduationCap className="h-5 w-5" />
            Criar Conta
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
