import React from "react";
import { FaUtensils, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const FooterRoyal = () => {
  return (
    <footer className="
      bg-gradient-to-b from-[#4A0E0E] to-[#2B0000]
      text-[#FFDFA8]
      mt-auto shadow-[0_-4px_15px_rgba(255,215,0,0.15)]
      border-t border-[#C9A227]/20
      backdrop-blur-xl
    ">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaUtensils className="w-7 h-7 text-[#D4AF37] drop-shadow-sm" />
              <h3 className="text-2xl font-bold tracking-wide text-[#F6E6C2]">
                EatWithMe
              </h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Taste the luxury of royal dining delivered directly to your doorstep.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-[#FFD37A] tracking-wide">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="hover:text-white transition-all">Home</a></li>
              <li><a href="/restaurants" className="hover:text-white transition-all">Restaurants</a></li>
              <li><a href="/offers" className="hover:text-white transition-all">Offers</a></li>
              <li><a href="/contact" className="hover:text-white transition-all">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-[#FFD37A] tracking-wide">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/privacy" className="hover:text-white transition-all">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-all">Terms of Service</a></li>
              <li><a href="/refund" className="hover:text-white transition-all">Refund Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-[#FFD37A] tracking-wide">Follow Us</h4>
            <div className="flex gap-5">
              <a aria-label="Facebook" href="#" className="hover:scale-125 transition-transform hover:text-white">
                <FaFacebook size={22} />
              </a>
              <a aria-label="Instagram" href="#" className="hover:scale-125 transition-transform hover:text-white">
                <FaInstagram size={22} />
              </a>
              <a aria-label="Twitter" href="#" className="hover:scale-125 transition-transform hover:text-white">
                <FaTwitter size={22} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#C9A227]/30 mt-10 pt-5 text-center text-xs opacity-75">
          © {new Date().getFullYear()} EatWithMe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default FooterRoyal;