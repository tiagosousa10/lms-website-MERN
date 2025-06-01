import CommunitySideBar from "./CommunitySideBar";

const CommunityLayout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen ">
      <div className="flex">
        {showSidebar && <CommunitySideBar />}

        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
