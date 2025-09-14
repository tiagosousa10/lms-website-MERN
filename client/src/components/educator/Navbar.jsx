import React from "react";
import { assets } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { StepBack } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#213448] text-white/95 shadow-sm">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* Barra principal */}
        <div className="h-[74px] flex items-center justify-between gap-4">
          {/* ESQUERDA: logo/brand */}
          <div className="flex items-center gap-3 lg:gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-90"
            >
              <div className="avatar">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/30">
                  <img
                    src="/logo.jpg"
                    alt="tsAcademy"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="font-semibold text-2xl tracking-tight">
                tsACADEMY
              </span>
            </button>
          </div>

          {/* DIREITA: ações do utilizador */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/")}
                  className="hidden sm:flex items-center gap-2 rounded-md border border-white/40 px-3 py-2 text-sm hover:bg-white/10 transition"
                >
                  <StepBack className="h-5 w-5" />
                  Voltar
                </button>

                <p className="hidden md:block text-sm text-white/80">
                  Olá! {user.fullName}
                </p>

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
              <div className="avatar">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/30">
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
      </div>
    </nav>
  );
};

export default Navbar;
