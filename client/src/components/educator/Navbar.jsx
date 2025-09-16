import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { StepBack, Menu as MenuIcon } from "lucide-react";
import { SidebarContent } from "./Sidebar";
// shadcn/ui
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../../components/ui/sheet";

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <nav
      className="w-full bg-[#213448] text-white/95 shadow-sm"
      aria-label="Barra superior"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra principal */}
        <div className="h-[74px] flex items-center justify-between gap-4">
          {/* ESQUERDA: logo + hambúrguer (mobile) */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Drawer em <lg> */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-11 w-11 rounded-md border border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Abrir menu"
                    aria-haspopup="dialog"
                  >
                    <MenuIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SheetHeader className="px-4 py-3 border-b">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="h-[calc(100vh-3.25rem)] flex flex-col">
                    <SidebarContent />
                    <div className="p-3">
                      <SheetClose asChild>
                        <button
                          className="w-full h-11 rounded-md border border-slate-300 text-slate-800 hover:bg-slate-50"
                          aria-label="Fechar menu"
                        >
                          Fechar
                        </button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo / Brand */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-90"
              aria-label="Ir para a página inicial"
            >
              <span className="avatar">
                <span className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/30 inline-block">
                  <img
                    src="/logo.jpg"
                    alt="tsAcademy"
                    className="object-cover w-full h-full"
                  />
                </span>
              </span>
              <span className="font-semibold text-2xl tracking-tight">
                tsACADEMY
              </span>
            </button>
          </div>

          {/* DIREITA: ações do utilizador */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-md border border-white/40 px-3 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <StepBack className="h-5 w-5" aria-hidden="true" />
                  Voltar
                </button>

                <p className="hidden md:block text-sm text-white/80">
                  Olá! {user.fullName}
                </p>

                {/* Clerk UserButton (customizável via appearance) */}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "rounded-full",
                      userButtonTrigger: "h-10 w-10", // tamanho alvo confortável
                    },
                  }}
                />
              </>
            ) : (
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center h-11 px-4 rounded-md border border-white/40 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Iniciar sessão
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
