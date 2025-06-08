import { useContext, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import SocketContext from "../context/SocketContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Login() {
  const { connectSocket } = useContext(SocketContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const redirect = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axiosInstance
      .post("/auth/login", formData)
      .then((res) => {
        redirect("/");
        setUser(res.data);
        connectSocket();
        toast.success("Logged in successfully");
      })
      .catch(() => {
        toast.error("Invalid email or password");
      });
   
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#868ddb] to-[#252644] flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-gradient-to-b from-[#a3a6d3] to-[#252644] rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Welcome Back
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="••••••••"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-[#A7E629] text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
