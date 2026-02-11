/**
 * Direct PostgreSQL Migration Runner
 * Uses pg library with Supabase pooler connection
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabase PostgreSQL connection string format
// postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const PROJECT_REF = 'ibagmveiwjewxtlyjovz';
const DB_PASSWORD = 'CareerPath2026!'; // Default Supabase password, may need to change

// Connection via pooler (port 6543 for transaction mode, 5432 for session)
const connectionString = `postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

async function runMigration(client, filename) {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', filename);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${filename}`);
        return false;
    }

    console.log(`\n📦 Running: ${filename}`);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
        await client.query(sql);
        console.log(`✅ Success: ${filename}`);
        return true;
    } catch (error) {
        if (error.message.includes('already exists') ||
            error.message.includes('duplicate key')) {
            console.log(`⚠️  Skipped (already exists): ${filename}`);
            return true;
        }
        console.error(`❌ Error in ${filename}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 CareerPath.id Database Migration');
    console.log('====================================\n');

    console.log('🔌 Connecting to Supabase PostgreSQL...');
    console.log(`   Project: ${PROJECT_REF}`);

    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('✅ Connected!\n');

        // Run migrations in order
        await runMigration(client, '004_expanded_seed.sql');
        await runMigration(client, '005_complete_schema.sql');

        console.log('\n✨ All migrations complete!');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n📝 You may need to update the database password.');
        console.log('   Get it from: Supabase Dashboard > Settings > Database > Connection string');
    } finally {
        await client.end();
    }
}

main();
