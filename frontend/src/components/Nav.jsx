import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosSearch } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from '../App';
import axios from 'axios';
import { setSearchItems, setShop, setUserData } from '../redux/userSlice';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { TbReceipt2 } from "react-icons/tb";
import CitySelector from './CitySelector';

function Nav() {
    const { city, userData, cartItems, pendingOrdersCount } = useSelector(state => state.user);
    const [showSearch, setShowSearch] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showCitySelector, setShowCitySelector] = useState(false);
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

    useEffect(() => {
        setInput("");
        dispatch(setSearchItems(null));
    }, [city]);

    return (
        <>
            <div className="w-full h-[90px] flex items-center justify-between md:justify-center gap-8 px-6 fixed top-0 z-[9999] bg-gradient-to-r from-[#fff9f6] to-[#ffebd3] backdrop-blur-sm shadow-xl overflow-visible transition-all duration-300">
                {/* Logo */}
                <h1
                    className="text-4xl font-extrabold mb-2 text-[#ff4d2d] cursor-pointer hover:scale-110 transition-transform duration-200 select-none"
                    onClick={() => navigate("/")}
                    aria-label="Navigate to Home"
                >
                    Eat With Me
                </h1>

                {/* Desktop Search Box */}
                {userData?.role === "user" && (
                    <div className="md:w-[65%] lg:w-[45%] h-[75px] bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl flex items-center gap-6 border border-white/30 hover:border-[#ff4d2d]/30 transition-all duration-300 relative px-6">
                        <div className="flex items-center w-[32%] overflow-hidden gap-4 px-4 border-r-[2px] border-gray-300/60 relative">
                            <FaLocationDot className="w-7 h-7 text-[#ff4d2d] animate-pulse flex-shrink-0" />
                            <div className="w-[55%] truncate text-gray-700 font-semibold text-lg flex-shrink-0 pr-8">
                                {city || "Select City"}
                            </div>
                            <button
                                onClick={() => setShowCitySelector(true)}
                                className="text-sm text-[#ff4d2d] font-semibold hover:underline absolute right-3"
                                aria-label="Change City"
                            >
                                Change
                            </button>
                        </div>
                        <div className="w-[68%] flex items-center gap-4 relative group">
                            <IoIosSearch className="w-7 h-7 text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200" />
                            <input
                                type="text"
                                placeholder="Search delicious food..."
                                className="px-5 py-3 text-gray-800 outline-none w-full bg-transparent placeholder:text-gray-400 text-lg rounded-lg transition-colors duration-200 focus:placeholder:text-transparent"
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                aria-label="Search food items"
                            />
                            {input && (
                                <RxCross2
                                    className="absolute right-5 w-5 h-5 text-gray-400 cursor-pointer hover:text-[#ff4d2d] transition-colors duration-200"
                                    onClick={() => { setInput(""); }}
                                    aria-label="Clear search input"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Right Side Icons */}
                <div className="flex items-center gap-8 relative">
                    {/* Mobile search toggle */}
                    {userData?.role === "user" && (
                        !showSearch ? (
                            <IoIosSearch
                                className="w-7 h-7 text-[#ff4d2d] md:hidden cursor-pointer hover:scale-125 transition-transform duration-200"
                                onClick={() => setShowSearch(true)}
                                aria-label="Open search"
                            />
                        ) : (
                            <RxCross2
                                className="w-7 h-7 text-[#ff4d2d] md:hidden cursor-pointer hover:scale-125 transition-transform duration-200"
                                onClick={() => setShowSearch(false)}
                                aria-label="Close search"
                            />
                        )
                    )}

                    {/* Role-Based UI */}
                    {userData?.role === "owner" ? (
                        <>
                            <button
                                onClick={() => navigate("/additem")}
                                className="hidden md:flex items-center gap-3 px-5 py-3 cursor-pointer rounded-full bg-gradient-to-r from-[#ff4d2d]/20 to-[#ff8c42]/20 text-[#ff4d2d] font-semibold hover:from-[#ff4d2d]/30 hover:to-[#ff8c42]/30 shadow-lg transition-all duration-300"
                                aria-label="Add Food Item"
                            >
                                <FiPlus size={18} />
                                <span className="text-base">Add Food Item</span>
                            </button>
                            <button
                                onClick={() => navigate("/additem")}
                                className="flex md:hidden items-center justify-center p-4 cursor-pointer rounded-full bg-gradient-to-r from-[#ff4d2d]/20 to-[#ff8c42]/20 text-[#ff4d2d] hover:from-[#ff4d2d]/30 hover:to-[#ff8c42]/30 transition-all duration-300"
                                aria-label="Add Food Item"
                            >
                                <FiPlus size={22} />
                            </button>

                            <div
                                className="hidden md:flex items-center gap-3 cursor-pointer relative px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff4d2d]/20 to-[#ff8c42]/20 text-[#ff4d2d] font-semibold hover:from-[#ff4d2d]/30 hover:to-[#ff8c42]/30 transition-all duration-300 shadow-lg"
                                onClick={() => navigate("/pending-orders")}
                                aria-label="My Orders"
                            >
                                <TbReceipt2 className="w-6 h-6" />
                                <span className="text-base">My Orders</span>
                                {pendingOrdersCount > 0 && (
                                    <span className="absolute -right-3 -top-3 text-xs font-bold text-white bg-gradient-to-r from-[#ff4d2d] to-[#ff8c42] rounded-full px-2 py-[2px] animate-pulse shadow-lg">
                                        {pendingOrdersCount}
                                    </span>
                                )}
                            </div>

                            <div
                                className="flex md:hidden items-center justify-center relative p-4 rounded-full bg-gradient-to-r from-[#ff4d2d]/20 to-[#ff8c42]/20 text-[#ff4d2d]"
                                onClick={() => navigate("/pending-orders")}
                                aria-label="My Orders"
                            >
                                <TbReceipt2 className="w-6 h-6" />
                                {pendingOrdersCount > 0 && (
                                    <span className="absolute -right-2 -top-2 text-[10px] font-bold text-white bg-gradient-to-r from-[#ff4d2d] to-[#ff8c42] rounded-full px-2 py-[1px] animate-pulse shadow-md">
                                        {pendingOrdersCount}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : userData?.role === "deliveryBoy" ? (
                        <button
                            onClick={() => navigate("/my-delivered-orders")}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4d2d]/20 to-[#ff8c42]/20 text-[#ff4d2d] text-base font-semibold hover:from-[#ff4d2d]/30 hover:to-[#ff8c42]/30 transition-all duration-300 shadow-lg"
                            aria-label="My Orders"
                        >
                            My Orders
                        </button>
                    ) : (
                        <>
                            <div
                                className="relative cursor-pointer group"
                                onClick={() => navigate("/cart")}
                                aria-label={`Cart with ${cartItems?.length || 0} items`}
                            >
                                <LuShoppingCart className="w-7 h-7 text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200" />
                                {cartItems?.length > 0 && (
                                    <span className="absolute -right-2 -top-2 min-w-[22px] h-[22px] flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#ff4d2d] to-[#ff8c42] rounded-full animate-bounce shadow-lg">
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>

                            {userData?.role === "user" && (
                                <button
                                    onClick={() => navigate("/my-orders")}
                                    className="hidden md:block px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff4d2d]/20 to-[#ff8c42]/20 text-[#ff4d2d] text-base font-semibold hover:from-[#ff4d2d]/30 hover:to-[#ff8c42]/30 transition-all duration-300 shadow-lg"
                                    aria-label="My Orders"
                                >
                                    My Orders
                                </button>
                            )}
                        </>
                    )}

                    {/* Profile icon */}
                    <div className="relative overflow-visible">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ff4d2d] to-[#ff8c42] text-white text-xl shadow-xl font-bold cursor-pointer hover:scale-110 transition-transform duration-200 ring-4 ring-white/30 select-none"
                            onClick={() => setShowInfo(prev => !prev)}
                            aria-label="Toggle user info menu"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setShowInfo(prev => !prev);
                                }
                            }}
                        >
                            {userData?.fullName?.slice(0, 1).toUpperCase()}
                        </div>

                        {showInfo && (
                            <div className="fixed top-[90px] right-[20px] md:right-[12%] lg:right-[25%] w-[220px] bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-6 flex flex-col gap-6 z-[9999] border border-white/30 animate-in slide-in-from-top-2 duration-300">
                                <div className="text-xl font-bold text-gray-800 truncate">
                                    {userData?.fullName}
                                </div>

                                {userData?.role === "user" && (
                                    <div
                                        className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer py-3 px-4 rounded-xl hover:bg-[#ff4d2d]/10 transition-colors duration-200 text-center"
                                        onClick={() => {
                                            setShowInfo(false);
                                            navigate("/my-orders");
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                setShowInfo(false);
                                                navigate("/my-orders");
                                            }
                                        }}
                                    >
                                        My Orders
                                    </div>
                                )}

                                <div
                                    className="text-[#ff4d2d] font-semibold cursor-pointer py-3 px-4 rounded-xl hover:bg-[#ff4d2d]/10 transition-colors duration-200 text-center"
                                    onClick={handleLogOut}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleLogOut();
                                        }
                                    }}
                                >
                                    Log Out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Box */}
            {showSearch && userData?.role === "user" && (
                <div className="w-[92%] h-[75px] bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl flex items-center gap-6 left-[4%] top-[90px] border border-white/30 animate-in slide-in-from-top-2 duration-300 md:hidden relative px-6">
                    <div className="flex items-center w-[35%] overflow-hidden gap-4 px-4 border-r-[2px] border-gray-300/60 relative">
                        <FaLocationDot className="w-7 h-7 text-[#ff4d2d] animate-pulse flex-shrink-0" />
                        <div className="w-[55%] truncate text-gray-700 font-semibold text-lg flex-shrink-0 pr-8">
                            {city || "Select City"}
                        </div>
                        <button
                            onClick={() => setShowCitySelector(true)}
                            className="text-sm text-[#ff4d2d] font-semibold hover:underline absolute right-3"
                            aria-label="Change City"
                        >
                            Change
                        </button>
                    </div>
                    <div className="w-[65%] flex items-center gap-4 relative group">
                        <IoIosSearch className="w-7 h-7 text-[#ff4d2d] group-hover:scale-110 transition-transform duration-200" />
                        <input
                            type="text"
                            placeholder="Search delicious food..."
                            className="px-5 py-3 text-gray-800 outline-none w-full bg-transparent placeholder:text-gray-400 text-lg rounded-lg transition-colors duration-200 focus:placeholder:text-transparent"
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            aria-label="Search food items"
                        />
                        {input && (
                            <RxCross2
                                className="absolute right-5 w-5 h-5 text-gray-400 cursor-pointer hover:text-[#ff4d2d] transition-colors duration-200"
                                onClick={() => { setInput(""); }}
                                aria-label="Clear search input"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* City Selector Modal */}
            <CitySelector isOpen={showCitySelector} onClose={() => setShowCitySelector(false)} />
        </>
    );
}

export default Nav;