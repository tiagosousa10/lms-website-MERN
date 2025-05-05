import {clerkClient} from "@clerk/express";

//update role to educator
export const updateRoleToEducator = async () => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      }
    })
    res.json({success:true, message: "User role updated to educator, You can now create courses"})


  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in updateRoleToEducator", error.message)
  }
}
