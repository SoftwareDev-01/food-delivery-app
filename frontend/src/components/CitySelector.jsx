import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCity } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';

// Fallback popular cities
const popularCities = ['Noida', 'Banglore', 'Delhi', 'Agra', 'Lucknow'];

const CitySelector = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { city: currentCity } = useSelector((state) => state.user);
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState(popularCities);
  const [loading, setLoading] = useState(false);

  // Fetch cities on open
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    axios
      .get(`${serverUrl}/api/shop/unique-cities`, { withCredentials: true })
      .then((res) => {
        const fetchedCities = res.data.cities || [];
        const allCities = [...new Set([...popularCities, ...fetchedCities])].sort();
        setCities(allCities);
      })
      .catch((err) => {
        console.error('Error fetching cities:', err);
        setCities(popularCities);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Filter cities by search input
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Handle ESC key to close modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      setSearch('');
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="city-selector-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20
          animate-fade-in-slide-down relative flex flex-col"
      >
        <h3
          id="city-selector-title"
          className="text-2xl font-extrabold mb-6 text-gray-900 select-none"
        >
          Select Your City
        </h3>

        <div className="relative mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            autoFocus
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={loading}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-gray-800
              focus:outline-none focus:ring-3 focus:ring-[#ff4d2d]/60 focus:border-transparent
              transition-shadow duration-200 shadow-sm"
            aria-label="Search cities"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <svg
              className="animate-spin h-10 w-10 text-[#ff4d2d]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <ul
            className="max-h-56 overflow-y-auto space-y-1 scroll-smooth pr-2"
            tabIndex={-1}
            aria-label="List of cities"
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((c) => (
                <li
                  key={c}
                  className={`p-3 cursor-pointer rounded-xl transition-colors duration-200
                    flex items-center justify-between select-none
                    ${
                      currentCity === c
                        ? 'bg-[#ff4d2d]/20 text-[#ff4d2d] font-semibold shadow-inner'
                        : 'hover:bg-[#ff4d2d]/10 hover:text-[#ff4d2d]'
                    }`}
                  onClick={() => {
                    dispatch(setCity(c));
                    onClose();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      dispatch(setCity(c));
                      onClose();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={currentCity === c}
                >
                  {c}
                  {currentCity === c && (
                    <svg
                      className="w-5 h-5 text-[#ff4d2d]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500 select-none">No cities found</li>
            )}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold
            hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CitySelector;
