import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://hxyyqidiixyshsszqmqd.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set it by running:');
  console.log('export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"');
  console.log('Then run: deno run --allow-net --allow-env update-user-password.ts');
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const userId = '7ac7d242-d16c-4efa-87c5-29fbd08a4718';
const newPassword = 'VoxNow_Huez673#';

async function updateUserPassword() {
  try {
    console.log(`🔄 Updating password for user ${userId}...`);

    // Update user password using Supabase Admin API
    console.log('🔐 Updating password in Supabase Auth...');
    const { error: passwordErr } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    
    if (passwordErr) {
      console.error('❌ Error updating password:', passwordErr);
      throw passwordErr;
    }
    
    console.log('✅ Password updated successfully');
    console.log('🎉 User password update completed successfully!');
    console.log(`📝 New password: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Error updating user password:', error);
    Deno.exit(1);
  }
}

// Run the function
updateUserPassword();
