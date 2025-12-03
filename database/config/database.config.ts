import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration de la base de données
 * Centralise tous les paramètres de connexion
 */
export const databaseConfig = {
  // URL complète de connexion (utilisée par Prisma)
  url: process.env.DATABASE_URL || '',
  
  // Paramètres individuels
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  name: process.env.DATABASE_NAME || 'area_db',
  user: process.env.DATABASE_USER || 'area_user',
  password: process.env.DATABASE_PASSWORD || '',
  
  // Pool de connexions
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
    max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
  },
  
  // Chiffrement
  encryptionKey: process.env.DATABASE_ENCRYPTION_KEY || '',
  
  // Environnement
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

/**
 * Validation de la configuration au démarrage
 * Lance une erreur si des variables obligatoires sont manquantes
 */
export function validateDatabaseConfig(): void {
  const required = [
    'url',
    'host',
    'name',
    'user',
    'password',
    'encryptionKey',
  ];
  
  const missing: string[] = [];
  
  required.forEach((key) => {
    const value = databaseConfig[key as keyof typeof databaseConfig];
    if (!value || value === '') {
      missing.push(key.toUpperCase());
    }
  });
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required database configuration: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all variables are set.`
    );
  }
  
  // Validation de la clé de chiffrement (minimum 32 caractères)
  if (databaseConfig.encryptionKey.length < 32) {
    throw new Error(
      '❌ DATABASE_ENCRYPTION_KEY must be at least 32 characters long.\n' +
      'Generate one with: openssl rand -base64 32'
    );
  }
  
  console.log('✅ Database configuration validated successfully');
}

/**
 * Affiche la configuration (sans les secrets)
 */
export function logDatabaseConfig(): void {
  console.log('📊 Database Configuration:');
  console.log(`  - Host: ${databaseConfig.host}`);
  console.log(`  - Port: ${databaseConfig.port}`);
  console.log(`  - Database: ${databaseConfig.name}`);
  console.log(`  - User: ${databaseConfig.user}`);
  console.log(`  - Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  - Pool: ${databaseConfig.pool.min}-${databaseConfig.pool.max}`);
}