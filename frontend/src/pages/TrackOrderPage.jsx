import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import UserDeliveryTracking from "../components/userDeliveryTracking";
import { MdKeyboardBackspace } from "react-icons/md";

const PRIMARY = "#ff4d2d"; // Coral/orange accent
const GOLD = "#d4af37"; // Subtle gold accent
const BG_LIGHT = "#fff9f5";
const TEXT_DARK = "#3a3a3a";
const TEXT_MUTED = "#7a7a7a";

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/${orderId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!order)
    return (
      <p className="text-center mt-20 text-xl font-semibold tracking-wide" style={{ color: TEXT_MUTED }}>
        Loading...
      </p>
    );

  return (
    <div
      className="max-w-4xl mx-auto p-6 flex flex-col gap-10 min-h-screen"
      style={{
        backgroundColor: BG_LIGHT,
        color: TEXT_DARK,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer rounded-full p-2 transition-all duration-300 hover:bg-[#ff4d2d33]"
          aria-label="Go back"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/");
          }}
        >
          <MdKeyboardBackspace className="w-7 h-7" style={{ color: PRIMARY }} />
        </div>
        <h1
          className="text-4xl font-extrabold tracking-wide uppercase"
          style={{ color: PRIMARY, letterSpacing: "0.12em" }}
        >
          Track Order
        </h1>
      </div>

      {/* Orders */}
      {order.shopOrders.map((shopOrder) => (
        <div
          key={shopOrder._id}
          className="bg-white p-8 rounded-3xl shadow-lg border border-[#ff4d2d33] space-y-6"
          style={{
            boxShadow: "0 6px 24px rgba(255, 77, 45, 0.3)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {/* Shop & Order Info */}
          <div>
            <h2
              className="text-2xl font-bold tracking-widest uppercase mb-3 select-none"
              style={{ color: GOLD, letterSpacing: "0.12em" }}
            >
              {shopOrder.shop?.name || "SHOP"}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-semibold text-gray-900">Items:</span>{" "}
              {shopOrder.items.map((i) => i.name).join(", ")}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mt-1">
              <span className="font-semibold text-gray-900">Subtotal:</span> ₹
              {shopOrder.subtotal}
            </p>
            <p className="mt-4 text-gray-600 italic max-w-xl tracking-wide">
              <span className="font-semibold text-gray-800">Customer Address:</span>{" "}
              {order.address.text}
            </p>
          </div>

          {/* Delivery Info */}
          {shopOrder.status === "delivered" ? (
            <p
              className="text-green-600 font-extrabold text-2xl tracking-wider select-none"
              aria-label="Delivered"
            >
              Delivered ✅
            </p>
          ) : (
            <>
              {/* Delivery Boy Info */}
              <div>
                <h2
                  className="text-xl font-semibold tracking-widest uppercase mb-2 select-none"
                  style={{ color: GOLD, letterSpacing: "0.1em" }}
                >
                  Delivery Boy
                </h2>
                {shopOrder.assignedDeliveryBoy ? (
                  <div className="text-gray-800 text-lg leading-relaxed space-y-1">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {shopOrder.assignedDeliveryBoy.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      <a
                        href={`tel:${shopOrder.assignedDeliveryBoy.mobile}`}
                        className="hover:underline"
                      >
                        {shopOrder.assignedDeliveryBoy.mobile}
                      </a>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic select-none">
                    Delivery boy not assigned yet
                  </p>
                )}
              </div>

              {/* Tracking Map */}
              {shopOrder.assignedDeliveryBoy && (
                <div
                  className="h-[420px] w-full rounded-3xl overflow-hidden shadow-lg mt-6 border border-[#ff4d2d33]"
                  style={{
                    boxShadow: "0 10px 30px rgba(255, 77, 45, 0.2)",
                  }}
                >
                  <UserDeliveryTracking
                    orderId={order._id}
                    shopOrderId={shopOrder._id}
                    userLocation={{
                      lat: order.address.latitude,
                      lng: order.address.longitude,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
