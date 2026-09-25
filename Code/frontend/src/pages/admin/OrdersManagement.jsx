import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import StatusChip from "../../components/StatusChip";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import api from "../../api/axios";

const STATUS_OPTIONS = ["", "Booked", "Payment Verified", "Picked Up", "In Transit", "Delivered", "Cancelled"];

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await api.get("/orders", { params });
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <DashboardLayout>
      <Header title="Orders Management" subtitle="All Orders" />

      <form onSubmit={(e) => { e.preventDefault(); fetchOrders(); }} className="card flex flex-wrap items-end gap-3 mb-6">
        <div className="flex-1 min-w-[220px]">
          <label className="label-text">Search LR / City / Client</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input className="input-field pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
          </div>
        </div>
        <div className="min-w-[180px]">
          <label className="label-text">Shipment Status</label>
          <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary">Filter</button>
      </form>

      <div className="card">
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders found" subtitle="Try adjusting the filters above." />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                  <th className="px-5 py-2 font-medium">Order ID</th>
                  <th className="px-5 py-2 font-medium">LR Number</th>
                  <th className="px-5 py-2 font-medium">Client</th>
                  <th className="px-5 py-2 font-medium">Route</th>
                  <th className="px-5 py-2 font-medium">Goods</th>
                  <th className="px-5 py-2 font-medium">Amount</th>
                  <th className="px-5 py-2 font-medium">Payment</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs">{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3 font-medium text-navy">{o.lrNumber || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{o.clientId?.name}</td>
                    <td className="px-5 py-3 text-slate-600">{o.pickupDetails.city} → {o.deliveryDetails.city}</td>
                    <td className="px-5 py-3 text-slate-600">{o.goodsDetails.category}</td>
                    <td className="px-5 py-3 text-slate-600">₹{o.estimatedAmount?.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3"><StatusChip status={o.paymentStatus} /></td>
                    <td className="px-5 py-3"><StatusChip status={o.shipmentStatus} /></td>
                    <td className="px-5 py-3">
                      <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="text-primary text-sm font-medium">Manage</button>
                    </td>
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

export default OrdersManagement;
