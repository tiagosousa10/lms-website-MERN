import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// ---------------------- COMMUNITY FRIENDS & CHATS ----------------------

export async function getAllUsers(req, res) {
  try {
    const currentUserId = req.auth.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const getUsers = await User.find({});

    res.status(200).json(getUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.auth.userId;
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
// CHECK !
export async function getMyFriends(req, res) {
  try {
    const userId = req.auth.userId;

    const user = await User.findById(userId)
      .select("-friends")
      .populate("friends", "name email imageUrl");

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// CHECK !
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.auth.userId;

    if (!myId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(200).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

//CHECK !
export async function acceptFriendRequest(req, res) {
  try {
    const userId = req.auth.userId;
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

// CHECK !
export async function getFriendRequests(req, res) {
  try {
    const userId = req.auth.userId;
    // console.log("🚀 ~ getFriendRequests ~ userId:", userId);

    const incomingReqs = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    })
      .populate("sender", "name email imageUrl")
      .lean();

    // console.log("incomingReqs: ", incomingReqs);

    const acceptedReqs = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    })
      .populate("recipient", "name email imageUrl")
      .lean();

    // console.log("acceptedReqs: ", acceptedReqs);

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// TODO: PROXIMO PASSO!!! ACABAR!!!
export async function getOutgoingFriendReqs(req, res) {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Não autenticado" });

    const outgoing = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate("recipient", "name email imageUrl");
    return res.status(200).json(outgoing);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
}

export async function removeFriend(req, res) {
  try {
    const userId = req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Nao autenticado" });

    const { id: friendId } = req.params;
    if (!friendId)
      return res.status(400).json({ message: "Friend ID not provided" });
    if (String(userId) === String(friendId))
      return res.status(400).json({ message: "You cannot remove yourself" });

    const [me, friend] = await Promise.all([
      User.findById(userId).select("_id friends"),
      User.findById(friendId).select("_id friends"),
    ]);

    if (!me) return res.status(404).json({ message: "User not found" });
    if (!friend) return res.status(404).json({ message: "Friend not found" });

    await Promise.all([
      User.updateOne({ _id: userId }, { $pull: { friends: String(friendId) } }),
      User.updateOne({ _id: friendId }, { $pull: { friends: String(userId) } }),
      FriendRequest.deleteMany({
        $or: [
          { sender: String(userId), recipient: String(friendId) },
          { sender: String(friendId), recipient: String(userId) },
        ],
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Amizade removida",
    });
  } catch (error) {
    console.log("Error in removeFriend:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
