import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import { GraduationCap } from "lucide-react";

// ⬇️ importa os componentes do shadcn/ui
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"; // precisa do componente adicionado pelo CLI

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) return navigate("/educator");
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
    <div className="navbar bg-base-100 shadow-sm z-10 px-6 md:px-20 justify-between gap-12  ">
      {/* START */}
      <div className="navbar-start flex   ">
        {/* Mobile menu (mantemos) */}
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
                    {isEducator ? "Área do Professor" : "Quero Ensinar"}
                  </button>
                </li>
                <li>
                  <Link to="/course-list">Explorar Cursos</Link>
                </li>
                <li>
                  <Link to="/my-enrollments">Meu Aprendizado</Link>
                </li>
                <li>
                  <Link to="/community">Comunidade</Link>
                </li>
                <li>
                  <Link to="/about">Sobre nós</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Logo */}
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

        {/* SearchBar desktop */}
        {user && (
          <div className="hidden lg:flex lg:ml-6 lg:w-96 transition-all duration-300 ease-in-out">
            <SearchBar />
          </div>
        )}
      </div>
      {/* NAVBAR CENTER — shadcn/ui NavigationMenu */}
      <div className="navbar-center hidden lg:flex ml-24 ">
        {user && (
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {/* Links simples */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  style={{
                    color: "white",
                    background: "none",
                    border: "1px solid white",
                  }}
                >
                  <Link to="/course-list">Explorar Cursos</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/my-enrollments">Meu Aprendizado</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Dropdown: Comunidade */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Comunidade</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-2 p-3">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/community"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">Inicio</div>
                          <p className="text-xs text-muted-foreground">
                            Explora a atividade da comunidade.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/community/notifications"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">
                            Notificações
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Pedidos e atualizações.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/community/friends"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">Amigos</div>
                          <p className="text-xs text-muted-foreground">
                            Mensagens, remover e gerir amizades.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/community/testimonies"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">Testemunhos</div>
                          <p className="text-xs text-muted-foreground">
                            Partilha a tua experiência.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Dropdown: Sobre nós */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Sobre nós</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-2 p-3">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/about"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">A Equipa</div>
                          <p className="text-xs text-muted-foreground">
                            Quem somos e o que fazemos.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/about/mission"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">
                            Missão & Valores
                          </div>
                          <p className="text-xs text-muted-foreground">
                            O nosso propósito.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/contact"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">Contactos</div>
                          <p className="text-xs text-muted-foreground">
                            Fala connosco.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/faq"
                          className="block rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2"
                        >
                          <div className="text-sm font-medium">FAQ</div>
                          <p className="text-xs text-muted-foreground">
                            Dúvidas frequentes.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
      {/* END */}
      <div className="navbar-end flex gap-6  ">
        {user ? (
          <>
            <button
              onClick={becomeEducator}
              className="btn btn-outline btn-sm flex items-center gap-2 normal-case"
            >
              <GraduationCap className="h-5 w-5" />
              {isEducator ? "Área do Professor" : "Quero Ensinar"}
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
