import { Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({ title, subtitle }) => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search orders, tracking ID, or location..."
          />
        </div>
        <div className="flex-1" />
        <button className="relative p-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">
          <Bell className="w-4.5 h-4.5 text-slate-500" size={18} />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>

      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          {subtitle && <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{subtitle}</p>}
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-500">{today}</p>
          <p className="text-xs text-primary font-medium">Good things move forward</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
