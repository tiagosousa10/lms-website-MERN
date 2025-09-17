// components/student/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import { GraduationCap, Menu as MenuIcon } from "lucide-react";

// shadcn/ui
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const MobileMenu = ({ user, isEducator, becomeEducator }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center h-11 w-11 rounded-md border border-white/30 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:hidden"
          aria-label="Abrir menu"
          aria-haspopup="dialog"
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-72 bg-[#1d2c3c] text-white">
        <SheetHeader className="px-4 py-3 border-b border-white/10">
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>

        <nav className="p-3" aria-label="Navegação principal (mobile)">
          <ul className="space-y-1">
            {user ? (
              <>
                <li>
                  <SheetClose asChild>
                    <button
                      onClick={becomeEducator}
                      className="w-full text-left px-3 py-2 rounded hover:bg-white/10"
                    >
                      {isEducator ? "Área do Professor" : "Quero Ensinar"}
                    </button>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/course-list"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      Explorar Cursos
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/my-enrollments"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      Meu Aprendizado
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/community"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      Comunidade
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/about-us"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      Sobre nós
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/contact-us"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      Contactos
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/privacy-policy"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      Política de Privacidade
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      to="/faq"
                      className="block px-3 py-2 rounded hover:bg-white/10"
                    >
                      FAQ
                    </Link>
                  </SheetClose>
                </li>
              </>
            ) : (
              <li className="px-3 py-2 text-white/80">
                Inicia sessão para aceder aos menus
              </li>
            )}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/10">
          <SheetClose asChild>
            <button
              className="w-full h-11 rounded-md border border-white/30 hover:bg-white/10"
              aria-label="Fechar menu"
            >
              Fechar
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const { openSignIn, openSignUp } = useClerk();
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
        toast.success("Agora é Professor " + data.message);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav
      className="w-full bg-[#213448] text-white/95 shadow-sm"
      aria-label="Barra superior"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra principal */}
        <div className="h-[74px] flex items-center justify-between gap-4">
          {/* ESQUERDA: menu mobile + logo + pesquisa desktop */}
          <div className="flex items-center gap-3 lg:gap-6">
            <MobileMenu
              user={user}
              isEducator={isEducator}
              becomeEducator={becomeEducator}
            />

            {/* Logo / brand */}
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

            {/* SearchBar desktop */}
            {user && (
              <div className="hidden lg:flex">
                <div className="flex-1 px-2 py-2">
                  <SearchBar />
                </div>
              </div>
            )}
          </div>

          {/* CENTRO: navegação desktop */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to="/course-list" className="px-4 bg-transparent">
                      Explorar Cursos
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {user && (
                  <>
                    <span
                      className="mx-1 h-6 w-px bg-white/20"
                      aria-hidden="true"
                    />
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

                    <span
                      className="mx-1 h-6 w-px bg-white/20"
                      aria-hidden="true"
                    />

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
                                <div className="text-sm font-medium">
                                  Início
                                </div>
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
                                <div className="text-sm font-medium">
                                  Amigos
                                </div>
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
                  </>
                )}
                <span
                  className="mx-1 h-6 w-px bg-white/20"
                  aria-hidden="true"
                />

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 text-white/95 bg-transparent">
                    Sobre nós
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-2 p-3 bg-[#213448] text-white">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about-us"
                            className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
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
                            to="/contact-us"
                            className="block rounded-md p-3 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2"
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
          </div>

          {/* DIREITA: CTA / User */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <>
                <button
                  onClick={becomeEducator}
                  className="hidden sm:inline-flex items-center gap-2 rounded-md border border-white/40 px-3 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                  {isEducator ? "Área do Professor" : "Quero Ensinar"}
                </button>

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "rounded-full",
                      userButtonTrigger: "h-10 w-10", // alvo de toque confortável
                    },
                  }}
                />
              </>
            ) : (
              <button
                onClick={() => openSignIn()}
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#d3dad9]/80 bg-[#547792] px-4 py-2 text-[15px] text-white hover:text-black hover:bg-[#547792]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
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
