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
  Loader2,
  AlertCircle,
  Plus,
  Filter,
  BookOpen,
  Bookmark,
  Star,
  Users,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
export default function Courses() {
  const { user } = useContext(AuthContext);
  const { course_type } = useParams(); 
  const navigate = useNavigate();
  const { joinRoom } = useContext(SocketContext);

  // State management
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [visibleTutorCard, setVisibleTutorCard] = useState(null);
  const [enrollingInProgress, setEnrollingInProgress] = useState(null);

  // Memoize page title for performance
  const pageTitle = "Courses";

  // Fetch courses
  const fetchCourses = useCallback(
    async (categoryId, tagTitles) => {
      try {
        setCoursesLoading(true);
        const endpoint = categoryId
          ? `/courses/category/${categoryId}`
          : `/courses/category/all`;

        const response = await axiosInstance.get(endpoint, {
          params: { tags: tagTitles || null },
        });

        setCourses(response.data);
        setCoursesError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCoursesError("Failed to load courses");
        toast.error("Failed to load courses");
      } finally {
        setCoursesLoading(false);
      }
    },
    [course_type]
  );

  // Fetch categories
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
    fetchCourses();
    fetchCategories();
  }, [course_type, fetchCourses, fetchCategories]);

  // Handle category change
  const handleCategoryChange = useCallback(
    async (e) => {
      const categoryId = e.target.value;

      if (!categoryId) {
        setSelectedCategory(null);
        setSelectedTags([]);
        setAvailableTags([]);
        fetchCourses();
        return;
      }

      const category = categories.find((cat) => cat._id === categoryId) || null;
      setSelectedCategory(category);
      setSelectedTags([]);

      if (category && category.tags) {
        const tags_data = category.tags.map((tag, index) => ({
          title: tag,
          objectID: `tag-${index}`,
        }));
        setAvailableTags(tags_data);
      } else {
        setAvailableTags([]);
      }

      fetchCourses(categoryId);
    },
    [categories, fetchCourses]
  );

  // Handle tags change
  const handleTagsChange = useCallback(
    (updatedTags) => {
      setSelectedTags(updatedTags);

      if (!selectedCategory) return;

      const tagTitles =
        updatedTags.length > 0 ? updatedTags.map((t) => t.title) : null;

      fetchCourses(selectedCategory._id, tagTitles);
    },
    [selectedCategory, fetchCourses]
  );

  // Enroll in course
  const enrollCourse = useCallback(
    async (course_id, tutor_id) => {
      if (!user) {
        toast.error("Please login to enroll in a course");
        return;
      }

      if (tutor_id === user._id) {
        toast.error("You can't enroll in your own course");
        return;
      }

      setEnrollingInProgress(course_id);

      try {
        const response = await axiosInstance.post(`/courses/enroll/${course_id}`);

        toast.success("You have enrolled in the course!");

        fetchCourses(
          selectedCategory?._id,
          selectedTags.length > 0 ? selectedTags.map((t) => t.title) : null
        );
      } catch (err) {
        console.error("Enrollment error:", err);
        toast.error(
          err.response?.data?.message ||
            "An error occurred while enrolling in the course"
        );
      } finally {
        setEnrollingInProgress(null);
      }
    },
    [user, selectedCategory, selectedTags, fetchCourses]
  );

  // Toggle tutor detail card
  const toggleTutorCard = useCallback(
    (courseId) => {
      setVisibleTutorCard(visibleTutorCard === courseId ? null : courseId);
    },
    [visibleTutorCard]
  );

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-[#191A2C] to-[#0D0E1A] text-white">
      {/* Header Section with Academic Feel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 relative">
            {pageTitle}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-[#A7E629] to-[#4FDC7C] rounded-full"></span>
          </h1>
          <p className="text-gray-300">
            Expand your knowledge with our curated courses
          </p>
        </div>
        <button
          onClick={() => {
            if (!user) {
              toast.error("Please login to create a course");
              return;
            }
            navigate(`/create-course/${user._id}`);
          }}
          className="bg-gradient-to-r bg-[#A7E629] text-[#191A2C] px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 flex items-center font-semibold shadow-md hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Course
        </button>
      </div>

      {/* Filter Section - Academic Style */}
      <div className="bg-white/5  p-6 rounded-xl shadow-lg mb-12 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-[#A7E629]" />
          Refine Course Selection
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
              <option className="text-black" value="">All Categories</option>
              {categories.map((category) => (
                <option className="text-black" key={category._id} value={category._id}>
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

      {/* Course Grid - Professional Layout */}
      {coursesLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#A7E629]" />
            <p className="mt-4 text-gray-300">Loading quality courses...</p>
          </div>
        </div>
      ) : coursesError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white/5 rounded-2xl  border border-white/10">
          <AlertCircle className="h-16 w-16 text-[#A7E629] mb-4" />
          <p className="text-lg text-gray-300">{coursesError}</p>
          <button
            onClick={fetchCourses}
            className="mt-4 bg-[#A7E629] text-[#191A2C] px-4 py-2 rounded-lg hover:bg-[#c7fc4e] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gradient-to-b from-white/5 to-white/10 rounded-2xl overflow-hidden border border-white/10 hover:border-[#A7E629]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 "
            >
              {/* Course Thumbnail with Badge */}
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                {course.discount !== "0%" && (
                  <div className="absolute top-4 right-4 bg-[#A7E629] text-[#191A2C] px-3 py-1 rounded-full text-xs font-bold">
                    {course.discount} OFF
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center text-gray-300 text-sm">
                      <BookOpen className="h-4 w-4 mr-2 text-[#A7E629]" />
                      {course.level}
                    </div>
                  </div>
                  <div className="relative group">
                    <img
                      src={course.tutor.profilePic || avatar}
                      alt={`${course.tutor.fullName}'s profile`}
                      className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#A7E629] hover:border-white transition-all object-cover"
                      onClick={() => toggleTutorCard(course._id)}
                    />
                    {visibleTutorCard === course._id && (
                      <UserDetailCard
                        user={{
                          profilePic: course.tutor.profilePic,
                          fullName: course.tutor.fullName,
                          email: course.tutor.email,
                          createdAt: course.tutor.createdAt,
                        }}
                        onClose={() => setVisibleTutorCard(null)}
                      />
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                  {course.description}
                </p>

                {/* Tags - Academic Style */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#A7E629]/10 text-[#A7E629] text-xs rounded-full border border-[#A7E629]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Course Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-[#A7E629]" />
                    <div>
                      <p className="text-xs text-gray-400">Rating</p>
                      <p className="text-white font-medium">
                        {course.rating || "New"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#A7E629]" />
                    <div>
                      <p className="text-xs text-gray-400">Students</p>
                      <p className="text-white font-medium">
                        {course.studentsEnrolled.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-[#A7E629]" />
                    <div>
                      <p className="text-xs text-gray-400">Price</p>
                      <p className="text-white font-medium">
                        ${course.price}
                        {course.price === 0 && (
                          <span className="text-[#A7E629] ml-1">(Free)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-[#A7E629]" />
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-white font-medium">10 hours</p>
                    </div>
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={() => enrollCourse(course._id, course.tutor._id)}
                  disabled={enrollingInProgress === course._id}
                  className="w-full  bg-[#A7E629] text-[#191A2C] py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-semibold hover:shadow-lg hover:scale-[1.02]"
                >
                  {enrollingInProgress === course._id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-5 w-5 mr-2" />
                      {course.price === 0 ? "Enroll for Free" : "Enroll Now"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5  rounded-2xl p-12 text-center border border-white/10">
          <div className="inline-flex items-center justify-center bg-[#A7E629]/10 p-4 rounded-full mb-4">
            <BookOpen className="h-12 w-12 text-[#A7E629]" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            No courses matching your criteria
          </h3>
          <p className="text-gray-300 max-w-md mx-auto mb-6">
            Try adjusting your filters or create the first course in this
            category!
          </p>
          <button
            onClick={() => navigate(`/create-course/${user?._id || ""}`)}
            className="bg-gradient-to-r bg-[#A7E629] text-[#191A2C] px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Create New Course
          </button>
        </div>
      )}
    </div>
  );
}