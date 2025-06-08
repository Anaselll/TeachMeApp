import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { createCourse, enrollCourse, fetchCourses, fetchCoursesByTypeAndCategory, fetchTop5Courses } from '../controllers/course.controller.js'
import { getUSer } from '../middleware/user.middleware.js'

const router=express.Router()
router.post("/create",protectedRoute,createCourse)
router.get("/top5", fetchTop5Courses);
router.get("/courses", getUSer,fetchCourses);

// Fetch courses by course_type and category (with optional tags)
router.get(
  "/category/:categoryId",getUSer,
  fetchCoursesByTypeAndCategory
);
router.post("/enroll/:courseId", protectedRoute, enrollCourse); // Enroll in a course
// Fetch all categories
export default router