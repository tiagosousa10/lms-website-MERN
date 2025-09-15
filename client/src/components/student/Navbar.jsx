import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import { GraduationCap, Menu, Search } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

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
        { headers: { Authorization: `Bearer ${token}` } }
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
    <nav className="w-full bg-[#213448] text-white/95 shadow-sm">
      <div className=" mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* Barra principal */}
        <div className="h-[74px] flex items-center justify-between gap-4">
          {/* ESQUERDA: menu mobile + logo + pesquisa desktop */}
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-square text-white"
              >
                <Menu className="h-5 w-5" />
              </div>
              {/* dropdown mobile */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-56 p-2 rounded-box bg-[#1d2c3c] text-white shadow"
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

            {/* Logo + marca */}
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

            {/* SearchBar desktop (pill) */}
            {user && (
              <div className="hidden lg:flex">
                <div className="relative">
                  <div className="flex-1 px-2 py-2">
                    {/* Reaproveita o teu componente mas sem bordas */}
                    <SearchBar />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CENTRO: navegação desktop com separadores */}
          <div className="hidden lg:flex items-center">
            {user && (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {/* link 1 */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link
                        to="/course-list"
                        className="px-4 text-white/95  bg-transparent"
                      >
                        Explorar Cursos
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* separador */}
                  <span className="mx-1 h-6 w-px bg-white/20" />

                  {/* link 2 */}
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link
                        to="/my-enrollments"
                        className="px-4 bg-transparent"
                      >
                        Meu Aprendizado
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <span className="mx-1 h-6 w-px bg-white/20" />

                  {/* dropdown Comunidade */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 bg-transparent text-white/95">
                      Comunidade
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[320px] gap-2 p-3 bg-[#213448] text-white">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/community"
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
                            >
                              <div className="text-sm font-medium">Início</div>
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
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
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
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
                            >
                              <div className="text-sm font-medium">Amigos</div>
                              <p className="text-xs text-muted-foreground">
                                Mensagens e gestão de amizades.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/community/testimonies"
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
                            >
                              <div className="text-sm font-medium">
                                Testemunhos
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Partilha a tua experiência.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <span className="mx-1 h-6 w-px bg-white/20" />

                  {/* dropdown Sobre nós */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 text-white/95 bg-transparent">
                      Sobre nós
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[320px] gap-2 p-3 bg-[#213448] text-white ">
                        <li className=" ">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about-us"
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
                            >
                              <div className="text-sm font-medium">
                                A Equipa
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Quem somos e o que fazemos.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/contact-us"
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
                            >
                              <div className="text-sm font-medium">
                                Contactos
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Fala connosco.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/privacy-policy"
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
                            >
                              <div className="text-sm font-medium">
                                Política de Privacidade
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Termos e condições.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/faq"
                              className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
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

          {/* DIREITA: CTA / User */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={becomeEducator}
                  className="hidden sm:flex items-center gap-2 rounded-md border border-white/40 px-3 py-2 text-sm hover:bg-white/10 transition"
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
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#d3dad9]/80 bg-[#547792] px-4 py-2 text-[15px] text-white hover:text-black hover:bg-[#547792]/90 transition"
              >
                <GraduationCap className="h-5 w-5" />
                Criar Conta
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
