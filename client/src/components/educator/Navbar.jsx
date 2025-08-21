import React from "react";
import { assets } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { StepBack } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm px-6 md:px-20">
      {/* INÍCIO NAVBAR - LOGO */}
      <div className="navbar-start">
        <Link to={"/"} className="flex items-center gap-3">
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
        </Link>
      </div>

      {/* FIM NAVBAR - Autenticação */}
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-6">
            <div>
              <button
                onClick={() => navigate("/")}
                className="btn btn-outline btn-sm flex items-center gap-2 normal-case"
              >
                <StepBack className="h-5 w-5" />
                Voltar
              </button>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-sm">
                Olá! {user ? user.fullName : "Professor"}
              </p>
              <UserButton />
            </div>
          </div>
        ) : (
          <div className="avatar">
            <div className="w-8 rounded-full overflow-hidden">
              <img
                src={assets.profile_img}
                alt="perfil"
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
