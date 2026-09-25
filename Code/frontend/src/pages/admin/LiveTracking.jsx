import { useEffect, useState } from "react";
import { LocateFixed } from "lucide-react";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import api from "../../api/axios";

const SHIPMENT_STATUSES = ["Booked", "Payment Verified", "Picked Up", "In Transit", "Delivered", "Cancelled"];

const truckIcon = new L.DivIcon({
  className: "",
  html: `<div style="background:#F59E0B;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-size:15px;">🚚</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const LiveTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [form, setForm] = useState({ locationName: "", latitude: "", longitude: "", status: "In Transit", remarks: "" });
  const [submitting, setSubmitting] = useState(false);

  const activeOrders = orders.filter((o) => o.lrNumber && !["Delivered", "Cancelled"].includes(o.shipmentStatus));

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data.orders)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported. Please enter location manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(4), longitude: pos.coords.longitude.toFixed(4) }));
        toast.success("Current location fetched");
      },
      () => toast.error("Location permission denied. Please enter manually."),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) return toast.error("Select an order first");
    if (!form.locationName || !form.latitude || !form.longitude) return toast.error("Fill location details");

    setSubmitting(true);
    try {
      await api.post(`/tracking/${selectedOrderId}`, {
        locationName: form.locationName,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        status: form.status,
        remarks: form.remarks,
      });
      toast.success("Tracking update added");
      setForm({ locationName: "", latitude: "", longitude: "", status: "In Transit", remarks: "" });
      const res = await api.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update tracking");
    } finally {
      setSubmitting(false);
    }
  };

  const activeWithLocation = activeOrders.filter((o) => o.currentLocation?.lat);

  return (
    <DashboardLayout>
      <Header title="Live Tracking" subtitle="Shipment Location Updates" />

      {loading ? (
        <Loader />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="card space-y-4">
            <h2 className="font-semibold text-navy">Update Order Location</h2>
            <div>
              <label className="label-text">Select Order (LR Number)</label>
              <select className="input-field" value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)}>
                <option value="">Choose an order</option>
                {activeOrders.map((o) => (
                  <option key={o._id} value={o._id}>{o.lrNumber} · {o.pickupDetails.city} → {o.deliveryDetails.city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text">Current Location Name</label>
              <input className="input-field" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} placeholder="e.g. Lonavala, Maharashtra" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text">Latitude</label>
                <input className="input-field" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="18.7546" />
              </div>
              <div>
                <label className="label-text">Longitude</label>
                <input className="input-field" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="73.4062" />
              </div>
            </div>
            <button type="button" onClick={useCurrentLocation} className="btn-outline text-sm flex items-center gap-2 w-fit">
              <LocateFixed size={15} /> Use Current Location
            </button>
            <div>
              <label className="label-text">Shipment Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {SHIPMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Remarks</label>
              <textarea rows={2} className="input-field" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Optional notes" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? "Updating..." : "Update Tracking"}</button>
          </form>

          <div className="card">
            <h2 className="font-semibold text-navy mb-4">Active Shipments Map</h2>
            <MapContainer center={[20.5937, 78.9629]} zoom={4.5} style={{ height: 420, width: "100%" }} scrollWheelZoom={false}>
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {activeWithLocation.map((o) => (
                <Marker key={o._id} position={[o.currentLocation.lat, o.currentLocation.lng]} icon={truckIcon}>
                  <Popup>
                    <p className="font-semibold">{o.lrNumber}</p>
                    <p>{o.pickupDetails.city} → {o.deliveryDetails.city}</p>
                    <p>Status: {o.shipmentStatus}</p>
                    <p className="text-xs text-slate-500">{o.currentLocation.name}</p>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {activeWithLocation.length === 0 && <p className="text-sm text-slate-400 mt-3">No active shipments with location data yet.</p>}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LiveTracking;
