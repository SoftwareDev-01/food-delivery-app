import React, { memo, useMemo } from "react";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaDrumstickBite,
  FaLeaf,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../redux/userSlice";

const FoodCardRoyal = ({ data }) => {
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.user.cartItems.find((i) => i.id === data._id)
  );

  const quantity = cartItem?.quantity || 0;

  const increase = () => {
    if (cartItem) {
      dispatch(updateQuantity({ id: data._id, quantity: quantity + 1 }));
    } else {
      dispatch(
        addToCart({
          id: data._id,
          name: data.name,
          shop: data.shop,
          price: data.price,
          quantity: 1,
          image: data.image,
          type: data.type,
        })
      );
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id: data._id, quantity: quantity - 1 }));
    }
  };

  const stars = useMemo(() => {
    const rating = Math.round(data.rating?.average || 0);
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-[#FFD700] drop-shadow-md" />
      ) : (
        <FaRegStar key={i} className="text-[#FFD700] opacity-50" />
      )
    );
  }, [data.rating]);

  return (
    <div
      className="
        w-[260px] rounded-3xl
        bg-gradient-to-br from-[#2B0000] via-[#3D0A0A] to-[#4A0E0E]
        border border-[#C9A227]/30
        shadow-[0_8px_25px_rgba(201,162,39,0.25)]
        hover:shadow-[0_10px_35px_rgba(201,162,39,0.4)]
        backdrop-blur-lg
        transition-all duration-500
        flex flex-col overflow-hidden
        hover:scale-[1.05]
      "
    >
      {/* Image */}
      <div className="relative h-[180px]">
        <div className="absolute top-3 right-3 bg-[#FFF6CC]/40 backdrop-blur-xl border border-[#D4AF37] rounded-full p-1 shadow-lg">
          {data.type === "veg" ? (
            <FaLeaf className="text-[#00b32d]" />
          ) : (
            <FaDrumstickBite className="text-[#ff5353]" />
          )}
        </div>

        <img
          src={data.image}
          alt={data.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/food-placeholder.png")}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-2 text-[#FFDFA8]">
        <h3 className="font-semibold text-lg whitespace-nowrap overflow-hidden text-ellipsis tracking-wide">
          {data.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-[#FFD700]">
          {stars}
          <span className="text-xs text-[#E8C56C] ml-1">
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-[#FFD37A] drop-shadow-md">
            ₹{data.price}
          </span>

          {/* Cart Controls */}
          <div className="flex items-center rounded-full bg-[#190404]/50 border border-[#C9A227]/40 shadow-inner text-[#FFDFA8] overflow-hidden">
            <button
              onClick={decrease}
              disabled={quantity === 0}
              className="px-2 py-1 disabled:opacity-40 hover:bg-[#300707] transition"
            >
              <FaMinus size={12} />
            </button>

            <span className="px-3 text-sm font-semibold">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="px-2 py-1 hover:bg-[#300707] transition"
            >
              <FaPlus size={12} />
            </button>

            <button
              onClick={increase}
              aria-label="Add to cart"
              className={`
                px-4 py-2 font-medium
                transition-all duration-300
                ${cartItem ? "bg-black/80 hover:bg-black" : "bg-[#C9A227] text-black hover:bg-[#B89622]"}
              `}
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FoodCardRoyal);
