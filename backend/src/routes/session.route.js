import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import {
  createSession,
  showSessions,
  getReady,
  fetchMessages,
  sendMessage,
} from "../controllers/session.controller.js";
const router=express.Router()
router.post('/create',protectedRoute,createSession)
router.get("/", protectedRoute, showSessions);
router.post("/:session/room/ready",getReady);
router.get("/:session_id/messages", fetchMessages);
router.post("/:session_id/messages", sendMessage);
export default router