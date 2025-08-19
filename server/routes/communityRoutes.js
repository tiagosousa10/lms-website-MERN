import express from "express";
// import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  acceptFriendRequest,
  getAllUsers,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  removeFriend,
  sendFriendRequest,
} from "../controllers/communityController.js";
import {
  createTestimonial,
  deleteMyTestimonial,
  getMyTestimonials,
  getTestimonial,
  listRandomTestimonials,
  updateMyTestimonial,
} from "../controllers/testimonialController.js";

const communityRouter = express.Router();

// FRIENDS

communityRouter.get("/all-users", getAllUsers);
communityRouter.get("/recommended-users", getRecommendedUsers);
communityRouter.get("/friends", getMyFriends);
communityRouter.get("/friend-requests", getFriendRequests);
communityRouter.get("/outgoing-friend-requests", getOutgoingFriendReqs);

communityRouter.post("/friend-request/:id", sendFriendRequest);
communityRouter.put("/friend-request/:id/accept", acceptFriendRequest);
communityRouter.delete("/friends/:id", removeFriend);

// TESTIMONIALS
communityRouter.get("/testimonials/random", listRandomTestimonials);
communityRouter.get("/testimonials/me", getMyTestimonials);
communityRouter.get("/testimonials/:id", getTestimonial);

communityRouter.post("/testimonials", createTestimonial);
communityRouter.put("/testimonials/:id", updateMyTestimonial);
communityRouter.delete("/testimonials/:id", deleteMyTestimonial);

export default communityRouter;
