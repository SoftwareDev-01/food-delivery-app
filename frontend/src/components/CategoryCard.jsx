import React, { memo } from "react";

const CategoryCardRoyal = ({ image, name = "Category", onClick, isLoading = false }) => {
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
        rounded-3xl
        bg-gradient-to-br from-[#2B0000] via-[#3D0A0A] to-[#4A0E0E]
        border border-[#C9A227]/40
        shadow-[0_6px_20px_rgba(201,162,39,0.25)]
        hover:shadow-[0_8px_30px_rgba(201,162,39,0.45)]
        overflow-hidden
        transition-all duration-500 hover:scale-[1.07]
        focus:outline-none focus:ring-2 focus:ring-[#C9A227]
        disabled:opacity-50 disabled:cursor-not-allowed
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
            transition-transform duration-500
            hover:scale-110
            opacity-90
          "
        />
      ) : (
        <div className="absolute inset-0 bg-[#3d0a0a]/60 animate-pulse" />
      )}

      {/* Label */}
      <div
        className="
          absolute bottom-0 left-0 w-full
          bg-[#190404]/60 backdrop-blur-lg
          border-t border-[#C9A227]/40
          px-3 py-2
          text-center text-sm font-semibold tracking-wide
          text-[#FFD37A]
        "
      >
        {name}
      </div>
    </button>
  );
};

export default memo(CategoryCardRoyal);