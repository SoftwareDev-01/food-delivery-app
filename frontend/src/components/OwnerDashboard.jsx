import React, { useEffect } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaPen, FaPlus } from "react-icons/fa";
import Footer from "./Footer";
import OwnerFoodCard from "./OwnerFoodCard";
import { setPendingOrdersCount } from "../redux/userSlice";
import { motion } from "framer-motion";

function OwnerDashboard() {
  const { shop, ownerPendingOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const pending = ownerPendingOrders.filter(
      (order) => order.shopOrder.status === "pending"
    );
    dispatch(setPendingOrdersCount(pending.length));
  }, [ownerPendingOrders]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lightPeach to-white flex flex-col items-center font-sans">
      <Nav />

      {/* No shop */}
      {!shop && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center items-center p-6 sm:p-10"
        >
          <div className="w-full max-w-md bg-softWhite shadow-2xl rounded-3xl p-8 border border-gray-200 hover:shadow-[0_12px_24px_rgba(255,77,45,0.25)] transition-shadow duration-400 cursor-pointer select-none">
            <div className="flex flex-col items-center text-center space-y-5">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaUtensils className="text-primaryOrange w-20 h-20 sm:w-24 sm:h-24" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-coolGray drop-shadow-md">
                Add Your Restaurant
              </h2>
              <p className="text-lightGray max-w-xs text-base sm:text-lg leading-relaxed">
                Join our platform and reach thousands of hungry customers daily.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/editshop")}
                className="bg-gradient-to-r from-primaryOrange to-darkOrange text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Shop exists but no items */}
      {shop && shop?.items?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col items-center gap-8 px-6 sm:px-12 max-w-4xl"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-coolGray flex items-center gap-4 mt-10 select-none">
            <FaUtensils className="text-primaryOrange text-4xl sm:text-5xl" />
            Welcome to <span className="text-primaryOrange">{shop.name}</span>
          </h1>

          {/* Shop Card */}
          <div className="relative w-full bg-softWhite rounded-3xl overflow-hidden border border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-300">
            <button
              onClick={() => navigate("/editshop")}
              aria-label="Edit Shop"
              className="absolute top-5 right-5 bg-gradient-to-r from-primaryOrange to-darkOrange text-white p-3 rounded-full shadow-lg hover:brightness-110 transition-all select-none"
            >
              <FaPen size={20} />
            </button>
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-56 sm:h-72 object-cover rounded-t-3xl"
              loading="lazy"
            />
            <div className="p-6 space-y-2">
              <h2 className="text-2xl font-bold text-coolGray">{shop.name}</h2>
              <p className="text-primaryOrange font-semibold">
                {shop.city}, {shop.state}
              </p>
              <p className="text-coolGray">{shop.address}</p>
              <div className="text-xs text-lightGray mt-4 space-y-1">
                <p>Created: {new Date(shop.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(shop.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Add Item Section */}
          <div className="w-full max-w-xl bg-softWhite rounded-3xl p-8 shadow-lg border border-orange-200 hover:shadow-2xl transition-all duration-300 text-center select-none">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaUtensils className="text-primaryOrange text-5xl mx-auto mb-5" />
            </motion.div>
            <h2 className="text-2xl font-bold text-coolGray mb-3">
              Add Your Food Items
            </h2>
            <p className="text-lightGray mb-7 text-base sm:text-lg leading-relaxed">
              Share your delicious creations with customers by adding them here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/additem")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primaryOrange to-darkOrange text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <FaPlus size={20} /> Add Item
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Shop with items */}
      {shop && shop?.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col gap-8 items-center px-6 sm:px-12 max-w-5xl mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-coolGray flex items-center gap-4 mt-10 select-none">
            <FaUtensils className="text-primaryOrange text-5xl" />
            Welcome to <span className="text-primaryOrange">{shop.name}</span>
          </h1>

          {/* Shop Card */}
          <div className="relative w-full bg-softWhite rounded-3xl overflow-hidden border border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-300">
            <button
              onClick={() => navigate("/editshop")}
              aria-label="Edit Shop"
              className="absolute top-5 right-5 bg-gradient-to-r from-primaryOrange to-darkOrange text-white p-3 rounded-full shadow-lg hover:brightness-110 transition-all select-none"
            >
              <FaPen size={20} />
            </button>
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-60 sm:h-72 object-cover rounded-t-3xl"
              loading="lazy"
            />
            <div className="p-6 space-y-3">
              <h2 className="text-2xl font-bold text-coolGray">{shop.name}</h2>
              <p className="text-primaryOrange font-semibold">
                {shop.city}, {shop.state}
              </p>
              <p className="text-coolGray">{shop.address}</p>
              <div className="text-xs text-lightGray mt-4 space-y-1">
                <p>Created: {new Date(shop.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(shop.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Food Items List */}
          <div className="w-full flex flex-col gap-6 max-w-4xl">
            {shop.items.map((item, idx) => (
              <OwnerFoodCard key={idx} item={item} />
            ))}
          </div>
        </motion.div>
      )}

      
    </div>
  );
}

export default OwnerDashboard;
