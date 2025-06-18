import React from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const CommunitySideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to={"/"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Início</span>
        </Link>

        <Link
          to={"/friends"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Amigos</span>
        </Link>

        <Link
          to={"/notifications"}
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notificações</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={assets.profile_img} alt="avatar do utilizador" />
            </div>
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm">Tiago Sousa</p>
            <p className="text-xs text-success flex items-center gap-1 ">
              <span className="size-2 rounded-full bg-success inline-block">
                Online
              </span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CommunitySideBar;
