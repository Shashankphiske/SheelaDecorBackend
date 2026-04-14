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
