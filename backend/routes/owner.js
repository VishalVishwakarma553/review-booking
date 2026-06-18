import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET /api/owner/dashboard
router.get("/dashboard", authenticate, authorize("OWNER"), async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const avgRating =
      store.ratings.length > 0
        ? Math.round((store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length) * 10) / 10
        : null;

    const raters = store.ratings.map((r) => ({
      ratingId: r.id,
      value: r.value,
      userId: r.user.id,
      userName: r.user.name,
      userEmail: r.user.email,
      submittedAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      avgRating,
      totalRatings: store.ratings.length,
      raters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
