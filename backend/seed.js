// Seed script - run with: node seed.js
// This creates a default System Administrator account

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@reviewbook.com";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin user already exists:", adminEmail);
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "System Administrator Account",
      email: adminEmail,
      password: hashedPassword,
      address: "Review Book Headquarters, Platform City",
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully!");
  console.log("   Email:    ", admin.email);
  console.log("   Password: Admin@123");
  console.log("   Role:     ADMIN");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
