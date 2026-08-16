import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "k.satyanvesh@gmail.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is not set.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("An admin user with this email already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully.");
  console.log(`Email: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });