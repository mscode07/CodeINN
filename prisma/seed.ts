// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const userData = [
    {
      userName: "Alice",
      email: "alice@example.com",
      password: "password",
      providerID: "1",
      isPaid: false,
      isActive: true,
      isDelete: false,
    },
    {
      userName: "Bob",
      email: "bob@example.com",
      password: "password",
      providerID: "2",
      isPaid: false,
      isActive: true,
      isDelete: false,
    },
  ];

  for (const u of userData) {
    await prisma.userTable.create({
      data: u,
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
