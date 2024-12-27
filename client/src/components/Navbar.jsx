import { Link } from "react-router-dom";
import logo from "../assets/logoo.png";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="w-full px-8">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="NepXpress Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                NepXpress
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex space-x-12">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                Service
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/login"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
