import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle2, CreditCard, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import StatusChip from "../../components/StatusChip";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const SummaryCard = ({ icon: Icon, label, value, tint, bg }) => (
  <div className="card flex items-start gap-4">
    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
      <Icon className={`w-5 h-5 ${tint}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-navy mt-0.5">{value}</p>
    </div>
  </div>
);

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/stats/client"),
          api.get("/orders"),
        ]);
        setStats(statsRes.data.stats);
        setBreakdown(statsRes.data.statusBreakdown);
        setOrders(ordersRes.data.orders.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <Header title={`Welcome back, ${user?.name?.split(" ")[0]}`} subtitle="Client Dashboard" />
      <p className="text-slate-500 -mt-4 mb-6 text-sm">Here's what's happening with your shipments today.</p>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard icon={Package} label="Total Orders" value={stats?.total ?? 0} tint="text-primary" bg="bg-blue-50" />
            <SummaryCard icon={Truck} label="Active Shipments" value={stats?.active ?? 0} tint="text-accent" bg="bg-amber-50" />
            <SummaryCard icon={CheckCircle2} label="Delivered Orders" value={stats?.delivered ?? 0} tint="text-success" bg="bg-green-50" />
            <SummaryCard icon={CreditCard} label="Pending Payment" value={stats?.pendingPayment ?? 0} tint="text-purple-600" bg="bg-purple-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy">Recent Orders</h2>
                <button onClick={() => navigate("/client/my-orders")} className="text-sm text-primary font-medium flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </button>
              </div>

              {orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  subtitle="Book your first shipment to see it here."
                  action={<button onClick={() => navigate("/client/book-transport")} className="btn-primary text-sm">Book Transport</button>}
                />
              ) : (
                <div className="overflow-x-auto -mx-5">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                        <th className="px-5 py-2 font-medium">LR Number</th>
                        <th className="px-5 py-2 font-medium">Route</th>
                        <th className="px-5 py-2 font-medium">Goods</th>
                        <th className="px-5 py-2 font-medium">Status</th>
                        <th className="px-5 py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                          <td className="px-5 py-3 font-medium text-navy">{o.lrNumber || "—"}</td>
                          <td className="px-5 py-3 text-slate-600">{o.pickupDetails.city} → {o.deliveryDetails.city}</td>
                          <td className="px-5 py-3 text-slate-600">{o.goodsDetails.category}</td>
                          <td className="px-5 py-3"><StatusChip status={o.shipmentStatus} /></td>
                          <td className="px-5 py-3">
                            <button onClick={() => navigate(`/client/orders/${o._id}`)} className="text-primary text-sm font-medium">Track</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button onClick={() => navigate("/client/book-transport")} className="btn-primary text-sm mt-5 w-full sm:w-auto">
                Book New Transport
              </button>
            </div>

            <div className="card">
              <h2 className="font-semibold text-navy mb-4">Orders by Status</h2>
              {breakdown.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10">No data to display yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={breakdown} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                    <YAxis type="category" dataKey="status" width={100} tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ClientDashboard;
