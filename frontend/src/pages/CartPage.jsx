import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { updateQuantity, removeFromCart } from "../redux/userSlice";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function CartPageRoyal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B0000] via-[#3D0A0A] to-[#4A0E0E] text-[#FFDFA8] flex justify-center p-6 pt-[120px]">
      <div className="w-full max-w-[850px]">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/")}
            className="p-2 rounded-full bg-[#C9A227]/30 hover:bg-[#C9A227]/50 text-black transition">
            <MdKeyboardBackspace className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-[#FFD37A] drop-shadow-sm">Your Royal Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-[#F6E6C2]/70 text-lg">Your cart is empty 👑</p>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div key={item.id}
                  className="flex items-center justify-between
                    bg-[#2B0000]/50 border border-[#C9A227]/40 rounded-2xl shadow-lg p-4">

                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-[#C9A227]/40" />
                    <div>
                      <h3 className="font-semibold text-[#FFDFA8]">{item.name}</h3>
                      <p className="text-sm text-[#E8C56C]">₹{item.price} × {item.quantity}</p>
                      <p className="text-lg font-bold text-[#FFD37A]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDecrease(item.id, item.quantity)}
                      className="p-2 bg-[#190404]/60 border border-[#C9A227]/30 rounded-full hover:bg-[#300707] transition">
                      <FaMinus size={12} />
                    </button>

                    <span className="text-[#FFDFA8] font-semibold min-w-[20px] text-center">{item.quantity}</span>

                    <button onClick={() => handleIncrease(item.id, item.quantity)}
                      className="p-2 bg-[#190404]/60 border border-[#C9A227]/30 rounded-full hover:bg-[#300707] transition">
                      <FaPlus size={12} />
                    </button>

                    <button onClick={() => handleRemove(item.id)}
                      className="p-2 bg-[#4A0E0E] text-[#FFD37A] border border-[#C9A227]/40 rounded-full hover:bg-red-900 transition">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-8 bg-[#2B0000]/60 border border-[#C9A227]/40 rounded-2xl p-4 shadow-xl
              flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#FFDFA8]">Total</h3>
              <span className="text-2xl font-bold text-[#FFD37A] drop-shadow-sm">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Checkout */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/checkout")}
                className="px-8 py-3 rounded-xl bg-[#C9A227]/40 text-black font-semibold text-lg
                  hover:bg-[#C9A27ıll]/50 border border-[#C9A227]/60 shadow-lg transition">
                Proceed to Checkout 👑
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPageRoyal;