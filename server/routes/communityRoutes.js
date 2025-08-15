import express from "express";
// import { protectRoute } from "../middlewares/authMiddleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/communityController.js";
import {
  createTestimonial,
  getTestimonial,
  listRandomTestimonials,
  updateMyTestimonial,
} from "../controllers/testimonialController.js";

const communityRouter = express.Router();

// FRIENDS
communityRouter.get("/recommended-users", getRecommendedUsers);
communityRouter.get("/friends", getMyFriends);
communityRouter.post("/friend-request/:id", sendFriendRequest);
communityRouter.put("/friend-request/:id/accept", acceptFriendRequest);
communityRouter.get("/friend-requests", getFriendRequests);
communityRouter.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// TESTIMONIALS
communityRouter.get("/testimonials/random", listRandomTestimonials); //
communityRouter.get("/testimonials/:id", getTestimonial); //

communityRouter.post("/testimonials", createTestimonial);
communityRouter.put("/testimonials/:id", updateMyTestimonial);
communityRouter.delete("/testimonials/:id", deleteMyTestimonial);

export default communityRouter;
