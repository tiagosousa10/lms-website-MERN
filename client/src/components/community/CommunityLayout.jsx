import { Outlet } from "react-router-dom";
import CommunitySideBar from "./CommunitySideBar";

const CommunityLayout = ({ showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <CommunitySideBar />}

        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
