import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

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
        backendUrl + "/api/educator/update-role",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm z-10 px-20">
      {/* INÍCIO NAVBAR - LOGO E DROPDOWN MOBILE */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                    {isEducator ? "Painel do Formador" : "Tornar-me Formador"}
                  </button>
                </li>
                <li>
                  <Link to="/my-enrollments">Os Meus Cursos</Link>
                </li>
                <li>
                  <Link to="/community">Comunidade</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="avatar">
            <div className="size-10 rounded-full overflow-hidden">
              <img
                src="logo.jpg"
                className="object-cover object-center w-full h-full cursor-pointer"
              />
            </div>
          </div>
          <span className="font-medium">tsAcademy</span>
        </div>
      </div>

      {/* CENTRO NAVBAR - LINKS DESKTOP */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <>
              <li>
                <button onClick={becomeEducator}>
                  {isEducator ? "Painel do Formador" : "Tornar-me Formador"}
                </button>
              </li>
              <li>
                <Link to="/my-enrollments">Os Meus Cursos</Link>
              </li>
              <li>
                <Link to="/community">Comunidade</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* FIM NAVBAR - AUTENTICAÇÃO */}
      <div className="navbar-end">
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="btn btn-primary normal-case"
          >
            Criar Conta
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
