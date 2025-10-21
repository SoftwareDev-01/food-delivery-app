import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/userSlice";
import axios from 'axios';
import { serverUrl } from '../App'; // Adjust path if needed, based on your Nav.jsx import

function getCity() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.log("Geolocation is not supported by your browser.");
      dispatch(setCity("Agra")); // Fallback to popular city
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`);

        try {
          // 🔑 apna Geoapify API key yaha lagao
          const apiKey = "812d749999de462e9df7ca070383975b";

          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
          );
          const data = await response.json();

          let detectedCity =
            data?.features?.[0]?.properties?.city ||
            data?.features?.[0]?.properties?.town ||
            data?.features?.[0]?.properties?.village ||
            data?.features?.[0]?.properties?.state ||
            "Unknown";

          // First, set the detected city
          dispatch(setCity(detectedCity));

          // Now, check if shops exist in this city
          try {
            const shopCheck = await axios.get(
              `${serverUrl}/api/shop/shops-by-city?city=${detectedCity}`,
              { withCredentials: true }
            );
            if (!shopCheck.data.shops || shopCheck.data.shops.length === 0) {
              console.log(`No shops in ${detectedCity}, falling back to New York`);
              dispatch(setCity("Agra")); // Fallback to popular city
            }
          } catch (shopErr) {
            console.error("Error checking shops:", shopErr);
            // If shop check fails, stick with detected or fallback anyway
            dispatch(setCity("Agra"));
          }
        } catch (err) {
          console.error("Error fetching city name:", err);
          dispatch(setCity("Agra")); // Fallback on geocode error
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        dispatch(setCity("New York")); // Fallback on geolocation error
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [dispatch]);
}

export default getCity;