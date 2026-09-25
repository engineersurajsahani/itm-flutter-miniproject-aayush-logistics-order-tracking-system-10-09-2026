import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import StatusChip from "../../components/StatusChip";
import ShipmentTimeline from "../../components/ShipmentTimeline";
import TrackingMap from "../../components/TrackingMap";
import Loader from "../../components/Loader";
import ConfirmDialog from "../../components/ConfirmDialog";
import api from "../../api/axios";

const SHIPMENT_STATUSES = ["Booked", "Payment Verified", "Picked Up", "In Transit", "Delivered", "Cancelled"];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusValue, setStatusValue] = useState("");
  const [driverName, setDriverName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [eta, setEta] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.order);
        setHistory(res.data.trackingHistory);
        setStatusValue(res.data.order.shipmentStatus);
        setDriverName(res.data.order.driverName || "");
        setVehicleNumber(res.data.order.vehicleNumber || "");
        setEta(res.data.order.estimatedDeliveryDate ? res.data.order.estimatedDeliveryDate.slice(0, 10) : "");
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/orders/${id}/status`, { shipmentStatus: statusValue });
      toast.success(`Status updated to ${statusValue}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDetailsSave = async () => {
    setSaving(true);
    try {
      await api.put(`/orders/${id}`, { driverName, vehicleNumber, estimatedDeliveryDate: eta || undefined });
      toast.success("Order details updated");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    setShowCancel(false);
    try {
      await api.put(`/orders/${id}/status`, { shipmentStatus: "Cancelled" });
      toast.success("Order cancelled");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;
  if (!order) return <DashboardLayout><p className="text-slate-500">Order not found.</p></DashboardLayout>;

  const pickup = { name: order.pickupDetails.city, lat: order.pickupDetails.lat, lng: order.pickupDetails.lng };
  const delivery = { name: order.deliveryDetails.city, lat: order.deliveryDetails.lat, lng: order.deliveryDetails.lng };
  const current = order.currentLocation?.lat ? { name: order.currentLocation.name, lat: order.currentLocation.lat, lng: order.currentLocation.lng } : null;

  return (
    <DashboardLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 hover:text-navy">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">Order · {order.clientId?.name}</p>
          <h1 className="text-2xl font-bold text-navy">{order.lrNumber || "LR pending"}</h1>
        </div>
        <StatusChip status={order.shipmentStatus} />
      </div>

      <div className="card mb-6">
        <ShipmentTimeline currentStatus={order.shipmentStatus} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-navy">Sender Details</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p>{order.pickupDetails.contactName} · {order.pickupDetails.contactNumber}</p>
            <p>{order.pickupDetails.address}, {order.pickupDetails.city}</p>
          </div>
          <h2 className="font-semibold text-navy pt-2">Receiver Details</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p>{order.deliveryDetails.receiverName} · {order.deliveryDetails.receiverPhone}</p>
            <p>{order.deliveryDetails.address}, {order.deliveryDetails.city}</p>
          </div>
          <h2 className="font-semibold text-navy pt-2">Goods & Payment</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p>{order.goodsDetails.category} · {order.goodsDetails.weightKg} kg · {order.goodsDetails.numPackages} packages</p>
            <p>Vehicle: {order.vehicleType} · Amount: ₹{order.estimatedAmount?.toLocaleString("en-IN")}</p>
            <p className="flex items-center gap-2">Payment: <StatusChip status={order.paymentStatus} /></p>
          </div>
        </div>

        <div className="card space-y-5">
          <div>
            <h2 className="font-semibold text-navy mb-3">Change Shipment Status</h2>
            <div className="flex gap-2">
              <select className="input-field" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                {SHIPMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button onClick={handleStatusUpdate} disabled={saving} className="btn-primary shrink-0">Update</button>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-navy mb-3">Driver, Vehicle & Delivery ETA</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label-text">Driver Name</label>
                <input className="input-field" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
              </div>
              <div>
                <label className="label-text">Vehicle Number</label>
                <input className="input-field" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
              </div>
            </div>
            <label className="label-text">Estimated Delivery Date</label>
            <input type="date" className="input-field mb-3" value={eta} onChange={(e) => setEta(e.target.value)} />
            <button onClick={handleDetailsSave} disabled={saving} className="btn-outline text-sm w-full">Save Details</button>
          </div>

          {order.shipmentStatus !== "Cancelled" && order.shipmentStatus !== "Delivered" && (
            <button onClick={() => setShowCancel(true)} className="btn-danger text-sm w-full">Cancel Order</button>
          )}
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-semibold text-navy mb-4">Live Location</h2>
        <TrackingMap pickup={pickup} delivery={delivery} current={current} />
      </div>

      <div className="card">
        <h2 className="font-semibold text-navy mb-4">Tracking History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-400">No tracking updates yet.</p>
        ) : (
          <ul className="space-y-3">
            {history.slice().reverse().map((h) => (
              <li key={h._id} className="text-sm border-b border-slate-50 last:border-0 pb-3">
                <p className="font-medium text-navy">{h.status} · {h.locationName}</p>
                {h.remarks && <p className="text-xs text-slate-500">{h.remarks}</p>}
                <p className="text-xs text-slate-400">{new Date(h.updatedAt).toLocaleString("en-IN")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={showCancel}
        title="Cancel this order?"
        message="This will mark the shipment as cancelled and cannot be undone."
        confirmLabel="Cancel Order"
        onConfirm={handleCancel}
        onCancel={() => setShowCancel(false)}
      />
    </DashboardLayout>
  );
};

export default AdminOrderDetails;
