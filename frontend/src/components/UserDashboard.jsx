import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CategoryCard from "./CategoryCard";
import FoodCard from "./FoodCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const { city, shopsOfCity, itemsOfCity, searchItems } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  const categoryRef = useRef(null);
  const shopRef = useRef(null);

  const [filteredItems, setFilteredItems] = useState([]);
  const [showCateNav, setShowCateNav] = useState({ left: false, right: false });
  const [showShopNav, setShowShopNav] = useState({ left: false, right: false });

  /* ---------------- Helpers ---------------- */
  const updateScrollButtons = (ref, setter) => {
    const el = ref.current;
    if (!el) return;

    setter({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  };

  const scroll = (ref, dir) => {
    ref.current?.scrollBy({
      left: dir === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    setFilteredItems(itemsOfCity || []);
  }, [itemsOfCity]);

  useEffect(() => {
    const cateEl = categoryRef.current;
    const shopEl = shopRef.current;

    const cateListener = () =>
      updateScrollButtons(categoryRef, setShowCateNav);
    const shopListener = () =>
      updateScrollButtons(shopRef, setShowShopNav);

    cateEl?.addEventListener("scroll", cateListener);
    shopEl?.addEventListener("scroll", shopListener);

    updateScrollButtons(categoryRef, setShowCateNav);
    updateScrollButtons(shopRef, setShowShopNav);

    return () => {
      cateEl?.removeEventListener("scroll", cateListener);
      shopEl?.removeEventListener("scroll", shopListener);
    };
  }, [categories, shopsOfCity]);

  /* ---------------- Handlers ---------------- */
  const handleCategoryFilter = (category) => {
    if (category === "All") {
      setFilteredItems(itemsOfCity);
    } else {
      setFilteredItems(
        itemsOfCity?.filter((item) => item.category === category)
      );
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col items-center pt-[100px] gap-10">
      <Nav />

      {/* 🔍 SEARCH RESULTS */}
      {searchItems?.length > 0 && (
        <section className="w-full max-w-6xl bg-white rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Search Results
          </h2>

          <div className="flex flex-wrap gap-6 justify-center">
            {searchItems.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        </section>
      )}

      {/* 🍱 CATEGORIES */}
      <section className="w-full max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Inspiration for your first order
        </h2>

        <div className="relative">
          {showCateNav.left && (
            <button
              aria-label="Scroll left"
              onClick={() => scroll(categoryRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#ff4d2d] text-white p-2 rounded-full shadow"
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            ref={categoryRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#ff4d2d]"
          >
            {categories.map((cate) => (
              <CategoryCard
                key={cate.category}
                name={cate.category}
                image={cate.image}
                onClick={() => handleCategoryFilter(cate.category)}
              />
            ))}
          </div>

          {showCateNav.right && (
            <button
              aria-label="Scroll right"
              onClick={() => scroll(categoryRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#ff4d2d] text-white p-2 rounded-full shadow"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </section>

      {/* 🏪 SHOPS */}
      <section className="w-full max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Best shops in {city}
        </h2>

        <div className="relative">
          {showShopNav.left && (
            <button
              onClick={() => scroll(shopRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#ff4d2d] text-white p-2 rounded-full shadow"
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            ref={shopRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#ff4d2d]"
          >
            {shopsOfCity?.map((shop) => (
              <CategoryCard
                key={shop._id}
                name={shop.name}
                image={shop.image}
                onClick={() => navigate(`/shop-items/${shop._id}`)}
              />
            ))}
          </div>

          {showShopNav.right && (
            <button
              onClick={() => scroll(shopRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#ff4d2d] text-white p-2 rounded-full shadow"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </section>

      {/* 🍔 FOOD ITEMS */}
      <section className="w-full max-w-6xl px-4 mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Suggested items
        </h2>

        {filteredItems?.length > 0 ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {filteredItems.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 font-semibold text-lg py-10">
            No items found 🍽️
          </div>
        )}
      </section>
    </div>
  );
}

export default UserDashboard;
