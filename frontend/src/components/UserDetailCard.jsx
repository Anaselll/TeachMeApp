import { X } from "lucide-react";
import { useRef, useEffect } from "react";
import avatar from '../assets/avatar.jpg'

const UserDetailCard = ({ user, onClose }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!user) return null;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        ref={cardRef}
        className="w-80 rounded-xl bg-gray-900 shadow-2xl ring-1 ring-gray-700 border border-gray-700"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-200">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* User details */}
        <div className="p-5">
          <div className="flex items-center space-x-4">
            <img
              src={user.profilePic? user.profilePic :avatar}
              alt="Profile"
              className="h-14 w-14 rounded-full border border-gray-600 object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-white truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Member since:</span>
                <span className="text-xs font-medium text-gray-300">
                  {formattedDate}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailCard;
