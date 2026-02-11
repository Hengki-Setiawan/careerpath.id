/**
 * Migration Runner Script
 * Executes SQL migrations using Supabase service role
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    process.exit(1);
}

// Create admin client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function runMigration(filename: string) {
    const filePath = path.join(__dirname, 'supabase', 'migrations', filename);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Migration file not found: ${filePath}`);
        return false;
    }

    console.log(`\n📦 Running migration: ${filename}`);
    const sql = fs.readFileSync(filePath, 'utf8');

    // Split by statements for better error tracking
    // Note: This is a simple split; complex SQL may need better parsing
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} statements`);

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        if (!stmt) continue;

        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: stmt + ';' });
            if (error) {
                // Some errors are okay (like "already exists")
                if (error.message.includes('already exists') ||
                    error.message.includes('duplicate key') ||
                    error.message.includes('does not exist')) {
                    console.log(`   ⚠️  Statement ${i + 1}: ${error.message.substring(0, 50)}... (skipped)`);
                } else {
                    console.error(`   ❌ Statement ${i + 1} failed:`, error.message);
                }
            }
        } catch (e: any) {
            console.error(`   ❌ Exception at statement ${i + 1}:`, e.message);
        }
    }

    console.log(`✅ Completed: ${filename}`);
    return true;
}

async function main() {
    console.log('🚀 CareerPath.id Migration Runner');
    console.log('================================\n');
    console.log(`Supabase URL: ${supabaseUrl}`);

    // Run migrations in order
    const migrations = [
        '004_expanded_seed.sql',
        '005_complete_schema.sql'
    ];

    for (const migration of migrations) {
        await runMigration(migration);
    }

    console.log('\n✨ Migration complete!');
}

main().catch(console.error);
