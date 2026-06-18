import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET /api/stores - List all stores with user's rating
router.get("/", authenticate, authorize("USER", "ADMIN"), async (req, res) => {
  try {
    const { name, address, sortBy = "name", sortOrder = "asc" } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: "insensitive" };
    if (address) where.address = { contains: address, mode: "insensitive" };

    const validSortFields = ["name", "address"];
    const orderField = validSortFields.includes(sortBy) ? sortBy : "name";
    const orderDir = sortOrder === "desc" ? "desc" : "asc";

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      include: { ratings: true },
    });

    // Fetch user's ratings for all these stores
    const userRatings = await prisma.rating.findMany({
      where: { userId: req.user.id },
    });
    const userRatingMap = {};
    userRatings.forEach((r) => {
      userRatingMap[r.storeId] = r;
    });

    const result = stores.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avgRating:
        store.ratings.length > 0
          ? Math.round((store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length) * 10) / 10
          : null,
      ratingCount: store.ratings.length,
      userRating: userRatingMap[store.id] ? userRatingMap[store.id].value : null,
      userRatingId: userRatingMap[store.id] ? userRatingMap[store.id].id : null,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/stores/:id/rate - Submit a rating
router.post("/:id/rate", authenticate, authorize("USER"), async (req, res) => {
  try {
    const { value } = req.body;
    const storeId = req.params.id;

    if (!value || value < 1 || value > 5 || !Number.isInteger(Number(value))) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });
    if (existing) {
      return res.status(409).json({ message: "You have already rated this store. Use PUT to update." });
    }

    const rating = await prisma.rating.create({
      data: { value: Number(value), userId: req.user.id, storeId },
    });
    res.status(201).json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/stores/:id/rate - Modify rating
router.put("/:id/rate", authenticate, authorize("USER"), async (req, res) => {
  try {
    const { value } = req.body;
    const storeId = req.params.id;

    if (!value || value < 1 || value > 5 || !Number.isInteger(Number(value))) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });
    if (!existing) {
      return res.status(404).json({ message: "No rating found to update" });
    }

    const rating = await prisma.rating.update({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      data: { value: Number(value) },
    });
    res.json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
