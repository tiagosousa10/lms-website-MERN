import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/userController.js";
const communityRouter = express.Router();

communityRouter.use(protectRoute);

communityRouter.get("/recommended-users", getRecommendedUsers);

communityRouter.get("/friends", getMyFriends);

communityRouter.post("/friend-request/:id", sendFriendRequest);
communityRouter.put("/friend-request/:id/accept", acceptFriendRequest);
communityRouter.get("/friend-requests", getFriendRequests);
communityRouter.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default communityRouter;
