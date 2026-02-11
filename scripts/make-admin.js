
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase URL or Service Role Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function grantAdmin() {
    const email = 'kelompokpkmbisdig@gmail.com';
    console.log(`Searching for user: ${email}...`);

    // 1. Get User ID from Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('User not found in Auth system!');
        return;
    }

    console.log(`Found user ${user.id}. Updating role...`);

    // 2. Update public.users table
    const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating public.users:', updateError);
    } else {
        console.log('✅ Successfully updated public.users role to "admin"');
    }

    // 3. Update auth metadata (optional but good for sync)
    const { error: metaError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { role: 'admin' } }
    );

    if (metaError) {
        console.error('Error updating auth metadata:', metaError);
    } else {
        console.log('✅ Successfully updated auth metadata');
    }
}

grantAdmin();
