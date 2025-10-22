# Row Level Security (RLS) Implementation Guide

**CRITICAL SECURITY FIX**  
**Date**: October 7, 2025  
**Priority**: IMMEDIATE ACTION REQUIRED

---

## 🚨 Current Security Issue

**Problem**: RLS is NOT enabled on the `users` table  
**Risk**: Any authenticated user can potentially access other users' profile data  
**Impact**: Violation of data privacy and attorney-client confidentiality

---

## ✅ Solution: Enable RLS on Users Table

I've created a migration script at [`supabase/migrations/enable_users_rls.sql`](supabase/migrations/enable_users_rls.sql) that will:

1. Enable Row Level Security on the users table
2. Create policies so users can only access their own data
3. Allow service role (admin functions) to access all users
4. Verify the implementation

---

## 🔧 How to Apply the Fix

### **Option 1: Using Supabase Dashboard (Recommended)**

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/hxyyqidiixyshsszqmqd

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the migration script**
   - Open [`supabase/migrations/enable_users_rls.sql`](supabase/migrations/enable_users_rls.sql)
   - Copy the entire content
   - Paste into the SQL Editor

4. **Run the migration**
   - Click "Run" button
   - You should see: "RLS successfully enabled on users table"

5. **Verify RLS is enabled**
   - Go to "Database" → "Tables" → "users"
   - Check that "RLS enabled" toggle is ON
   - You should see 3 policies listed

---

### **Option 2: Using Supabase CLI**

```bash
# Navigate to your project directory
cd /Users/yassinechenik/Downloads/lcg/Voxnow/voxnow-website

# Apply the migration
supabase db push

# Or run the migration directly
supabase db execute -f supabase/migrations/enable_users_rls.sql
```

---

## 🧪 Testing RLS Implementation

### **Test 1: Verify RLS is Enabled**

Run this in Supabase SQL Editor:
```sql
-- Should return TRUE
SELECT relrowsecurity 
FROM pg_class 
WHERE relname = 'users';
```

### **Test 2: Verify Policies Exist**

Run this in Supabase SQL Editor:
```sql
-- Should return 3 policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users';
```

### **Test 3: Test Data Isolation**

1. **Login as User A** (ta.delaey@advocat.be)
2. **Open browser console** and run:
```javascript
// Should only return User A's data
const { data, error } = await supabase
  .from('users')
  .select('*');
console.log('My data:', data);
```

3. **Try to access another user's data**:
```javascript
// Should return empty or error (not other user's data)
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'other-user@example.com');
console.log('Other user data:', data); // Should be empty or error
```

---

## 📋 RLS Policies Explained

### **Policy 1: users_own_data**
```sql
USING (id = auth.uid())
```
- Users can only access rows where `id` matches their authenticated user ID
- Applies to: SELECT, UPDATE, DELETE operations

### **Policy 2: users_own_data_via_auth_id**
```sql
USING (auth_id = auth.uid())
```
- Alternative policy if your schema uses `auth_id` column
- Provides same protection via different column

### **Policy 3: users_service_role_access**
```sql
TO service_role USING (true)
```
- Allows admin Edge Functions to access all users
- Only works with service role key (server-side only)
- Required for admin user management

---

## ⚠️ Important Notes

### **What RLS Does:**
✅ Prevents users from seeing other users' emails, phones, names  
✅ Ensures data privacy and confidentiality  
✅ Protects attorney-client information  
✅ Allows admin functions to work properly  

### **What RLS Does NOT Do:**
❌ Does not hide the anonymous key (that's by design)  
❌ Does not prevent users from seeing their own JWT token  
❌ Does not affect Edge Functions using service role  

### **After Enabling RLS:**
- Users will only see their own profile data
- Admin functions will continue to work (using service role)
- Dashboard will only show user's own voicemails
- No code changes needed - RLS works at database level

---

## 🔍 Verification Checklist

After applying the migration, verify:

- [ ] RLS is enabled on `users` table (check in Supabase dashboard)
- [ ] 3 policies are active on `users` table
- [ ] Test: User A cannot see User B's profile data
- [ ] Test: User can see their own profile data
- [ ] Test: Admin functions still work (user creation, updates)
- [ ] Test: Dashboard loads correctly for authenticated users

---

## 🚀 Next Steps After RLS Implementation

Once RLS is enabled on the users table:

1. **Verify all other tables** have RLS enabled:
   - ✅ voicemails
   - ✅ voicemail_analysis  
   - ✅ audio_files
   - ⚠️ users (you're fixing this now)

2. **Test the complete application**:
   - Login as different users
   - Verify data isolation
   - Test admin functions

3. **Continue with remaining security fixes**:
   - Input validation
   - Password requirements
   - Error handling

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Supabase logs**: Dashboard → Logs → Database
2. **Verify policies**: Dashboard → Database → Tables → users → Policies
3. **Test queries**: Use SQL Editor to test data access

**Common Issues:**
- "Permission denied" errors → RLS is working correctly!
- Admin functions fail → Check service role key is used
- Users can't see own data → Check policy USING clause

---

## 🎯 Summary

**What to do RIGHT NOW:**

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run the migration script from [`supabase/migrations/enable_users_rls.sql`](supabase/migrations/enable_users_rls.sql)
4. Verify RLS is enabled
5. Test with different user accounts

This is a **CRITICAL** security fix that must be implemented before production deployment.