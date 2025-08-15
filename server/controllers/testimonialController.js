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

export const createTestimonial = async (req, res) => {
  try {
    const userId = req.auth?.userId; // Clerk
    if (!userId)
      return res.json({ success: false, message: "Não autenticado" });

    // verify if user exists in database
    const user = await User.findById(userId);
    if (!user)
      return res.json({ success: false, message: "Utilizador não encontrado" });

    const rating = Number(req.body.rating);
    const text = String(req.body.text || "").trim();

    // verify rating and text length
    if (!(rating >= 1 && rating <= 5) || text.length < 10) {
      return res.json({ success: false, message: "Dados inválidos" });
    }

    //create testimonial
    const created = await Testimonial.create({
      user: String(userId),
      rating,
      text,
    });

    return res.status(201).json({ success: true, testimonial: created });
  } catch (error) {
    console.log("Error in createTestimonial:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const updateMyTestimonial = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId)
      return res.json({ success: false, message: "Não autenticado" });

    const { id } = req.params;
    const testimonialDocument = await Testimonial.findById(id);
    if (!testimonialDocument)
      return res.json({ success: false, message: "Testemunho não encontrado" });

    if (String(testimonialDocument.user) !== String(userId)) {
      return res.json({ success: false, message: "Sem permissão para editar" });
    }

    // Atualizações permitidas
    if (req.body.rating !== undefined) {
      const r = Number(req.body.rating);
      if (!(r >= 1 && r <= 5))
        return res.json({ success: false, message: "Rating inválido" });
      testimonialDocument.rating = r;
    }
    if (req.body.text !== undefined) {
      const txt = String(req.body.text).trim();
      if (txt.length < 10)
        return res.json({ success: false, message: "Texto muito curto" });
      testimonialDocument.text = txt;
    }

    await testimonialDocument.save();
    return res.json({ success: true, testimonial: testimonialDocument });
  } catch (error) {
    console.log("Error in updateMyTestimonial:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const deleteMyTestimonial = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId)
      return res.json({ success: false, message: "Não autenticado" });

    const { id } = req.params;
    const testimonialDocument = await Testimonial.findById(id);
    if (!testimonialDocument)
      return res.json({ success: false, message: "Testemunho não encontrado" });

    if (String(testimonialDocument.user) !== String(userId)) {
      return res.json({
        success: false,
        message: "Sem permissão para remover",
      });
    }

    await Testimonial.deleteOne({ _id: id });
    return res.json({ success: true, message: "Testemunho removido" });
  } catch (error) {
    console.log("Error in deleteMyTestimonial:", error.message);
    return res.json({ success: false, message: error.message });
  }
};
