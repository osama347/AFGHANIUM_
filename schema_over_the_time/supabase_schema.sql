-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.donations (
  id bigint NOT NULL DEFAULT nextval('donations_id_seq'::regclass),
  donation_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0::numeric),
  department text NOT NULL,
  payment_method text NOT NULL,
  message text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  transaction_reference text,
  CONSTRAINT donations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.emergency_campaigns (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name_en text NOT NULL,
  name_dari text,
  name_pashto text,
  description_en text NOT NULL,
  description_dari text,
  description_pashto text,
  impact_message_en text,
  impact_message_dari text,
  impact_message_pashto text,
  icon text DEFAULT '🚨'::text,
  goal_amount numeric NOT NULL CHECK (goal_amount >= 0::numeric),
  is_active boolean DEFAULT false,
  urgent_until timestamp without time zone,
  priority integer DEFAULT 1,
  quick_amounts jsonb DEFAULT '[25, 50, 100, 250]'::jsonb,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT emergency_campaigns_pkey PRIMARY KEY (id)
);
CREATE TABLE public.impacts (
  id bigint NOT NULL DEFAULT nextval('impacts_id_seq'::regclass),
  title text NOT NULL,
  description text NOT NULL,
  cost numeric NOT NULL CHECK (cost >= 0::numeric),
  department text NOT NULL,
  image_url text,
  donation_id text,
  admin_comment text,
  media jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT impacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  CONSTRAINT messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_content (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT site_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  location text,
  message text NOT NULL,
  amount numeric,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);



