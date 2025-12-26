import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import axios from "axios";
import { serverUrl } from "../App";

// Marker icons
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Optional: Map flyTo effect
const FlyToCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

export default function UserDeliveryTracking({ orderId, userLocation, shopOrderId }) {
  const [deliveryLoc, setDeliveryLoc] = useState(null);
  const intervalRef = useRef(null);

  // 🔹 Fetch delivery boy location every 5 seconds
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/delivery-location/${orderId}/${shopOrderId}`,
          { withCredentials: true }
        );

        const newLoc = res.data?.deliveryBoyLocation;
        if (res.data.success && newLoc) {
          // Update only if location changed
          setDeliveryLoc((prev) =>
            !prev || prev.lat !== newLoc.lat || prev.lng !== newLoc.lng ? newLoc : prev
          );
        }
      } catch (err) {
        console.error("Error fetching delivery boy location:", err);
      }
    };

    fetchLocation();
    intervalRef.current = setInterval(fetchLocation, 5000);
    return () => clearInterval(intervalRef.current);
  }, [orderId, shopOrderId]);

  if (!deliveryLoc)
    return (
      <div className="flex justify-center items-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryOrange"></div>
      </div>
    );

  const polylinePath = [
    [deliveryLoc.lat, deliveryLoc.lng],
    [userLocation.lat, userLocation.lng],
  ];

  const center = [
    (deliveryLoc.lat + userLocation.lat) / 2,
    (deliveryLoc.lng + userLocation.lng) / 2,
  ];

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md mt-3">
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Fly map to center on updates */}
        <FlyToCenter center={center} />

        {/* Delivery boy marker */}
        <Marker position={[deliveryLoc.lat, deliveryLoc.lng]} icon={deliveryBoyIcon}>
          <Popup>Delivery Boy</Popup>
        </Marker>

        {/* User marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={customerIcon}>
          <Popup>Your Address</Popup>
        </Marker>

        {/* Route line */}
        <Polyline positions={polylinePath} color="blue" weight={4} />
      </MapContainer>
    </div>
  );
}
