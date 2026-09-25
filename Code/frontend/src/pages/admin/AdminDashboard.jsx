import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Package, ShieldAlert, Truck, CheckCircle2, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import StatusChip from "../../components/StatusChip";
import Loader from "../../components/Loader";
import api from "../../api/axios";

const COLORS = ["#94A3B8", "#2563EB", "#9333EA", "#F59E0B", "#16A34A", "#DC2626"];

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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([api.get("/stats/admin"), api.get("/orders")]);
        setStats(statsRes.data.stats);
        setBreakdown(statsRes.data.statusBreakdown);
        setOrdersByMonth(statsRes.data.ordersByMonth);
        setRecent(ordersRes.data.orders.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <Header title="Admin Dashboard" subtitle="Operations Overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <SummaryCard icon={Users} label="Total Clients" value={stats?.totalClients ?? 0} tint="text-primary" bg="bg-blue-50" />
        <SummaryCard icon={Package} label="Total Orders" value={stats?.totalOrders ?? 0} tint="text-navy" bg="bg-slate-100" />
        <SummaryCard icon={ShieldAlert} label="Pending Verifications" value={stats?.pendingPayments ?? 0} tint="text-accent" bg="bg-amber-50" />
        <SummaryCard icon={Truck} label="Active Deliveries" value={stats?.activeDeliveries ?? 0} tint="text-purple-600" bg="bg-purple-50" />
        <SummaryCard icon={CheckCircle2} label="Delivered Orders" value={stats?.delivered ?? 0} tint="text-success" bg="bg-green-50" />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => navigate("/admin/payment-verification")} className="btn-primary text-sm">Verify Payments</button>
        <button onClick={() => navigate("/admin/orders")} className="btn-outline text-sm">Update Shipment Status</button>
        <button onClick={() => navigate("/admin/live-tracking")} className="btn-outline text-sm">Add Tracking Update</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-semibold text-navy mb-4">Orders by Month</h2>
          {ordersByMonth.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-navy mb-4">Status Distribution</h2>
          {breakdown.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={breakdown} dataKey="count" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {breakdown.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy">Recent Booking Requests</h2>
          <button onClick={() => navigate("/admin/orders")} className="text-sm text-primary font-medium">View All</button>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="px-5 py-2 font-medium">Client</th>
                <th className="px-5 py-2 font-medium">Route</th>
                <th className="px-5 py-2 font-medium">Amount</th>
                <th className="px-5 py-2 font-medium">Payment</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-navy">{o.clientId?.name}</td>
                  <td className="px-5 py-3 text-slate-600">{o.pickupDetails.city} → {o.deliveryDetails.city}</td>
                  <td className="px-5 py-3 text-slate-600">₹{o.estimatedAmount?.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3"><StatusChip status={o.paymentStatus} /></td>
                  <td className="px-5 py-3"><StatusChip status={o.shipmentStatus} /></td>
                  <td className="px-5 py-3">
                    <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="text-primary text-sm font-medium flex items-center gap-1">
                      <MapPin size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
