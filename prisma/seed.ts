import { prisma } from '../db/prisma.js'
import * as bcrypt from 'bcrypt' // Recommended for passwords

async function main() {
  const hashedPassword = await bcrypt.hash('admin@123', 10)
  
  const admin = await prisma.users.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const autoProducts = [
    {
      name: "Ap Stitching",
      description: "Auto-generated stitching charge per panel",
      sellingUnit: "PANEL" as const,
      productType: "AUTO",
      productCategory: "READY" as const,
      price: 150,
      taxRate: 18,
    },
    {
      name: "Roman Stitching",
      description: "Auto-generated Roman stitching charge per sqft",
      sellingUnit: "SQFT" as const,
      productType: "AUTO",
      productCategory: "READY" as const,
      price: 45,
      taxRate: 18,
    },
    {
      name: "Aster",
      description: "Auto-generated Aster lining material",
      sellingUnit: "METER" as const,
      productType: "AUTO",
      productCategory: "READY" as const,
      price: 120,
      taxRate: 18,
    },
    {
      name: "MTrack",
      description: "Auto-generated MTrack mounting track hardware",
      sellingUnit: "RFT" as const,
      productType: "AUTO",
      productCategory: "READY" as const,
      price: 90,
      taxRate: 18,
    },
    {
      name: "Pelmet",
      description: "Auto-generated Pelmet charge per RFT",
      sellingUnit: "RFT" as const,
      productType: "AUTO",
      productCategory: "READY" as const,
      price: 150,
      taxRate: 18,
    },
    {
      name: "Fitting",
      description: "Auto-generated installation fitting charge",
      sellingUnit: "PIECE" as const,
      productType: "AUTO",
      productCategory: "READY" as const,
      price: 60,
      taxRate: 18,
    },
  ];

  for (const prod of autoProducts) {
    await prisma.products.upsert({
      where: { name: prod.name },
      update: {
        description: prod.description,
        sellingUnit: prod.sellingUnit,
        productType: prod.productType,
        productCategory: prod.productCategory,
        price: prod.price,
        taxRate: prod.taxRate,
      },
      create: prod,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
