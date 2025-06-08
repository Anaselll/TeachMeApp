import { useContext, useState, useEffect } from "react";
import {
  Camera,
  Mail,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Edit,
  Save,
  Star,
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { AuthContext } from "../context/AuthContext";
import avatar from "../assets/avatar.jpg";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.profile?.bio || "",
        education: user.profile?.education || [],
        contact: user.profile?.contact || {},
        location: user.profile?.location || {},
        role: user.role || "student",
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgData = new FormData();
    imgData.append("profilePic", file);

    try {
      const res = await axiosInstance.post(
        "/api/auth/updateProfilePic",
        imgData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.put("/auth/updateProfile", formData);
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  if (!user)
    return <div className="text-center py-20 text-white">Loading...</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#868ddb] to-[#252644]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-32 bg-[#6366F1]">
            <div className="absolute -bottom-16 left-6">
              <div className="relative group w-32 h-32">
                <img
                  src={user.profilePic || avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#A7E629] p-2 rounded-full cursor-pointer group-hover:scale-105 transition"
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-8 pb-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.fullName}
                </h1>
                {isEditing ? (
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="text-sm text-indigo-500 capitalize bg-white border px-2 py-1 rounded"
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="both">Both</option>
                  </select>
                ) : (
                  <p className="text-sm text-indigo-500 capitalize">
                    {user.role}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                  {isEditing ? <Save size={16} /> : <Edit size={16} />}
                  {isEditing ? "Cancel" : "Edit"}
                </button>
                {isEditing && (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            {/* About Me */}
            <section className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <User size={18} className="text-indigo-500" /> About Me
              </h2>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full mt-2 p-3 border rounded-lg"
                  rows="3"
                />
              ) : (
                <p className="text-gray-600 mt-2">
                  {user.profile?.bio || "No bio provided yet."}
                </p>
              )}
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <section className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Contact Info
                </h2>
                <div className="space-y-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="text-indigo-500" size={18} />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-indigo-500" size={18} />
                    {isEditing ? (
                      <input
                        className="border-b w-full focus:outline-none"
                        value={formData.contact?.phone || ""}
                        onChange={(e) =>
                          handleNestedChange("contact", "phone", e.target.value)
                        }
                      />
                    ) : (
                      <span>
                        {user.profile?.contact?.phone || "Not provided"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-indigo-500" size={18} />
                    {isEditing ? (
                      <input
                        className="border-b w-full focus:outline-none"
                        value={formData.location?.city || ""}
                        onChange={(e) =>
                          handleNestedChange("location", "city", e.target.value)
                        }
                      />
                    ) : (
                      <span>
                        {user.profile?.location?.city || "Not provided"}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Education */}
              <section className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Education
                </h2>
                {isEditing ? (
                  <div className="space-y-4">
                    {formData.education?.map((edu, idx) => (
                      <div key={idx} className="space-y-2">
                        <input
                          type="text"
                          className="w-full border p-2 rounded"
                          placeholder="Institution"
                          value={edu.institution || ""}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[idx].institution = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                        />
                        <input
                          type="text"
                          className="w-full border p-2 rounded"
                          placeholder="Degree"
                          value={edu.degree || ""}
                          onChange={(e) => {
                            const updated = [...formData.education];
                            updated[idx].degree = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          education: [
                            ...prev.education,
                            { institution: "", degree: "" },
                          ],
                        }))
                      }
                      className="text-indigo-500 text-sm"
                    >
                      + Add Education
                    </button>
                  </div>
                ) : (
                  user.profile?.education?.map((edu, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="font-medium text-gray-800">
                        {edu.institution}
                      </p>
                      <p className="text-gray-600 text-sm">{edu.degree}</p>
                    </div>
                  ))
                )}
              </section>
            </div>

            {/* Ratings */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Ratings
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {["asTutor", "asStudent"].map((role) => {
                  const rating = user.ratings?.[role];
                  return (
                    <div
                      key={role}
                      className="bg-gray-50 p-4 rounded-xl shadow-sm"
                    >
                      <h3 className="text-sm font-medium text-gray-700 capitalize">
                        {role.replace("as", "As ")}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={`${
                                i < Math.floor(rating?.average || 0)
                                  ? "fill-[#A7E629] text-[#A7E629]"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({rating?.count || 0} reviews)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
