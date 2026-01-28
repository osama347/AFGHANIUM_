# AFGHANIUM - Afghan Charity Donation Platform

A modern, transparent donation platform for Afghan humanitarian relief, built with React, Vite, Tailwind CSS, and Supabase.

## Features

- ✅ **10 Departments**: Orphan support, widows, poor families, emergency food, education, winter relief, medical aid, water wells, refugees, Ramadan/Zakat
- ✅ **Multiple Payment Methods**: Stripe (Visa/Mastercard), PayPal, Cryptocurrency (BTC/ETH/USDT/USDC), Bank Transfer
- ✅ **Donation Tracking**: Track donations by unique ID (AFG-XXXXXX) or donor name
- ✅ **Impact Proofs**: Visual documentation of how donations are used
- ✅ **Multi-Language**: English, Dari, Pashto
- ✅ **Admin Dashboard**: Manage donations and upload impact proofs
- ✅ **Email Notifications**: Automated emails for donations, messages, impacts, and emergencies
- ✅ **Responsive Design**: Works great on all devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with Afghan-inspired design patterns
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images
- **Payments**: Stripe, PayPal, Crypto wallets
- **Email**: MailerSend SMTP via Supabase Edge Functions
- **Routing**: React Router v6
- **Icons**: Lucide React

## Setup Instructions

### 1. Clone & Install

```bash
cd "/Users/mc/Desktop/Web APP Donation/AFGHANIUM "
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Optional - for card payments)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# PayPal Configuration (Optional)
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id

# Crypto Wallet Addresses (Optional - for crypto donations)
VITE_CRYPTO_WALLET_BTC=your_btc_wallet_address
VITE_CRYPTO_WALLET_ETH=your_eth_wallet_address
VITE_CRYPTO_WALLET_USDT=your_usdt_wallet_address
VITE_CRYPTO_WALLET_USDC=your_usdc_wallet_address

# Bank Transfer Information (Optional)
VITE_BANK_NAME=Your Bank Name
VITE_BANK_IBAN=Your IBAN Number
VITE_BANK_SWIFT=Your SWIFT Code
VITE_BANK_ACCOUNT_NAME=Account Holder Name

# App Configuration
VITE_APP_NAME=AFGHANIUM
VITE_APP_URL=http://localhost:5173
```

### 3. Supabase Setup

Create the following tables in your Supabase project:

#### Donations Table
```sql
CREATE TABLE donations (
  id BIGSERIAL PRIMARY KEY,
  donation_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  department TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_reference TEXT,  -- For manual transfer reference numbers
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Impacts Table
```sql
CREATE TABLE impacts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  department TEXT NOT NULL,
  image_url TEXT,
  donation_id TEXT,
  admin_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Storage Bucket
Create a public storage bucket named `impact-photos` in Supabase Storage.

### 4. Email Setup (Optional)

The app includes automated email notifications for donations, messages, impacts, and emergency campaigns.

#### Deploy Edge Functions

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the email functions
supabase functions deploy send-email
supabase functions deploy send-donation-confirmation
supabase functions deploy send-message-notification
supabase functions deploy send-impact-notification
supabase functions deploy send-emergency-notification
```

#### Configure Email Triggers

Run the `email_triggers.sql` file in your Supabase SQL Editor to create database triggers that automatically send emails.

Update the site_content table with your Supabase URL and service role key:

```sql
UPDATE site_content SET value = 'https://your-project.supabase.co' WHERE key = 'supabase_url';
UPDATE site_content SET value = 'your-service-role-key' WHERE key = 'supabase_service_key';
```

#### Email Events

- **Donation Confirmation**: Sent to donor when donation is submitted
- **Message Notification**: Sent to admin when contact message is received
- **Impact Notification**: Sent to donor when impact proof is uploaded for their donation
- **Emergency Campaign**: Sent to admin when emergency campaign is activated

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

### 6. Build for Production

```bash
npm run build
npm run preview
```

## Admin Access

### Create Admin User

In Supabase Dashboard → Authentication → Users, create a new user with email and password. This user can then login at `/admin`.

## Project Structure

```
src/
├─ components/         # Reusable UI components
│  ├─ Admin/          # Admin dashboard components
├─ pages/             # All pages
├─ sections/          # Homepage sections (future expansion)
├─ contexts/          # React contexts (Language)
├─ hooks/             # Custom React hooks
├─ supabase/          # Supabase client and services
├─ utils/             # Utility functions
└─ services/          # External services (Stripe, etc.)
```

## Key Pages

- **Home** (`/`): Hero, stats, departments, testimonials
- **Departments** (`/departments`): All 10 charity departments
- **Donate** (`/donate`): Donation form with payment options
- **Track** (`/track`): Track donations by ID or name
- **Impact Stories** (`/impact`): View all impact proofs
- **About** (`/about`): Mission, vision, values, goals
- **Admin** (`/admin`): Protected admin dashboard

## Multi-Language

The app supports three languages:
- **English** (en) - Fully translated
- **Dari** (dari) - Placeholder structure created
- **Pashto** (pashto) - Placeholder structure created

To add Dari/Pashto translations, edit:
- `/public/locales/dari.json`
- `/public/locales/pashto.json`

Replace `[TRANSLATE: ...]` placeholders with actual translations.

## Payment Methods

### Stripe
Add your Stripe publishable key to `VITE_STRIPE_PUBLISHABLE_KEY` in `.env`.

### PayPal
Add your PayPal client ID to `VITE_PAYPAL_CLIENT_ID` in `.env`.

### Cryptocurrency
Add wallet addresses for BTC, ETH, USDT, USDC to `.env`. Users will be shown these addresses to send payments manually.

### Bank Transfer
Add bank details to `.env`. Users will be shown instructions for wire transfer.

## Color Scheme

- **Primary Green**: `#3A9D58` (Emerald Forest Green)
- **Secondary Sage**: `#C4D7C4` (Pale Sage Green)
- **Accent Gold**: `#D4AF37`
- **Dark Green**: `#1F5130`

## Support

For issues or questions, contact: info@afghanium.org

## License

© 2024 AFGHANIUM. All rights reserved.
