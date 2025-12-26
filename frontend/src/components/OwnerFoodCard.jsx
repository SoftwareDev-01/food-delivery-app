import React, { useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setShop } from "../redux/userSlice";

export default function OwnerFoodCard({ item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* ---------------- Delete Handler ---------------- */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const res = await axios.delete(
        `${serverUrl}/api/item/delete/${item._id}`,
        { withCredentials: true }
      );

      dispatch(setShop(res.data.shop));
    } catch (error) {
      console.error(error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="flex bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-[#ff4d2d]/30 w-full max-w-2xl"
      role="article"
    >
      {/* ---------------- Image ---------------- */}
      <div className="w-36 h-36 flex-shrink-0 bg-gray-100">
        <img
          src={
            imageError
              ? "https://via.placeholder.com/150?text=Food"
              : item.image
          }
          alt={item.name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ---------------- Content ---------------- */}
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h3 className="text-lg font-bold text-[#ff4d2d] truncate">
            {item.name}
          </h3>

          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {item.description || "No description provided"}
          </p>

          <div className="mt-3 text-xs text-gray-500 space-y-1">
            <p>
              <span className="font-semibold text-gray-700">Category:</span>{" "}
              {item.category || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Type:</span>{" "}
              {item.type || "N/A"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">
                Availability:
              </span>{" "}
              {item.availability ? (
                <span className="text-green-600 font-semibold">
                  Available
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Not Available
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ---------------- Footer ---------------- */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-[#ff4d2d] font-extrabold text-lg">
            ₹{item.price}
          </span>

          <div className="flex items-center gap-2">
            {/* Edit */}
            <button
              onClick={() => navigate(`/editItem/${item._id}`)}
              aria-label={`Edit ${item.name}`}
              className="p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d] transition-colors"
            >
              <FiEdit size={18} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Delete ${item.name}`}
              className={`p-2 rounded-full transition-colors ${
                isDeleting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-red-100 text-red-500"
              }`}
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
