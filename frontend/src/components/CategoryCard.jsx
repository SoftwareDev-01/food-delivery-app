import React, { memo } from "react";

const CategoryCard = ({
  image,
  name = "Category",
  onClick,
  isLoading = false,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${name} category`}
      disabled={isLoading}
      className="
        relative shrink-0
        w-[120px] h-[120px]
        md:w-[180px] md:h-[180px]
        rounded-2xl border-2 border-[#ff4d2d]
        bg-white overflow-hidden
        shadow-md hover:shadow-xl
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/60
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {/* Image */}
      {!isLoading ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/fallback-image.png";
          }}
          className="
            absolute inset-0 w-full h-full object-cover
            transition-transform duration-300
            hover:scale-110
          "
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Label */}
      <div
        className="
          absolute bottom-0 left-0 w-full
          bg-white/90 backdrop-blur
          px-3 py-1
          rounded-t-xl
          text-center text-sm font-semibold text-gray-800
        "
      >
        {name}
      </div>
    </button>
  );
};

export default memo(CategoryCard);
