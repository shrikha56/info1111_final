// This script handles Prisma database setup on Vercel deployment
const { execSync } = require('child_process');

// Function to execute shell commands and print output
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.stdout || error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Vercel deployment database setup');

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  runCommand('npx prisma generate');

  // Check if we're in a production environment (Vercel)
  if (process.env.VERCEL_ENV === 'production') {
    try {
      console.log('🔄 Running database migrations in production...');
      // Use prisma migrate deploy for production (applies migrations without prompts)
      runCommand('npx prisma migrate deploy');
      console.log('✅ Database migrations applied successfully');
    } catch (error) {
      console.error('❌ Failed to apply migrations');
      console.error(error);
      process.exit(1);
    }
  } else {
    console.log('🔄 Running in development mode, skipping migrations');
  }

  console.log('✅ Database setup completed');
}

main()
  .catch((e) => {
    console.error('❌ Deployment script failed');
    console.error(e);
    process.exit(1);
  });
