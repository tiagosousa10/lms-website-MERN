import { clerkClient } from "@clerk/express";

//Middleware ( Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId); //get user from clerk

    if (response.publicMetadata.role !== "educator") {
      return res.json({ success: false, message: "You are not an educator" });
    }

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in protectEducator", error.message);
  }
};

// ----------------------COMMUNITY FRIENDS & CHATS----------------------

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("🚀 ~ protectRoute ~ token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Attach the user object to the request
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
