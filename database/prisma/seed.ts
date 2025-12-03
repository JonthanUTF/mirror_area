import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed de la base de données...');

  // TODO: Ajouter les seeds dans les prochaines issues
  // Exemple:
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'admin@area.com',
  //     password: hashedPassword,
  //   },
  // });

  console.log('✅ Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });