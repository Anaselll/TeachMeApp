export function First({ course, setCourse }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Course Title & Description
      </h3>

      <p className="text-gray-600 mb-8 leading-relaxed">
        Fill in the details for the course title and description. This is
        important as it will be the first thing potential students see. Be
        clear, concise, and make sure it accurately reflects the course content.
      </p>

      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Course Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter a clear, engaging title (e.g. 'Complete Python Bootcamp')"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Course Description
          </label>
          <textarea
            id="description"
            placeholder="Describe what students will learn and why they should take your course..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
            rows="5"
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            A compelling description helps your course stand out and attracts
            more students.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

import TagsDropdown from "./TagsDropdown";
import { axiosInstance } from "../lib/axios";

export function Second({ course, setCourse }) {
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    // Update both category and reset tags in one state update
    setCourse((prevCourse) => {
      return { ...prevCourse, category: categoryId, tags: [] };
    });

    if (!categoryId) {
      setAvailableTags([]);
      return;
    }

    const category = categories.find((cat) => cat._id === categoryId);

    if (category) {
      const tags_data = category.tags.map((tag, index) => ({
        title: tag,
        objectID: `tag-${index}`,
      }));
      setAvailableTags(tags_data);
    }
  };

  const handleTagsChange = (updatedTags) => {
    setCourse((prevCourse) => ({ ...prevCourse, tags: updatedTags }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Select Course Category and Tags
      </h3>

      <div className="space-y-6">
        {/* Category Select */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            value={course.category}
            onChange={handleCategoryChange}
            name="category"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Dropdown */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Tags</label>
          <TagsDropdown
            availableTags={availableTags}
            selectedTags={course.tags}
            onTagsChange={handleTagsChange}
            disabled={!course.category}
          />
          <p className="text-xs text-gray-500 mt-1">
            Select tags to further describe your course's content.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Third({ course, setCourse }) {
  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setCourse((prevCourse) => ({
      ...prevCourse,
      level: selectedLevel,
    }));
  };

  const handleRequirementsChange = (e) => {
    const { value } = e.target;
    const requirements = value.split(",").map((req) => req.trim());
    setCourse((prevCourse) => ({
      ...prevCourse,
      requirements: requirements,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Set Course Level and Requirements
      </h3>

      <div className="space-y-6">
        {/* Level Select */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Level</label>
          <select
            value={course.level}
            onChange={handleLevelChange}
            name="level"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
            required
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Requirements Input */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Requirements
          </label>
          <input
            type="text"
            value={course.requirements.join(", ")}
            onChange={handleRequirementsChange}
            name="requirements"
            placeholder="Enter course requirements, separated by commas"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter requirements separated by commas (e.g., 'Basic understanding
            of programming').
          </p>
        </div>
      </div>
    </div>
  );
}

export function Fourth({ course, setCourse }) {
  const [newSection, setNewSection] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);

  const handleAddSection = () => {
    if (newSection) {
      setCourse((prevCourse) => ({
        ...prevCourse,
        curriculum: [
          ...prevCourse.curriculum,
          { title: newSection, lessons: [] },
        ],
      }));
      setNewSection("");
    }
  };

  const handleAddLesson = (index) => {
    if (newLessonVideo && lessonTitle) {
      const updatedCurriculum = [...course.curriculum];
      updatedCurriculum[index].lessons.push({
        title: lessonTitle,
        videoUrl: videoPreview, // Use preview URL instead of base64
      });
      setCourse({ ...course, curriculum: updatedCurriculum });
      setLessonTitle("");
      setNewLessonVideo(null);
      setVideoPreview(null);
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setNewLessonVideo(file);
    setVideoPreview(URL.createObjectURL(file)); // Generate preview URL
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
        📚 Course Curriculum
      </h3>

      <div className="space-y-6">
        {/* Add Section */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            New Section
          </label>
          <input
            type="text"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            placeholder="Enter section title"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
          />
          <button
            onClick={handleAddSection}
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Add Section
          </button>
        </div>

        {/* Add Lessons */}
        {course.curriculum.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2">
              📌 Sections & Lessons
            </h4>
            {course.curriculum.map((section, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded-lg bg-gray-50"
              >
                <div className="font-semibold text-lg mb-2">
                  {section.title}
                </div>

                {/* Existing Lessons */}
                {section.lessons.length > 0 && (
                  <div className="space-y-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="text-sm text-gray-700 flex items-center gap-2"
                      >
                        🎥 {lesson.title}
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          (Watch Video)
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Lesson Inputs */}
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Enter lesson title"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 bg-gray-50"
                  />

                  {/* Video Preview */}
                  {videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      className="w-full mt-2 rounded-lg shadow-md"
                    />
                  )}

                  <button
                    onClick={() => handleAddLesson(index)}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    ✅ Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Sections Message */}
        {course.curriculum.length === 0 && (
          <p className="text-sm text-gray-500">
            ⚠️ No sections added yet. Please add a section first.
          </p>
        )}
      </div>
    </div>
  );
}

export function Seventh({ course, setCourse }) {
  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value) || 0;
    setCourse((prevCourse) => ({
      ...prevCourse,
      price: newPrice,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Set Your Price
      </h3>

      <p className="text-gray-600 mb-4">
        Choose a competitive price for your course. 
        based on your content value.
      </p>

      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
        <input
          type="number"
          value={course.price || ""}
          onChange={handlePriceChange}
          className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
          placeholder="Enter price (e.g., 49.99)"
        />
      </div>

      <p className="text-gray-500 text-sm mt-2">
        Higher prices reflect premium content. Ensure your course has valuable
        lessons!
      </p>
    </div>
  );
}

export function Eighth({ course, setCourse }) {
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourse((prevCourse) => ({
          ...prevCourse,
          thumbnail: reader.result, // Save base64 image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto flex flex-col gap-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        Course Thumbnail
      </h3>

      <p className="text-gray-600 mb-4">
        Upload a thumbnail image for your course. This image will be displayed
        on the landing page.
      </p>

      <div className="flex flex-col gap-4">
        {/* Thumbnail Upload */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">
            Choose Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="mt-2 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          />
        </div>

        {/* Display Uploaded Thumbnail */}
        {course.thumbnail && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Preview:</p>
            <img
              src={course.thumbnail}
              alt="Course Thumbnail Preview"
              className="mt-2 max-w-full h-auto rounded-lg border shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}

