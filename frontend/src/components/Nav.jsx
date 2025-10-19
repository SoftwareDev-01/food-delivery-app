import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from "../App";
import axios from "axios";
import { setSearchItems, setShop, setUserData } from "../redux/userSlice";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { TbReceipt2 } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";

const primaryGradient = "linear-gradient(90deg, #ff512f 0%, #f09819 100%)"; // warm orange-red gradient
const bgLight = "#fff9f6";
const shadowColor = "rgba(255, 77, 45, 0.25)";

function Nav() {
  const { city, userData, cartItems, pendingOrdersCount } = useSelector(
    (state) => state.user
  );
  const [showSearch, setShowSearch] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setShop(null));
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search-items?city=${city}&query=${input}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      dispatch(setSearchItems(null));
      console.log(error);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearchItems();
    } else {
      dispatch(setSearchItems(null));
    }
  }, [input]);

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, pointerEvents: "auto" },
  };

  const badgeBounce = {
    animate: {
      scale: [1, 1.3, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  return (
    <nav
      className="w-full fixed top-0 z-[9999] bg-[#fff9f6] shadow-lg"
      style={{ background: bgLight, boxShadow: `0 4px 15px ${shadowColor}` }}
    >
      <div className="max-w-[1300px] mx-auto flex items-center justify-between px-5 md:px-10 h-[80px] gap-5">
        {/* Logo */}
        <h1
          className="text-3xl font-extrabold cursor-pointer select-none flex-shrink-0"
          style={{
            background: primaryGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          onClick={() => navigate("/")}
        >
          Vingo
        </h1>

        {/* Desktop Search Box */}
        {userData?.role === "user" && (
          <div className="hidden md:flex md:flex-1 max-w-[600px] h-[50px] bg-white rounded-lg shadow-xl items-center gap-4 px-4">
            <div className="flex items-center w-[30%] overflow-hidden gap-2 px-3 border-r-2 border-gray-300">
              <FaLocationDot className="w-6 h-6 text-orange-500" />
              <div className="truncate text-gray-700">{city || "Loading..."}</div>
            </div>
            <div className="flex items-center w-[70%] gap-2">
              <IoIosSearch className="w-6 h-6 text-orange-500" />
              <input
                type="text"
                placeholder="Search delicious food..."
                className="w-full text-gray-700 outline-none"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </div>
          </div>
        )}

        {/* Mobile Search Toggle */}
        {userData?.role === "user" && (
          <div className="md:hidden flex items-center gap-2">
            {!showSearch ? (
              <IoIosSearch
                className="w-7 h-7 text-orange-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => setShowSearch(true)}
              />
            ) : (
              <RxCross2
                className="w-7 h-7 text-orange-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => setShowSearch(false)}
              />
            )}
          </div>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Owner Role Buttons */}
          {userData?.role === "owner" ? (
            <>
              {/* Add Food Item */}
              <button
                onClick={() => navigate("/additem")}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 select-none"
              >
                <FiPlus size={18} />
                Add Food Item
              </button>
              <button
                onClick={() => navigate("/additem")}
                className="flex md:hidden items-center justify-center p-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg hover:shadow-2xl transition-all duration-300 select-none"
              >
                <FiPlus size={22} />
              </button>

              {/* Pending Orders */}
              <motion.div
                className="hidden md:flex items-center gap-2 cursor-pointer relative px-4 py-2 rounded-lg bg-orange-100 text-red-600 font-semibold shadow-md select-none"
                onClick={() => navigate("/pending-orders")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TbReceipt2 className="w-6 h-6" />
                My Orders
                <motion.span
                  className="absolute -right-2 -top-2 text-xs font-bold text-white bg-red-500 rounded-full px-2 py-0.5 shadow-md"
                  variants={badgeBounce}
                  animate="animate"
                >
                  {pendingOrdersCount}
                </motion.span>
              </motion.div>

              <motion.div
                className="flex md:hidden items-center justify-center relative p-2 rounded-full bg-orange-100 text-red-600 select-none shadow-md"
                onClick={() => navigate("/pending-orders")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <TbReceipt2 className="w-6 h-6" />
                <motion.span
                  className="absolute -right-1 -top-1 text-[10px] font-bold text-white bg-red-500 rounded-full px-1.5 py-[1px] shadow-md"
                  variants={badgeBounce}
                  animate="animate"
                >
                  {pendingOrdersCount}
                </motion.span>
              </motion.div>
            </>
          ) : userData?.role === "deliveryBoy" ? (
            <motion.button
              onClick={() => navigate("/my-delivered-orders")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 select-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              My Orders
            </motion.button>
          ) : (
            <>
              {/* User Cart */}
              <motion.div
                className="relative cursor-pointer select-none"
                onClick={() => navigate("/cart")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <LuShoppingCart className="w-7 h-7 text-orange-500" />
                <motion.span
                  className="absolute -right-3 -top-3 text-red-600 font-bold bg-red-200 rounded-full px-2 py-0.5 text-xs shadow-lg select-none"
                  variants={badgeBounce}
                  animate="animate"
                >
                  {cartItems?.length || 0}
                </motion.span>
              </motion.div>

              {/* User Orders (desktop only) */}
              {userData?.role === "user" && (
                <motion.button
                  onClick={() => navigate("/my-orders")}
                  className="hidden md:block px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 select-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  My Orders
                </motion.button>
              )}
            </>
          )}

          {/* Profile Icon */}
          <div className="relative select-none">
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 text-white text-lg shadow-xl font-semibold cursor-pointer"
              onClick={() => setShowInfo((prev) => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {userData?.fullName?.slice(0, 1) || "U"}
            </motion.div>

            {/* Profile dropdown */}
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  className="fixed top-[80px] right-5 md:right-[10%] lg:right-[25%] w-44 bg-white shadow-2xl rounded-xl p-4 flex flex-col gap-3 z-[9999]"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-lg font-semibold text-gray-800 select-text truncate">
                    {userData?.fullName}
                  </div>

                  {/* Mobile: My Orders */}
                  {userData?.role === "user" && (
                    <div
                      className="md:hidden text-red-600 font-semibold cursor-pointer hover:underline select-none"
                      onClick={() => {
                        setShowInfo(false);
                        navigate("/my-orders");
                      }}
                    >
                      My Orders
                    </div>
                  )}

                  <div
                    className="text-red-600 font-semibold cursor-pointer hover:underline select-none"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Sliding Down */}
      <AnimatePresence>
        {showSearch && userData?.role === "user" && (
          <motion.div
            className="fixed top-[80px] left-0 right-0 z-[9998] mx-auto w-[95%] max-w-xl h-[60px] bg-white rounded-lg shadow-xl flex items-center gap-3 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center w-[30%] overflow-hidden gap-2 px-3 border-r-2 border-gray-300">
              <FaLocationDot className="w-6 h-6 text-orange-500" />
              <div className="truncate text-gray-700">{city || "Loading..."}</div>
            </div>
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-[70%] text-gray-700 outline-none"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Nav;
