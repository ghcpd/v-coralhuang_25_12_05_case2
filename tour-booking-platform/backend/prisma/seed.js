const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main(){
  const pw = await bcrypt.hash('password', 10);
  await prisma.user.upsert({
    where: {email: 'user@example.com'},
    update: {},
    create: {email: 'user@example.com', password: pw, name: 'Test User'}
  });
  console.log('Seed complete');
}

main().catch(e => {console.error(e); process.exit(1)}).finally(()=>prisma.$disconnect());
