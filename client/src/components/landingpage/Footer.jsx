import { Link } from "react-router-dom";
import logo from "../../assets/logoo.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold">NepXpress</span>
            </Link>
            <p className="text-white/80 mb-4">
              Your trusted partner for fast and reliable courier services across
              Nepal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-yellow-300">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-yellow-300">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-yellow-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services/domestic"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Domestic Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/services/express"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link
                  to="/services/bulk"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Bulk Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/services/warehousing"
                  className="text-white/80 hover:text-yellow-300"
                >
                  Warehousing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-yellow-300"></i>
                <span className="text-white/80">Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-phone text-yellow-300"></i>
                <span className="text-white/80">+977-1-4XXXXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope text-yellow-300"></i>
                <span className="text-white/80">info@nepxpress.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © {new Date().getFullYear()} NepXpress. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-white/80 hover:text-yellow-300 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-white/80 hover:text-yellow-300 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
