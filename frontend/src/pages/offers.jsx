import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { axiosInstance } from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import TagsDropdown from "../components/TagsDropdown";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import SocketContext from "../context/SocketContext";
import UserDetailCard from "../components/UserDetailCard";
import avatar from "../assets/avatar.jpg";
import {
  Plus,
  Clock,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle,
  Filter,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
export default function Offers() {
  const { user } = useContext(AuthContext);
  const { offer_type } = useParams();
  const navigate = useNavigate();
  const { joinRoom } = useContext(SocketContext);

  // All state in main component
  const [offers, setOffers] = useState([])
  const [animateHeader, setAnimateHeader] = useState(false);


  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [visibleUserCard, setVisibleUserCard] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(null);
  useEffect(() => {
    setAnimateHeader(true);
  }, []);
  

  // Memoize page title for performance

  const pageTitle = useMemo(
    () => (offer_type === "find_tutor" ? "Find a Tutor" : "Find a Student"),
    [offer_type]
  );

  // Fetch offers function with useCallback for better performance
  const fetchOffers = useCallback(
    async (categoryId, tagTitles) => {
      try {
        setOffersLoading(true);
        const endpoint = categoryId
          ? `/offers/${offer_type}/category/${categoryId}`
          : `/offers/${offer_type}/category/all`;

        const response = await axiosInstance.get(endpoint, {
          params: { tags: tagTitles || null },
        });

        setOffers(response.data);
        setOffersError(null);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffersError("Failed to load offers");
        toast.error("Failed to load offers");
      } finally {
        setOffersLoading(false);
      }
    },
    [offer_type]
  );

  // Fetch categories function with useCallback
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchOffers();
    fetchCategories();
  }, [offer_type, fetchOffers, fetchCategories]);

  // Handle category change
  const handleCategoryChange = useCallback(
    async (e) => {
      const categoryId = e.target.value;

      if (!categoryId) {
        setSelectedCategory(null);
        setSelectedTags([]);
        setAvailableTags([]);
        fetchOffers();
        return;
      }

      const category = categories.find((cat) => cat._id === categoryId) || null;
      setSelectedCategory(category);
      setSelectedTags([]);

      // Use the tags from the category object
      if (category && category.tags) {
        // Convert tags array to the format expected by the TagsDropdown component
        if (category) {
          const tags_data = category.tags.map((tag, index) => ({
            title: tag,
            objectID: `tag-${index}`,
          }));
          setAvailableTags(tags_data);
        }
      } else {
        setAvailableTags([]);
      }

      fetchOffers(categoryId);
    },
    [categories, fetchOffers]
  );

  // Handle tags change
  const handleTagsChange = useCallback(
    (updatedTags) => {
      setSelectedTags(updatedTags);

      if (!selectedCategory) return;

      const tagTitles =
        updatedTags.length > 0 ? updatedTags.map((t) => t.title) : null;

      fetchOffers(selectedCategory._id, tagTitles);
    },
    [selectedCategory, fetchOffers]
  );

  // Book session function
  const bookSession = useCallback(
    async (offer_id, creator_id) => {
      if (!user) {
        toast.error("Please login to book a session");
        return;
      }

      if (creator_id === user._id) {
        toast.error("You can't book your own session");
        return;
      }

      setBookingInProgress(offer_id);

      const tutor_id = offer_type === "find_tutor" ? creator_id : user._id;
      const student_id = offer_type === "find_student" ? creator_id : user._id;

      try {
        const response = await axiosInstance.post("sessions/create", {
          student_id,
          tutor_id,
          offer_id,
          accepted_by: user._id,
        });

        joinRoom({ session_id: response.data.session_id });
        toast.success("Your session has been booked!");

        if (response.data && response.data.offers) {
          setOffers(response.data.offers);
        } else {
          // Fixed: Using _id instead of objectID
          fetchOffers(
            selectedCategory?._id,
            selectedTags.length > 0 ? selectedTags.map((t) => t.title) : null
          );
        }
      } catch (err) {
        console.error("Booking error:", err);
        toast.error(
          err.response?.data?.message ||
            "An error occurred while booking the session"
        );
      } finally {
        setBookingInProgress(null);
      }
    },
    [user, offer_type, joinRoom, selectedCategory, selectedTags, fetchOffers]
  );

  // Toggle user detail card visibility
  const toggleUserCard = useCallback(
    (offerId) => {
      setVisibleUserCard(visibleUserCard === offerId ? null : offerId);
    },
    [visibleUserCard]
  );

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-[#191A2C] to-[#0D0E1A] text-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div className="relative ">
          <h1
            className={`text-3xl sm:text-4xl font-bold text-white mb-2 relative transition-opacity duration-1000 ${
              animateHeader
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {pageTitle}
            <span
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#A7E629] to-[#4FDC7C] rounded-full transition-all duration-1000 ease-out ${
                animateHeader ? "w-20" : "w-0"
              }`}
            ></span>
          </h1>
          <p
            className={`text-gray-300 transition-opacity duration-1000 delay-200 ${
              animateHeader ? "opacity-100" : "opacity-0"
            }`}
          >
            Discover perfect learning matches in our vibrant community
          </p>
        </div>

        <button
          onClick={() => navigate(`/offers/${offer_type}/create`)}
          className="bg-gradient-to-r bg-[#A7E629] text-[#191A2C] px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 flex items-center font-semibold shadow-md hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Offer
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white/5 p-6 rounded-xl shadow-lg mb-12 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-[#A7E629]" />
          Refine Offer Selection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory?._id || ""}
              onChange={handleCategoryChange}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A7E629] focus:border-transparent"
              disabled={categoriesLoading}
            >
              <option className="text-black" value="">
                All Categories
              </option>
              {categories.map((category) => (
                <option
                  className="text-black"
                  key={category._id}
                  value={category._id}
                >
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <TagsDropdown
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              disabled={!selectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Offer Grid */}
      {offersLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#A7E629]" />
            <p className="mt-4 text-gray-300">Finding the best matches...</p>
          </div>
        </div>
      ) : offersError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white/5 rounded-2xl border border-white/10">
          <AlertCircle className="h-16 w-16 text-[#A7E629] mb-4" />
          <p className="text-lg text-gray-300">{offersError}</p>
          <button
            onClick={fetchOffers}
            className="mt-4 bg-[#A7E629] text-[#191A2C] px-4 py-2 rounded-lg hover:bg-[#c7fc4e] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-gradient-to-b from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-[#A7E629]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Offer Header */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                      {offer.subject}
                    </h3>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-[#A7E629]" />
                      {new Date(offer.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="relative group">
                    <img
                      src={offer.creator_id.profilePic || avatar}
                      alt={`${offer.creator_id.fullName}'s profile`}
                      className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#A7E629] hover:border-white transition-all object-cover"
                      onClick={() => toggleUserCard(offer._id)}
                    />
                    {visibleUserCard === offer._id && (
                      <UserDetailCard
                        user={{
                          profilePic: offer.creator_id.profilePic,
                          fullName: offer.creator_id.fullName,
                          email: offer.creator_id.email,
                          createdAt: offer.creator_id.createdAt,
                        }}
                        onClose={() => setVisibleUserCard(null)}
                      />
                    )}
                  </div>
                </div>

                {/* Offer Body */}
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {offer.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {offer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#A7E629]/10 text-[#A7E629] text-xs rounded-full border border-[#A7E629]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-[#A7E629]" />
                    <span className="text-gray-300">Price:</span>
                    <span className="ml-auto font-medium text-white">
                      ${offer.price}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-[#A7E629]" />
                    <span className="text-gray-300">Duration:</span>
                    <span className="ml-auto font-medium text-white">
                      {offer.dure} {offer.dure === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => bookSession(offer._id, offer.creator_id._id)}
                  disabled={bookingInProgress === offer._id}
                  className="w-full bg-gradient-to-r bg-[#A7E629] text-[#191A2C] py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold hover:shadow-lg hover:scale-[1.02]"
                >
                  {bookingInProgress === offer._id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-5 w-5 mr-2" />
                      Book Session
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
          <div className="inline-flex items-center justify-center bg-[#A7E629]/10 p-4 rounded-full mb-4">
            <Search className="h-12 w-12 text-[#A7E629]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            No offers matching your criteria
          </h3>
          <p className="text-gray-300 max-w-md mx-auto mb-6">
            Try adjusting your filters or be the first to create an offer in
            this category!
          </p>
          <button
            onClick={() => navigate(`/offers/${offer_type}/create`)}
            className="bg-gradient-to-r bg-[#A7E629] text-[#191A2C] px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Create New Offer
          </button>
        </div>
      )}
    </div>
  );
}
