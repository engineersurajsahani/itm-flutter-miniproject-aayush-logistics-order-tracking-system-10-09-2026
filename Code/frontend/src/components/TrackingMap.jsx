import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Fix default marker icons (Leaflet + bundlers issue)
const makeIcon = (color) =>
  new L.DivIcon({
    className: "",
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const truckIcon = new L.DivIcon({
  className: "",
  html: `<div style="background:#F59E0B;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-size:15px;">🚚</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const TrackingMap = ({ pickup, delivery, current, height = 320 }) => {
  const points = [pickup, current, delivery].filter((p) => p && p.lat && p.lng);
  const center = current || pickup || delivery || { lat: 20.5937, lng: 78.9629 };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={points.length > 1 ? 6 : 5}
      style={{ height, width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickup && pickup.lat && (
        <Marker position={[pickup.lat, pickup.lng]} icon={makeIcon("#2563EB")}>
          <Popup>Pickup: {pickup.name}</Popup>
        </Marker>
      )}
      {delivery && delivery.lat && (
        <Marker position={[delivery.lat, delivery.lng]} icon={makeIcon("#DC2626")}>
          <Popup>Delivery: {delivery.name}</Popup>
        </Marker>
      )}
      {current && current.lat && (
        <Marker position={[current.lat, current.lng]} icon={truckIcon}>
          <Popup>Current location: {current.name}</Popup>
        </Marker>
      )}
      {points.length > 1 && (
        <Polyline positions={points.map((p) => [p.lat, p.lng])} color="#2563EB" weight={3} opacity={0.6} dashArray="6 6" />
      )}
    </MapContainer>
  );
};

export default TrackingMap;
