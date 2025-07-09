import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const CommunitySideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <aside className="w-64  border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to={"/community"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/community" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Início</span>
        </Link>

        <Link
          to={"/community/notifications"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/community/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notificações</span>
        </Link>

        <Link
          to={"/community/friends"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/community/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Amigos</span>
        </Link>
      </nav>
    </aside>
  );
};

export default CommunitySideBar;
