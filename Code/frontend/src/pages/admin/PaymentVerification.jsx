import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import api from "../../api/axios";

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace("/api", "");

const PaymentVerification = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payments/pending");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (orderId) => {
    try {
      const res = await api.put(`/payments/${orderId}/verify`);
      toast.success(res.data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/payments/${rejectTarget}/reject`, { reason: rejectReason || "Payment could not be verified" });
      toast.success("Payment rejected");
      setRejectTarget(null);
      setRejectReason("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    }
  };

  return (
    <DashboardLayout>
      <Header title="Payment Verification" subtitle="Pending Approvals" />

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div className="card">
          <EmptyState icon={CheckCircle2} title="All caught up!" subtitle="There are no pending payment verifications right now." />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {orders.map((o) => (
            <div key={o._id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-navy">{o.clientId?.name}</p>
                  <p className="text-xs text-slate-400 font-mono">Order #{o._id.slice(-6).toUpperCase()}</p>
                </div>
                <p className="text-lg font-bold text-navy">₹{o.estimatedAmount?.toLocaleString("en-IN")}</p>
              </div>

              <div className="text-sm text-slate-600 space-y-1 mb-4">
                <p><span className="text-slate-400">Route:</span> {o.pickupDetails.city} → {o.deliveryDetails.city}</p>
                <p><span className="text-slate-400">Method:</span> {o.paymentMethod}</p>
                <p><span className="text-slate-400">Reference ID:</span> {o.paymentReference || "—"}</p>
              </div>

              <div className="mb-4">
                {o.paymentScreenshot ? (
                  <img src={`${API_ORIGIN}${o.paymentScreenshot}`} alt="Payment screenshot" className="rounded-lg border border-slate-200 max-h-48 object-cover w-full" />
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 h-24 flex items-center justify-center text-slate-400 text-xs gap-2">
                    <ImageOff size={16} /> No screenshot uploaded
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleVerify(o._id)} className="btn-primary text-sm flex-1 flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={15} /> Verify Payment
                </button>
                <button onClick={() => setRejectTarget(o._id)} className="btn-danger text-sm flex-1 flex items-center justify-center gap-1.5">
                  <XCircle size={15} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-navy font-semibold mb-3">Reject Payment</h3>
            <label className="label-text">Rejection Reason</label>
            <textarea rows={3} className="input-field mb-4" placeholder="e.g. Screenshot unclear, amount mismatch..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="btn-outline text-sm">Cancel</button>
              <button onClick={handleReject} className="btn-danger text-sm">Reject Payment</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentVerification;
