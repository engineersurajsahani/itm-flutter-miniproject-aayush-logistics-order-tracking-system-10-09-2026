import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="lg:ml-64 pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10 max-w-[1600px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
