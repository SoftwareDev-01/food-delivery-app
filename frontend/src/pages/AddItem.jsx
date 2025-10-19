import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setShop } from "../redux/userSlice";
import { motion } from "framer-motion";

export default function AddItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("veg");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/additem`,
        formData,
        { withCredentials: true }
      );
      dispatch(setShop(result.data.shop));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center p-6 sm:p-12 relative">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        aria-label="Go Back"
        className="absolute top-6 left-6 text-[#2DD4BF] hover:text-[#7C3AED] transition-colors focus:outline-none"
      >
        <MdKeyboardBackspace className="w-8 h-8" />
      </button>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl border border-[#2DD4BF] max-w-lg w-full p-10 sm:p-12 space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-[#1E293B] text-center select-none">
          Add New Food Item
        </h2>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-[#1E293B] font-semibold mb-2 select-none"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Food Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-[#CBD5E1] rounded-xl px-5 py-3 text-[#1E293B] placeholder-[#CBD5E1] focus:outline-none focus:ring-4 focus:ring-[#2DD4BF] transition"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-[#1E293B] font-semibold mb-2 select-none"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            placeholder="Enter Price in ₹"
            value={price}
            min="0"
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-[#CBD5E1] rounded-xl px-5 py-3 text-[#1E293B] placeholder-[#CBD5E1] focus:outline-none focus:ring-4 focus:ring-[#2DD4BF] transition"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-[#1E293B] font-semibold mb-2 select-none"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border border-[#CBD5E1] rounded-xl px-5 py-3 text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-[#2DD4BF] transition"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-[#1E293B] font-semibold mb-2 select-none"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImage}
            className="w-full border border-[#CBD5E1] rounded-xl px-5 py-2 cursor-pointer text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-[#2DD4BF] transition"
          />
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Preview"
              className="mt-4 rounded-xl w-full h-52 object-cover border border-[#CBD5E1] shadow-md"
              loading="lazy"
            />
          )}
        </div>

        {/* Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-[#1E293B] font-semibold mb-2 select-none"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border border-[#CBD5E1] rounded-xl px-5 py-3 text-[#1E293B] focus:outline-none focus:ring-4 focus:ring-[#2DD4BF] transition"
          >
            <option value="veg">Veg</option>
            <option value="non veg">Non Veg</option>
          </select>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#2DD4BF] to-[#7C3AED] text-white font-bold rounded-full px-7 py-3 shadow-lg hover:shadow-2xl transition-all"
        >
          <FaPlus /> Add Item
        </motion.button>
      </motion.form>
    </div>
  );
}
