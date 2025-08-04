import { generateStreamToken } from "../configs/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.auth.userId);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
