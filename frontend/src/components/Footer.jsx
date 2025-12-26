import React from "react";
import { FaUtensils, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#ff4d2d] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaUtensils className="w-6 h-6" />
              <h3 className="text-xl font-bold">EatWithMe</h3>
            </div>
            <p className="text-sm text-orange-100">
              Delicious food delivered fast & fresh to your doorstep.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-orange-100">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/restaurants" className="hover:underline">Restaurants</a></li>
              <li><a href="/offers" className="hover:underline">Offers</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-orange-100">
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
              <li><a href="/refund" className="hover:underline">Refund Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4">
              <a aria-label="Facebook" href="#" className="hover:scale-110 transition-transform">
                <FaFacebook size={20} />
              </a>
              <a aria-label="Instagram" href="#" className="hover:scale-110 transition-transform">
                <FaInstagram size={20} />
              </a>
              <a aria-label="Twitter" href="#" className="hover:scale-110 transition-transform">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-8 pt-4 text-center text-sm text-orange-100">
          &copy; {new Date().getFullYear()} EatWithMe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
