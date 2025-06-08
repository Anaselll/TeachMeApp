import express from 'express'
import { checkAuth, login, logout, signup } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import {
  updateProfilePic,
  updateProfile,
} from "../controllers/auth.controller.js";
import upload from "../middleware/upload.middleware.js";


const router=express.Router()
router.post('/signup',signup)
router.post("/login",login);
router.post("/logout",logout);


router.post('/updateProfilePic', 
  protectedRoute, 
  upload.single('profilePic'), 
  updateProfilePic
);

router.put('/updateProfile', 
  protectedRoute, 
  updateProfile
);


router.get("/check",protectedRoute,checkAuth);
export default router