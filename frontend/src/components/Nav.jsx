import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { LuShoppingCart } from "react-icons/lu";
import { FaLocationDot } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { TbReceipt2 } from "react-icons/tb";
import { serverUrl } from "../App";
import { setSearchItems, setShop, setUserData } from "../redux/userSlice";
import CitySelectorRoyal from "./CitySelector";

function NavbarRoyal() {
  const { city, userData, cartItems, pendingOrdersCount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const abortRef = useRef(null);

  useEffect(() => {
    if (!search || !city) {
      dispatch(setSearchItems(null));
      return;
    }

    const timeout = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await axios.get(`${serverUrl}/api/user/search-items`, {
          params: { city, query: search },
          withCredentials: true,
          signal: abortRef.current.signal,
        });
        dispatch(setSearchItems(res.data));
      } catch (err) {
        if (err.name !== "CanceledError") dispatch(setSearchItems(null));
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, city, dispatch]);

  const logout = async () => {
    await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
    dispatch(setUserData(null));
    dispatch(setShop(null));
    navigate("/signin");
  };

  return (
    <>
      <nav className="fixed top-0 z-[9999] w-full
        bg-gradient-to-r from-[#2B0000] via-[#3D0A0A] to-[#4A0E0E]
        shadow-[0_0_25px_rgba(201,162,39,0.25)] border-b border-[#C9A227]/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-[90px] px-6 flex items-center justify-between gap-6 text-[#FFDFA8]">

          <h1
            onClick={() => navigate("/")}
            className="text-3xl md:text-4xl font-extrabold text-[#FFD37A] cursor-pointer tracking-wide hover:scale-110 transition drop-shadow-sm"
          >
            Eat With Me
          </h1>

          {userData?.role === "user" && (
            <div className="hidden md:flex flex-1 max-w-xl
              bg-[#190404]/50 rounded-2xl shadow-inner border border-[#C9A227]/40
              px-4 items-center gap-4 backdrop-blur-md">
              <FaLocationDot className="text-[#C9A227]" />
              <button
                onClick={() => setShowCitySelector(true)}
                className="text-sm font-semibold truncate max-w-[90px] text-[#FFDFA8]"
              >
                {city || "Select City"}
              </button>

              <span className="h-6 w-px bg-[#C9A227]/30" />

              <IoIosSearch className="text-[#C9A227]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search food..."
                className="flex-1 bg-transparent outline-none text-[#FFDFA8] placeholder-[#E8C56C]/60"
              />
              {search && (
                <RxCross2
                  onClick={() => setSearch("")}
                  className="cursor-pointer text-gray-400 hover:text-[#FFD37A]"
                />
              )}
            </div>
          )}

          <div className="flex items-center gap-6">

            {userData?.role === "owner" && (
              <>
                <button
                  onClick={() => navigate("/additem")}
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full
                    bg-[#C9A227]/20 text-[#FFD37A] font-semibold hover:bg-[#C9A227]/30"
                >
                  <FiPlus /> Add Item
                </button>

                <div
                  onClick={() => navigate("/pending-orders")}
                  className="relative cursor-pointer"
                >
                  <TbReceipt2 className="w-7 h-7 text-[#FFD37A]" />
                  {pendingOrdersCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs bg-[#C9A227] text-black px-2 rounded-full">
                      {pendingOrdersCount}
                    </span>
                  )}
                </div>
              </>
            )}

            {userData?.role === "user" && (
              <>
                <div
                  onClick={() => navigate("/cart")}
                  className="relative cursor-pointer"
                >
                  <LuShoppingCart className="w-7 h-7 text-[#FFD37A]" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[20px] h-[20px] text-xs
                      bg-[#C9A227] text-black rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate("/my-orders")}
                  className="hidden md:block px-5 py-2 rounded-xl
                    bg-[#C9A227]/20 text-[#FFD37A] font-semibold hover:bg-[#C9A227]/30"
                >
                  My Orders
                </button>
              </>
            )}

            <div className="relative">
              <div
                onClick={() => setShowProfile((p) => !p)}
                className="w-11 h-11 rounded-full
                  bg-gradient-to-br from-[#C9A227] to-[#A88C21]
                  text-black flex items-center justify-center font-bold cursor-pointer"
              >
                {userData?.fullName?.[0]?.toUpperCase()}
              </div>

              {showProfile && (
                <div className="absolute right-0 top-14
                  bg-[#2B0000] border border-[#C9A227]/40 text-[#FFDFA8]
                  rounded-2xl shadow-xl p-4 w-[200px] z-[9999]">
                  <p className="font-semibold truncate text-[#FFD37A]">
                    {userData?.fullName}
                  </p>
                  <button
                    onClick={logout}
                    className="mt-4 w-full text-[#FFDFA8] font-semibold bg-[#C9A227]/20
                      hover:bg-[#C9A227]/30 rounded-xl py-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CitySelectorRoyal
        isOpen={showCitySelector}
        onClose={() => setShowCitySelector(false)}
      />
    </>
  );
}

export default NavbarRoyal;