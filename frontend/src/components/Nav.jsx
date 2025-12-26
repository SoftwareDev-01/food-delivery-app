import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoIosSearch,
} from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { LuShoppingCart } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { TbReceipt2 } from "react-icons/tb";
import { serverUrl } from "../App";
import {
  setSearchItems,
  setShop,
  setUserData,
} from "../redux/userSlice";
import CitySelector from "./CitySelector";

function Nav() {
  const { city, userData, cartItems, pendingOrdersCount } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const abortRef = useRef(null);

  /* ---------------- Debounced Search ---------------- */
  useEffect(() => {
    if (!search || !city) {
      dispatch(setSearchItems(null));
      return;
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await axios.get(
          `${serverUrl}/api/user/search-items`,
          {
            params: { city, query: search },
            withCredentials: true,
            signal: abortRef.current.signal,
          }
        );
        dispatch(setSearchItems(res.data));
      } catch (err) {
        if (err.name !== "CanceledError") {
          dispatch(setSearchItems(null));
        }
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, city, dispatch]);

  /* ---------------- Logout ---------------- */
  const logout = async () => {
    await axios.get(`${serverUrl}/api/auth/signout`, {
      withCredentials: true,
    });
    dispatch(setUserData(null));
    dispatch(setShop(null));
    navigate("/signin");
  };

  return (
    <>
      <nav className="fixed top-0 z-[9999] w-full bg-gradient-to-r from-[#fff9f6] to-[#ffebd3] shadow-xl">
        <div className="max-w-7xl mx-auto h-[90px] px-6 flex items-center justify-between gap-6">

          {/* Logo */}
          <h1
            onClick={() => navigate("/")}
            className="text-4xl font-extrabold text-[#ff4d2d] cursor-pointer hover:scale-110 transition"
          >
            Eat With Me
          </h1>

          {/* Search */}
          {userData?.role === "user" && (
            <div className="hidden md:flex flex-1 max-w-xl bg-white rounded-2xl shadow-lg border px-4 items-center gap-4">
              <FaLocationDot className="text-[#ff4d2d]" />
              <button
                onClick={() => setShowCitySelector(true)}
                className="text-sm font-semibold text-gray-700 truncate max-w-[90px]"
              >
                {city || "Select City"}
              </button>

              <span className="h-6 w-px bg-gray-300" />

              <IoIosSearch className="text-[#ff4d2d]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food..."
                className="flex-1 outline-none text-gray-800"
              />
              {search && (
                <RxCross2
                  onClick={() => setSearch("")}
                  className="cursor-pointer text-gray-400 hover:text-[#ff4d2d]"
                />
              )}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-6">

            {/* Owner */}
            {userData?.role === "owner" && (
              <>
                <button
                  onClick={() => navigate("/additem")}
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-[#ff4d2d]/20 text-[#ff4d2d] font-semibold"
                >
                  <FiPlus /> Add Item
                </button>

                <div
                  onClick={() => navigate("/pending-orders")}
                  className="relative cursor-pointer"
                >
                  <TbReceipt2 className="w-7 h-7 text-[#ff4d2d]" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-[#ff4d2d] text-white px-2 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* User */}
            {userData?.role === "user" && (
              <>
                <div
                  onClick={() => navigate("/cart")}
                  className="relative cursor-pointer"
                >
                  <LuShoppingCart className="w-7 h-7 text-[#ff4d2d]" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] text-xs bg-[#ff4d2d] text-white rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate("/my-orders")}
                  className="hidden md:block px-5 py-2 rounded-xl bg-[#ff4d2d]/20 text-[#ff4d2d] font-semibold"
                >
                  My Orders
                </button>
              </>
            )}

            {/* Profile */}
            <div className="relative">
              <div
                onClick={() => setShowProfile((p) => !p)}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff4d2d] to-[#ff8c42] text-white flex items-center justify-center font-bold cursor-pointer"
              >
                {userData?.fullName?.[0]?.toUpperCase()}
              </div>

              {showProfile && (
                <div className="absolute right-0 top-14 bg-white rounded-2xl shadow-xl p-4 w-[200px] z-[9999]">
                  <p className="font-semibold text-gray-800 truncate">
                    {userData?.fullName}
                  </p>
                  <button
                    onClick={logout}
                    className="mt-4 w-full text-[#ff4d2d] font-semibold hover:bg-[#ff4d2d]/10 rounded-xl py-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* City Selector */}
      <CitySelector
        isOpen={showCitySelector}
        onClose={() => setShowCitySelector(false)}
      />
    </>
  );
}

export default Nav;
