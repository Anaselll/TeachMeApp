import cloudinary from "../lib/cloudinary.js";
import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      thumbnail,
      discount,
      tags,
      tutor,
      price,
      level,
      requirements,
      curriculum,
      language,
    } = req.body;

    // Upload thumbnail to Cloudinary
    const uploadResponseThumbnail = await cloudinary.uploader.upload(thumbnail);
    console.log(uploadResponseThumbnail.secure_url);

    // Process curriculum with async uploads (including video URLs)
    const curriculumUpdated = await Promise.all(
      curriculum.map(async (section) => {
        if (
          !section.title ||
          !section.lessons ||
          !Array.isArray(section.lessons)
        ) {
          throw new Error(
            "Each curriculum section must have a title and lessons array"
          );
        }

        // Process each lesson's video
        const updatedLessons = await Promise.all(
          section.lessons.map(async (lesson) => {
            if (!lesson.videoUrl) {
              throw new Error(
                "Each lesson must have a videoUrl, description, and duration"
              );
            }

            console.log("Processing lesson:", lesson);

            try {
              // Upload video to Cloudinary
              const uploadResponse = await cloudinary.uploader.upload(
                lesson.videoUrl,
                {
                  resource_type: "video",
                }
              );

              console.log("Uploaded video URL:", uploadResponse.secure_url);

              return {
                ...lesson,
                videoUrl: uploadResponse.secure_url,
              };
            } catch (error) {
              console.error("Error processing lesson:", error.message);
              return lesson; // Return the lesson without modifying videoUrl if an error occurs
            }
          })
        );

        return {
          ...section,
          lessons: updatedLessons,
        };
      })
    );

    // Create new course with updated curriculum
    const tagsMap = tags.map((tag_) => tag_.title);
    
    const course = new Course({
      title,
      description,
      category,
      thumbnail: uploadResponseThumbnail.secure_url,
      discount,
      tags: tagsMap,
      tutor,
      price,
      level,
      requirements,
      curriculum: curriculumUpdated,
      language,
    });

    await course.save();

    return res
      .status(201)
      .json({ message: "Course created successfully", course });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const fetchTop5Courses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ rating: -1 }).limit(5);
    return res.status(200).json(courses);
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
export const fetchCourses = async (req, res) => {

  try {
  
    let courses = await Course.find().populate("tutor category");
   if(req.user){
    courses=courses.filter((course) => {
      return course.studentsEnrolled.includes(req.user._id)==false;
    })
   }
  
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Fetch courses by course_type and category (with optional tags)
export const fetchCoursesByTypeAndCategory = async (req, res) => {
  try {
    const { course_type, categoryId } = req.params;
    const { tags } = req.query;

    // Build query
    const query = { course_type };

    // Handle category filtering
    if (categoryId !== "all") {
      query.category = categoryId;
    }

    // Handle tags filtering
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $all: tagsArray };
    }
    let courses = await Course.find(query).populate("tutor category");
    if (req.user) {
      courses = courses.filter((course) => {
        return course.studentsEnrolled.includes(req.user._id) == false;
      });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};export function enrollCourse(req, res) {
  const { courseId } = req.params;
  const userId = req.user._id;

  Course.findByIdAndUpdate(
    courseId,
    { $addToSet: { studentsEnrolled: userId } },
    { new: true }
  )
    .then((course) => {
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json({ message: "Enrolled successfully", course });
    })
    .catch((error) => {
      return res.status(500).json({ message: error.message });
    });
}