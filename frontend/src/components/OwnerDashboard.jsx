import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaPen, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import Nav from "./Nav";
import Footer from "./Footer";
import OwnerFoodCard from "./OwnerFoodCard";
import { setPendingOrdersCount } from "../redux/userSlice";

/* ---------------- Helpers ---------------- */
const formatDate = (date) =>
  new Date(date).toLocaleString();

/* ---------------- Animations ---------------- */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

function OwnerDashboard() {
  const { shop, ownerPendingOrders } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- Pending Orders Count ---------------- */
  useEffect(() => {
    const pendingCount = ownerPendingOrders.filter(
      (o) => o.shopOrder.status === "pending"
    ).length;

    dispatch(setPendingOrdersCount(pendingCount));
  }, [ownerPendingOrders, dispatch]);

  /* ---------------- Memoized Shop Card ---------------- */
  const ShopCard = useMemo(() => {
    if (!shop) return null;

    return (
      <div className="relative w-full bg-softWhite rounded-3xl overflow-hidden border border-orange-200 shadow-lg hover:shadow-2xl transition-all">
        <button
          onClick={() => navigate("/editshop")}
          aria-label="Edit Shop"
          className="absolute top-5 right-5 bg-gradient-to-r from-primaryOrange to-darkOrange text-white p-3 rounded-full shadow-lg hover:brightness-110"
        >
          <FaPen size={20} />
        </button>

        <img
          src={shop.image}
          alt={shop.name}
          loading="lazy"
          className="w-full h-60 sm:h-72 object-cover"
        />

        <div className="p-6 space-y-3">
          <h2 className="text-2xl font-bold text-coolGray">
            {shop.name}
          </h2>
          <p className="text-primaryOrange font-semibold">
            {shop.city}, {shop.state}
          </p>
          <p className="text-coolGray">{shop.address}</p>

          <div className="text-xs text-lightGray mt-4 space-y-1">
            <p>Created: {formatDate(shop.createdAt)}</p>
            <p>Last Updated: {formatDate(shop.updatedAt)}</p>
          </div>
        </div>
      </div>
    );
  }, [shop, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lightPeach to-white flex flex-col items-center">
      <Nav />

      {/* ---------------- No Shop ---------------- */}
      {!shop && (
        <motion.div {...fadeUp} className="p-10">
          <div className="max-w-md bg-softWhite rounded-3xl p-8 shadow-2xl text-center border">
            <motion.div whileHover={{ scale: 1.2, rotate: 15 }}>
              <FaUtensils className="text-primaryOrange w-24 h-24 mx-auto" />
            </motion.div>

            <h2 className="text-4xl font-extrabold text-coolGray mt-6">
              Add Your Restaurant
            </h2>

            <p className="text-lightGray mt-4">
              Join our platform and reach thousands of hungry customers.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/editshop")}
              className="mt-8 bg-gradient-to-r from-primaryOrange to-darkOrange text-white px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ---------------- Shop Exists ---------------- */}
      {shop && (
        <motion.div
          {...fadeUp}
          className="w-full max-w-5xl px-6 flex flex-col gap-10 mt-10"
        >
          <h1 className="text-4xl font-extrabold text-coolGray flex items-center gap-4">
            <FaUtensils className="text-primaryOrange text-5xl" />
            Welcome to{" "}
            <span className="text-primaryOrange">{shop.name}</span>
          </h1>

          {ShopCard}

          {/* ---------------- No Items ---------------- */}
          {shop.items.length === 0 && (
            <div className="max-w-xl mx-auto bg-softWhite rounded-3xl p-8 shadow-lg border text-center">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                <FaUtensils className="text-primaryOrange text-5xl mx-auto mb-4" />
              </motion.div>

              <h2 className="text-2xl font-bold text-coolGray">
                Add Your Food Items
              </h2>

              <p className="text-lightGray mt-3">
                Share your delicious creations with customers.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/additem")}
                className="mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-primaryOrange to-darkOrange text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                <FaPlus /> Add Item
              </motion.button>
            </div>
          )}

          {/* ---------------- Items List ---------------- */}
          {shop.items.length > 0 && (
            <div className="flex flex-col gap-6 mb-16">
              {shop.items.map((item) => (
                <OwnerFoodCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

export default OwnerDashboard;
