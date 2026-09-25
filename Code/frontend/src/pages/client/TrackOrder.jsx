import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import StatusChip from "../../components/StatusChip";
import ShipmentTimeline from "../../components/ShipmentTimeline";
import TrackingMap from "../../components/TrackingMap";
import api from "../../api/axios";

const TrackOrder = () => {
  const [lr, setLr] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!lr.trim()) return;
    setLoading(true);
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${lr.trim()}`);
      setOrder(res.data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || "Shipment not found");
    } finally {
      setLoading(false);
    }
  };

  const pickup = order ? { name: order.pickupDetails.city, lat: order.pickupDetails.lat, lng: order.pickupDetails.lng } : null;
  const delivery = order ? { name: order.deliveryDetails.city, lat: order.deliveryDetails.lat, lng: order.deliveryDetails.lng } : null;
  const current = order?.currentLocation?.lat ? { name: order.currentLocation.name, lat: order.currentLocation.lat, lng: order.currentLocation.lng } : null;

  return (
    <DashboardLayout>
      <Header title="Track Order" subtitle="Shipment Tracking" />

      <form onSubmit={handleTrack} className="card flex flex-wrap gap-3 items-end mb-6">
        <div className="flex-1 min-w-[220px]">
          <label className="label-text">Enter LR Number</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input className="input-field pl-10" placeholder="e.g. ALR-2026-0001" value={lr} onChange={(e) => setLr(e.target.value)} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? "Tracking..." : "Track"}</button>
      </form>

      {order && (
        <>
          <div className="card mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400 uppercase font-medium mb-1">LR Number</p>
              <h1 className="text-xl font-bold text-navy">{order.lrNumber}</h1>
              <p className="text-sm text-slate-500 mt-1">{order.pickupDetails.city} → {order.deliveryDetails.city}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusChip status={order.shipmentStatus} />
              <button onClick={() => navigate(`/client/orders/${order._id}`)} className="text-primary text-sm font-medium">Full Details</button>
            </div>
          </div>

          <div className="card mb-6">
            <ShipmentTimeline currentStatus={order.shipmentStatus} />
          </div>

          <div className="card">
            <h2 className="font-semibold text-navy mb-4">Live Location</h2>
            <TrackingMap pickup={pickup} delivery={delivery} current={current} />
            {order.currentLocation?.name && (
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                <MapPin size={15} className="text-accent" />
                <span>Current: {order.currentLocation.name}</span>
                <span className="text-slate-400">· Updated {new Date(order.currentLocation.updatedAt).toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default TrackOrder;
