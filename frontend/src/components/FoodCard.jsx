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

const FoodCard = ({ data }) => {
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.user.cartItems.find((i) => i.id === data._id)
  );

  const quantity = cartItem?.quantity || 0;

  /* ---------------- Quantity Handlers ---------------- */
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

  /* ---------------- Rating ---------------- */
  const stars = useMemo(() => {
    const rating = Math.round(data.rating?.average || 0);
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );
  }, [data.rating]);

  return (
    <div
      className="
        w-[250px] rounded-2xl border-2 border-[#ff4d2d]
        bg-white shadow-md hover:shadow-xl
        transition-all duration-300
        flex flex-col overflow-hidden
      "
    >
      {/* Image */}
      <div className="relative h-[170px] bg-gray-50">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.type === "veg" ? (
            <FaLeaf className="text-green-600" />
          ) : (
            <FaDrumstickBite className="text-red-600" />
          )}
        </div>

        <img
          src={data.image}
          alt={data.name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/food-placeholder.png")}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-gray-900 truncate">
          {data.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {stars}
          <span className="text-xs text-gray-500">
            ({data.rating?.count || 0})
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          <span className="text-lg font-bold">₹{data.price}</span>

          {/* Cart Controls */}
          <div className="flex items-center border rounded-full overflow-hidden">
            <button
              onClick={decrease}
              disabled={quantity === 0}
              aria-label="Decrease quantity"
              className="px-2 py-1 disabled:opacity-40"
            >
              <FaMinus size={12} />
            </button>

            <span className="px-3 text-sm font-medium">
              {quantity}
            </span>

            <button
              onClick={increase}
              aria-label="Increase quantity"
              className="px-2 py-1"
            >
              <FaPlus size={12} />
            </button>

            <button
              onClick={increase}
              aria-label="Add to cart"
              className={`
                px-3 py-2 text-white transition-colors
                ${cartItem ? "bg-gray-700" : "bg-[#ff4d2d]"}
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

export default memo(FoodCard);
