import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Truck, PackageSearch, MapPin, FileText, User, LogOut,
  ClipboardList, ShieldCheck, Radar, Users, Menu, X, Package,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const clientLinks = [
  { to: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/client/book-transport", label: "Book Transport", icon: Truck },
  { to: "/client/my-orders", label: "My Orders", icon: PackageSearch },
  { to: "/client/track-order", label: "Track Order", icon: MapPin },
  { to: "/client/documents", label: "Documents", icon: FileText },
  { to: "/client/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/payment-verification", label: "Payment Verification", icon: ShieldCheck },
  { to: "/admin/live-tracking", label: "Live Tracking", icon: Radar },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = user?.role === "admin" ? adminLinks : clientLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const content = (
    <>
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-[15px] leading-tight truncate">Aayush Logistics</p>
          <p className="text-slate-400 text-[11px] leading-tight">Move Today. A Better Tomorrow.</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-navy-light hover:text-white"
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-navy-light/60">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0 border border-primary/30">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <span className={`inline-block text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded ${user?.role === "admin" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
              {user?.role === "admin" ? "ADMIN" : "CLIENT"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-navy-light hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-navy z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <span className="text-white font-semibold text-sm">Aayush Logistics</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-white p-1.5">
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-navy z-20">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-72 h-full bg-navy z-50">
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-slate-400">
              <X size={20} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
