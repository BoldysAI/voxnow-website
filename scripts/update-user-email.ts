import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://hxyyqidiixyshsszqmqd.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set it by running:');
  console.log('export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"');
  console.log('Then run: deno run --allow-net --allow-env update-user-email.ts');
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const userId = '7ac7d242-d16c-4efa-87c5-29fbd08a4718';
const newEmail = 'mandathuez@gmail.com';

async function updateUserEmail() {
  try {
    console.log(`🔄 Updating user ${userId} email to ${newEmail}...`);

    // Update Auth email and mark confirmed
    console.log('📧 Updating Supabase Auth...');
    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
      email: newEmail,
      email_confirm: true
    });
    
    if (updErr) {
      console.error('❌ Error updating auth user:', updErr);
      throw updErr;
    }
    
    console.log('✅ Auth user email updated successfully');

    // Mirror to public.users
    console.log('👤 Updating public users table...');
    const { error: pubErr } = await supabase
      .from('users')
      .update({ 
        email: newEmail, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);
      
    if (pubErr) {
      console.error('❌ Error updating public users table:', pubErr);
      throw pubErr;
    }
    
    console.log('✅ Public users table updated successfully');
    console.log('🎉 User email update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating user email:', error);
    Deno.exit(1);
  }
}

// Run the function
updateUserEmail();
