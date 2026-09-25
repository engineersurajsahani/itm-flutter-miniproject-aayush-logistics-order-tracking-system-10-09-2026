import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import Header from "../../components/Header";
import StatusChip from "../../components/StatusChip";
import ShipmentTimeline from "../../components/ShipmentTimeline";
import TrackingMap from "../../components/TrackingMap";
import Loader from "../../components/Loader";
import api from "../../api/axios";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => { setOrder(res.data.order); setHistory(res.data.trackingHistory); })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

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
          <p className="text-xs text-slate-400 uppercase font-medium mb-1">LR Number</p>
          <h1 className="text-2xl font-bold text-navy">{order.lrNumber || "Not generated yet"}</h1>
        </div>
        <StatusChip status={order.shipmentStatus} />
      </div>

      {!order.lrNumber ? (
        <div className="card bg-amber-50 border-amber-200 text-amber-700 text-sm mb-6">
          Tracking will be available after your payment is verified by the admin.
        </div>
      ) : (
        <div className="card mb-6">
          <h2 className="font-semibold text-navy mb-6">Shipment Progress</h2>
          <ShipmentTimeline currentStatus={order.shipmentStatus} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-navy">Sender Details</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="text-slate-400">Contact:</span> {order.pickupDetails.contactName} · {order.pickupDetails.contactNumber}</p>
            <p><span className="text-slate-400">Address:</span> {order.pickupDetails.address}, {order.pickupDetails.city}</p>
            <p><span className="text-slate-400">Pickup Date:</span> {new Date(order.pickupDetails.pickupDate).toLocaleDateString("en-IN")}</p>
          </div>
          <h2 className="font-semibold text-navy pt-2">Receiver Details</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="text-slate-400">Contact:</span> {order.deliveryDetails.receiverName} · {order.deliveryDetails.receiverPhone}</p>
            <p><span className="text-slate-400">Address:</span> {order.deliveryDetails.address}, {order.deliveryDetails.city}</p>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-navy">Goods Details</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="text-slate-400">Category:</span> {order.goodsDetails.category}</p>
            <p><span className="text-slate-400">Description:</span> {order.goodsDetails.description || "—"}</p>
            <p><span className="text-slate-400">Weight:</span> {order.goodsDetails.weightKg} kg · {order.goodsDetails.numPackages} packages</p>
            <p><span className="text-slate-400">Vehicle:</span> {order.vehicleType}</p>
          </div>
          <h2 className="font-semibold text-navy pt-2">Payment Details</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p><span className="text-slate-400">Amount:</span> ₹{order.estimatedAmount?.toLocaleString("en-IN")}</p>
            <p><span className="text-slate-400">Method:</span> {order.paymentMethod}</p>
            <p className="flex items-center gap-2"><span className="text-slate-400">Status:</span> <StatusChip status={order.paymentStatus} /></p>
            {order.estimatedDeliveryDate && <p><span className="text-slate-400">Est. Delivery:</span> {new Date(order.estimatedDeliveryDate).toLocaleDateString("en-IN")}</p>}
          </div>
        </div>
      </div>

      {order.lrNumber && (
        <>
          <div className="card mb-6">
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

          <div className="card">
            <h2 className="font-semibold text-navy mb-4">Tracking History</h2>
            {history.length === 0 ? (
              <p className="text-sm text-slate-400">No tracking updates yet.</p>
            ) : (
              <ul className="space-y-4">
                {history.slice().reverse().map((h) => (
                  <li key={h._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">{h.status} · {h.locationName}</p>
                      {h.remarks && <p className="text-xs text-slate-500">{h.remarks}</p>}
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(h.updatedAt).toLocaleString("en-IN")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default OrderDetails;
