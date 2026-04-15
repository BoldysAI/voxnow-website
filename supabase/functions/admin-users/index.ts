import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Secure CORS configuration - only allow requests from specific origins
const getAllowedOrigins = () => {
  const allowedOrigins = [
    'https://voxnow.be',
    'https://voxnow.pt',
    'https://www.voxnow.be',
    'https://staging.voxnow.be', // Staging
    'http://localhost:8080', // Development
    'http://localhost:3000', // Alternative dev port
    'https://lovable.dev/', // Lovable Preview
  ];
  
  // Add environment-specific origins if needed
  const customOrigin = Deno.env.get('ALLOWED_ORIGIN');
  if (customOrigin) {
    allowedOrigins.push(customOrigin);
  }
  
  return allowedOrigins;
};

const getCorsHeaders = (origin?: string | null) => {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : 'null';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
};

interface CreateUserRequest {
  email: string
  password: string
  full_name?: string
  phone?: string
}

interface UpdateUserRequest {
  email?: string
  password?: string
  full_name?: string
  phone?: string
  email_confirm?: boolean
}

serve(async (req) => {
  // Get origin from request headers for CORS validation
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Missing Supabase configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment !== '')
    const userId = pathSegments[pathSegments.length - 1] !== 'admin-users' ? pathSegments[pathSegments.length - 1] : null

    switch (req.method) {
      case 'GET':
        // List all users from auth.users (trigger will keep public.users in sync)
        try {
          console.log('Fetching all users from auth.users')
          
          const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

          if (authError) {
            console.error('Error fetching auth users:', authError)
            return new Response(
              JSON.stringify({ error: 'Failed to fetch auth users', details: authError }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Get corresponding public user data for additional fields
          const { data: publicUsers, error: publicError } = await supabase
            .from('users')
            .select('*')

          if (publicError) {
            console.error('Error fetching public users:', publicError)
            // Continue without public data if there's an error
          }

          // Merge auth users with public user data
          const mergedUsers = authUsers.users.map(authUser => {
            const publicUser = publicUsers?.find(pu => pu.id === authUser.id)
            return {
              id: authUser.id,
              email: authUser.email,
              full_name: publicUser?.full_name || authUser.user_metadata?.full_name || null,
              phone: publicUser?.phone || authUser.phone || null,
              status: publicUser?.status || 'active',
              last_login: publicUser?.last_login,
              created_at: authUser.created_at,
              updated_at: publicUser?.updated_at || authUser.updated_at,
              demo_user: publicUser?.demo_user || false,
              email_confirmed_at: authUser.email_confirmed_at,
              last_sign_in_at: authUser.last_sign_in_at,
              banned_until: (authUser as any).banned_until || null
            }
          }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

          console.log(`Successfully fetched ${mergedUsers.length} users`)

          return new Response(
            JSON.stringify({ users: mergedUsers }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in GET users:', error)
          return new Response(
            JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      case 'POST':
        // Create new user (trigger will handle public.users creation)
        try {
          const { email, password, full_name, phone } = await req.json() as CreateUserRequest

          if (!email || !password) {
            return new Response(
              JSON.stringify({ error: 'Email and password are required' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log(`Creating user with email: ${email}`)

          // Create user in auth.users only - trigger will handle public.users
          const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            phone: phone || undefined,
            email_confirm: true,
            user_metadata: {
              full_name: full_name || '',
              phone: phone || ''
            }
          })

          if (authError) {
            console.error('Error creating auth user:', authError)
            return new Response(
              JSON.stringify({ error: 'Failed to create user', details: authError }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log(`Successfully created user: ${email}`)

          // Return created user data
          const createdUser = {
            id: authUser.user.id,
            email: authUser.user.email,
            full_name: full_name || null,
            phone: phone || null,
            status: 'active',
            demo_user: false,
            created_at: authUser.user.created_at,
            email_confirmed_at: authUser.user.email_confirmed_at,
            last_sign_in_at: null,
            banned_until: null
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              user: createdUser
            }),
            { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in POST user:', error)
          return new Response(
            JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      case 'PUT':
        // Update user (trigger will handle public.users sync)
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required for updates' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        try {
          const updateData = await req.json() as UpdateUserRequest

          console.log(`Updating user: ${userId}`)

          // Prepare auth user update data
          const authUpdateData: any = {}
          if (updateData.email) authUpdateData.email = updateData.email
          if (updateData.password) authUpdateData.password = updateData.password
          if (updateData.email_confirm !== undefined) authUpdateData.email_confirm = updateData.email_confirm
          if (updateData.phone !== undefined) authUpdateData.phone = updateData.phone

          // Update user_metadata for additional fields
          if (updateData.full_name !== undefined) {
            authUpdateData.user_metadata = { full_name: updateData.full_name }
          }

          // Update auth user - trigger will handle public.users sync
          const { data: updatedAuthUser, error: authError } = await supabase.auth.admin.updateUserById(userId, authUpdateData)
          
          if (authError) {
            console.error('Error updating auth user:', authError)
            return new Response(
              JSON.stringify({ error: 'Failed to update user auth data', details: authError }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log(`Successfully updated user: ${userId}`)

          // Get updated public user data (should be synced by trigger)
          const { data: publicUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

          // Merge the updated data for response
          const updatedUser = {
            id: updatedAuthUser.user.id,
            email: updatedAuthUser.user.email,
            full_name: publicUser?.full_name || updateData.full_name || null,
            phone: publicUser?.phone || updateData.phone || updatedAuthUser.user.phone || null,
            status: publicUser?.status || 'active',
            last_login: publicUser?.last_login,
            created_at: updatedAuthUser.user.created_at,
            updated_at: publicUser?.updated_at || updatedAuthUser.user.updated_at,
            demo_user: publicUser?.demo_user || false,
            email_confirmed_at: updatedAuthUser.user.email_confirmed_at,
            last_sign_in_at: updatedAuthUser.user.last_sign_in_at,
            banned_until: (updatedAuthUser.user as any).banned_until || null
          }

          return new Response(
            JSON.stringify({ success: true, user: updatedUser }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in PUT user:', error)
          return new Response(
            JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      case 'DELETE':
        // Delete user (trigger will handle public.users deletion)
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'User ID is required for deletion' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        try {
          console.log(`Deleting user: ${userId}`)

          // Delete from auth.users only - trigger will handle public.users deletion
          const { error: authError } = await supabase.auth.admin.deleteUser(userId)

          if (authError) {
            console.error('Error deleting auth user:', authError)
            return new Response(
              JSON.stringify({ error: 'Failed to delete user', details: authError }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log(`Successfully deleted user: ${userId}`)

          return new Response(
            JSON.stringify({ success: true, message: 'User deleted successfully' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error in DELETE user:', error)
          return new Response(
            JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
