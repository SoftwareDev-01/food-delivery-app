import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";

const popularCities = ["Noida", "Banglore", "Delhi", "Agra", "Lucknow"];

const CitySelector = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { city: currentCity } = useSelector((state) => state.user);

  const modalRef = useRef(null);
  const abortRef = useRef(null);

  const [search, setSearch] = useState("");
  const [cities, setCities] = useState(popularCities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- Fetch Cities ---------------- */
  useEffect(() => {
    if (!isOpen) return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError("");

    axios
      .get(`${serverUrl}/api/shop/unique-cities`, {
        withCredentials: true,
        signal: abortRef.current.signal,
      })
      .then((res) => {
        const fetched = res?.data?.cities ?? [];
        setCities([...new Set([...popularCities, ...fetched])].sort());
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error(err);
          setError("Failed to load cities");
          setCities(popularCities);
        }
      })
      .finally(() => setLoading(false));

    return () => abortRef.current?.abort();
  }, [isOpen]);

  /* ---------------- ESC + Focus Trap ---------------- */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          "button, [tabindex='0'], input"
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  /* ---------------- Filtering ---------------- */
  const filteredCities = useMemo(
    () =>
      cities.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [cities, search]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-selector-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="
          w-full max-w-md max-h-[85vh]
          bg-white rounded-3xl shadow-2xl
          flex flex-col overflow-hidden
          animate-fade-in-slide-down
        "
      >
        {/* Header */}
        <div className="p-6 border-b">
          <h3
            id="city-selector-title"
            className="text-2xl font-extrabold text-gray-900"
          >
            Select Your City
          </h3>
        </div>

        {/* Search */}
        <div className="p-6">
          <input
            autoFocus
            type="search"
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
            className="
              w-full px-4 py-3 rounded-xl border
              focus:ring-2 focus:ring-[#ff4d2d]/60
              outline-none
            "
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#ff4d2d]/30 border-t-[#ff4d2d] rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-500 py-8">{error}</p>
          )}

          {!loading && !error && filteredCities.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No cities found
            </p>
          )}

          {!loading &&
            filteredCities.map((c) => (
              <button
                key={c}
                onClick={() => {
                  dispatch(setCity(c));
                  onClose();
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-xl mb-1
                  flex justify-between items-center
                  transition-colors
                  ${
                    currentCity === c
                      ? "bg-[#ff4d2d]/20 text-[#ff4d2d] font-semibold"
                      : "hover:bg-[#ff4d2d]/10"
                  }
                `}
              >
                {c}
                {currentCity === c && "✓"}
              </button>
            ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border font-semibold hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
