import { useEffect, useState } from "react";
import { Users, Mail, Phone } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import api from "../../api/axios";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/clients").then((res) => setClients(res.data.clients)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <Header title="Clients" subtitle="Registered Clients" />
      <div className="card">
        {loading ? (
          <Loader />
        ) : clients.length === 0 ? (
          <EmptyState icon={Users} title="No clients registered yet" />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                  <th className="px-5 py-2 font-medium">Client</th>
                  <th className="px-5 py-2 font-medium">Email</th>
                  <th className="px-5 py-2 font-medium">Phone</th>
                  <th className="px-5 py-2 font-medium">Orders</th>
                  <th className="px-5 py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center font-semibold text-xs">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-navy">{c.name}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 flex items-center gap-1.5"><Mail size={13} className="text-slate-400" />{c.email}</td>
                    <td className="px-5 py-3 text-slate-600 flex items-center gap-1.5"><Phone size={13} className="text-slate-400" />{c.phone}</td>
                    <td className="px-5 py-3 text-slate-600">{c.orderCount}</td>
                    <td className="px-5 py-3 text-slate-500">{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Clients;
