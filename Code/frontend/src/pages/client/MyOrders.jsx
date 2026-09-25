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

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await api.get("/orders", { params });
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <DashboardLayout>
      <Header title="My Orders" subtitle="Order History" />

      <form onSubmit={handleFilter} className="card flex flex-wrap items-end gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="label-text">Search LR / City</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input className="input-field pl-10" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="min-w-[160px]">
          <label className="label-text">Status</label>
          <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
          </select>
        </div>
        <div>
          <label className="label-text">From</label>
          <input type="date" className="input-field" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="label-text">To</label>
          <input type="date" className="input-field" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">Filter</button>
      </form>

      <div className="card">
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders found"
            subtitle="Try adjusting your filters, or book a new shipment."
            action={<button onClick={() => navigate("/client/book-transport")} className="btn-primary text-sm">Book Transport</button>}
          />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                  <th className="px-5 py-2 font-medium">LR Number</th>
                  <th className="px-5 py-2 font-medium">From → To</th>
                  <th className="px-5 py-2 font-medium">Goods Type</th>
                  <th className="px-5 py-2 font-medium">Amount</th>
                  <th className="px-5 py-2 font-medium">Payment</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 font-medium">Booking Date</th>
                  <th className="px-5 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-navy">{o.lrNumber || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">{o.pickupDetails.city} → {o.deliveryDetails.city}</td>
                    <td className="px-5 py-3 text-slate-600">{o.goodsDetails.category}</td>
                    <td className="px-5 py-3 text-slate-600">₹{o.estimatedAmount?.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3"><StatusChip status={o.paymentStatus} /></td>
                    <td className="px-5 py-3"><StatusChip status={o.shipmentStatus} /></td>
                    <td className="px-5 py-3 text-slate-500">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => navigate(`/client/orders/${o._id}`)} className="text-primary text-sm font-medium">View Details</button>
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

export default MyOrders;
