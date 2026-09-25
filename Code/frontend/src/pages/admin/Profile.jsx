import { Mail, Phone, Shield, User } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
      <Icon className="w-4.5 h-4.5 text-accent" size={18} />
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-navy">{value}</p>
    </div>
  </div>
);

const AdminProfile = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <Header title="Profile" subtitle="Admin Account" />
      <div className="card max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-navy">{user?.name}</h2>
            <span className="inline-block text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded bg-amber-50 text-accent">ADMIN</span>
          </div>
        </div>
        <Row icon={Mail} label="Email Address" value={user?.email} />
        <Row icon={Phone} label="Phone Number" value={user?.phone} />
        <Row icon={Shield} label="Role" value="Administrator" />
        <Row icon={User} label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"} />
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
