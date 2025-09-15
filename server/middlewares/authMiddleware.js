import { clerkClient } from "@clerk/express";

//Middleware ( Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
  try {
    console.log("🚀 ~ primeiro passo:", req.auth.userId);
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId); //get user from clerk

    console.log("cheguei aqui");
    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "You are not an educator" });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in protectEducator,", error.message);
  }
};
