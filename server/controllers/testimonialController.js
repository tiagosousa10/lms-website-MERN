import Testimonial from "../models/Testimonial.js";
import User from "../models/User.js";

export const listRandomTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.aggregate([
      { $sample: { size: 4 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          rating: 1,
          text: 1,
          user: {
            _id: "$userData._id",
            name: "$userData.name",
            email: "$userData.email",
          },
          createdAt: 1,
        },
      },
    ]);

    return res.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.log("Error in listRandomTestimonials:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialDocument = await Testimonial.findById(id).populate({
      path: "user",
      select: "name email",
    });

    if (!testimonialDocument)
      return res.json({ success: false, message: "Testemunho não encontrado" });

    return res.json({ success: true, testimonial: testimonialDocument });
  } catch (error) {
    console.log("Error in getTestimonial:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
