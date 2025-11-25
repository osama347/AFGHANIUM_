# Admin Access Guide

## Accessing the Admin Dashboard

The admin panel is **hidden from public navigation** for security. To access it:

1. **Direct URL**: Go to `http://localhost:5175/admin` (or your production URL + `/admin`)
2. **Login**: Use your Supabase authentication credentials

## Setup Admin User

### 1. Create Admin User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter email and password
5. Click **Create User**

### 2. Admin Routes

Once logged in at `/admin`, you can access:

- `/admin/dashboard` - Statistics and overview
- `/admin/donations` - View all donations
- `/admin/impacts` - Manage impact proofs

## Security Note

Admin access is intentionally removed from the public website navigation to prevent:
- Unauthorized access attempts
- Drawing attention to admin functionality
- Social engineering attacks

Only authorized personnel with direct URL knowledge can access the admin panel.

## Testing Without Supabase

If you haven't set up Supabase yet:
- The app will run in demo mode
- Admin authentication won't work
- You can still view the UI by navigating to `/admin`
- You'll see appropriate warnings in the console

## Production Deployment

For production:
1. Set up proper Supabase Row Level Security (RLS)  
2. Configure admin email/password in Supabase Auth
3. Consider adding IP whitelist for admin routes
4. Enable 2FA for admin accounts
