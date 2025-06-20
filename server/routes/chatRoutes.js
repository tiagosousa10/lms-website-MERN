import express from "express";
// import { protectRoute } from "../middlewares/authMiddleware.js";
import { getStreamToken } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/token", getStreamToken);

export default chatRouter;
