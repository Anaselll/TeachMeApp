import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";
import Logo from "../assets/logo.png";
import toast from "react-hot-toast";
import SocketContext from "../context/SocketContext";
import { Menu, X, ChevronDown, User, LogOut, Calendar, CreativeCommons } from "lucide-react";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const { disconnectSocket } = useContext(SocketContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      disconnectSocket();
      toast.success("You have successfully logged out");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Error while logging out. Please try again");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="w-full bg-[#dbdada] shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="w-12 h-12" />
            <span className="ml-2 text-[#191A2C] font-bold text-xl hidden sm:block">
              TeachMe
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex gap-x-8">
            <li>
              <Link
                to="/"
                className="text-[#191A2C] font-medium hover:text-[#6D5DA6] transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/About"
                className="text-[#191A2C] font-medium hover:text-[#6D5DA6] transition duration-200"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/Contact"
                className="text-[#191A2C] font-medium hover:text-[#6D5DA6] transition duration-200"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Auth buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-[#191A2C] font-medium hover:text-[#6D5DA6] transition duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-[#A7E629] hover:bg-[#9bf185] transition duration-200 text-black rounded-lg px-5 py-2 font-medium shadow-sm"
              >
                Start your journey
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center text-[#191A2C] font-medium hover:text-[#6D5DA6] transition duration-200">
                  <User className="h-5 w-5 mr-1" />
                  <span className="truncate max-w-[100px]">
                    {user.fullName || "Profile"}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1 rounded-md bg-white">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/sessions"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      My Sessions
                    </Link>
                    <Link
                      to={`/create-course/${user._id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CreativeCommons className="h-4 w-4 mr-2" />
                      Create Course
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-[#191A2C] focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/About"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/Contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            <div className="pt-4 pb-3 border-t border-gray-200">
              {!user ? (
                <div className="flex flex-col space-y-3 px-3">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-center bg-[#A7E629] text-white font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start your journey
                  </Link>
                </div>
              ) : (
                <div className="space-y-1 px-3">
                  <Link
                    to="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/sessions"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    My Sessions
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-[#191A2C] hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
