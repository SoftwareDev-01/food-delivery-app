import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";

const popularCities = ["Noida", "Banglore", "Delhi", "Agra", "Lucknow"];

const CitySelectorRoyal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { city: currentCity } = useSelector((state) => state.user);

  const modalRef = useRef(null);
  const abortRef = useRef(null);

  const [search, setSearch] = useState("");
  const [cities, setCities] = useState(popularCities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const filteredCities = useMemo(
    () => cities.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [cities, search]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000]
        bg-black/70 backdrop-blur-md
        flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md max-h-[85vh]
          bg-gradient-to-br from-[#2B0000] via-[#3D0A0A] to-[#4A0E0E]
          border border-[#C9A227]/40 rounded-3xl
          shadow-[0_0_50px_rgba(201,162,39,0.3)]
          flex flex-col overflow-hidden text-[#FFDFA8]
          animate-fade-in-slide-down"
      >
        <div className="p-6 border-b border-[#C9A227]/40">
          <h3 className="text-2xl font-extrabold text-[#FFD37A] tracking-wide">
            Select Your City
          </h3>
        </div>

        <div className="p-6">
          <input
            autoFocus
            type="search"
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border
            bg-[#190404]/40 text-[#FFDFA8]
            border-[#C9A227]/40
            focus:ring-2 focus:ring-[#C9A227]
            outline-none placeholder-[#E8C56C]/60"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-400 py-8">{error}</p>
          )}

          {!loading && !error && filteredCities.length === 0 && (
            <p className="text-center text-[#F6E6C2]/70 py-8">No cities found</p>
          )}

          {!loading && filteredCities.map((c) => (
            <button
              key={c}
              onClick={() => {
                dispatch(setCity(c));
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 flex justify-between items-center transition
                ${currentCity === c
                  ? "bg-[#C9A227]/25 text-[#FFD37A] font-semibold border border-[#C9A227]/60"
                  : "hover:bg-[#C9A227]/15"}`}
            >
              {c}
              {currentCity === c && <span>👑</span>}
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-[#C9A227]/40">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border font-semibold
              border-[#C9A227]/50 text-[#FFDFA8]
              hover:bg-[#300707]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelectorRoyal;