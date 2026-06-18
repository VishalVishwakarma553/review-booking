import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, authorize("ADMIN"));

// GET /api/admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&sortOrder=
router.get("/users", async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", sortOrder = "asc" } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: "insensitive" };
    if (email) where.email = { contains: email, mode: "insensitive" };
    if (address) where.address = { contains: address, mode: "insensitive" };
    if (role) where.role = role;

    const validSortFields = ["name", "email", "address", "role", "createdAt"];
    const orderField = validSortFields.includes(sortBy) ? sortBy : "name";
    const orderDir = sortOrder === "desc" ? "desc" : "asc";

    const users = await prisma.user.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/users/:id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    let avgRating = null;
    if (user.role === "OWNER") {
      const store = await prisma.store.findUnique({
        where: { ownerId: user.id },
        include: { ratings: true },
      });
      if (store && store.ratings.length > 0) {
        avgRating = store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length;
        avgRating = Math.round(avgRating * 10) / 10;
      }
    }

    res.json({ ...user, avgRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/users
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name must be 20–60 characters" });
    }
    if (address.length > 400) {
      return res.status(400).json({ message: "Address must be under 400 characters" });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8–16 chars with at least one uppercase and one special character",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!["ADMIN", "USER", "OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role },
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/stores?name=&email=&address=&sortBy=&sortOrder=
router.get("/stores", async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", sortOrder = "asc" } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: "insensitive" };
    if (email) where.email = { contains: email, mode: "insensitive" };
    if (address) where.address = { contains: address, mode: "insensitive" };

    const validSortFields = ["name", "email", "address", "createdAt"];
    const orderField = validSortFields.includes(sortBy) ? sortBy : "name";
    const orderDir = sortOrder === "desc" ? "desc" : "asc";

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [orderField]: orderDir },
      include: { ratings: true, owner: { select: { name: true } } },
    });

    const storesWithRating = stores.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      ownerName: s.owner?.name || null,
      avgRating:
        s.ratings.length > 0
          ? Math.round((s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length) * 10) / 10
          : null,
      ratingCount: s.ratings.length,
    }));

    res.json(storesWithRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/stores
router.post("/stores", async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ message: "Name, email, and address are required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await prisma.store.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Store email already registered" });

    const store = await prisma.store.create({
      data: { name, email, address, ownerId: ownerId || null },
    });

    // Update owner role if ownerId provided
    if (ownerId) {
      await prisma.user.update({ where: { id: ownerId }, data: { role: "OWNER" } });
    }

    res.status(201).json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
