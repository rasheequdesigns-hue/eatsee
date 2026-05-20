-- ==========================================
-- Eatsee Food Products - Supabase Database Schema
-- Run these queries in your Supabase SQL Editor to initialize the database tables and permit CRUD access.
-- ==========================================

-- Clean up existing incomplete tables if any
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 1. Create Products Table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    packing TEXT NOT NULL,
    image TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    storage TEXT NOT NULL,
    nutrition JSONB NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Inquiries Table (Wholesale & Desk inquiries)
CREATE TABLE inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Site Settings Table (For dynamic content management)
CREATE TABLE site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- 4. Create Brand Stories Table (For dynamic scrollytelling chronicle)
CREATE TABLE brand_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_number INTEGER NOT NULL,
    chapter_subtitle TEXT NOT NULL,
    main_heading TEXT NOT NULL,
    paragraph_1 TEXT NOT NULL,
    paragraph_2 TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- SECURITY CONFIGURATION (Row Level Security & Policies)
-- ==========================================

-- OPTION A: Disable RLS entirely to allow simple direct CRUD access
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_stories DISABLE ROW LEVEL SECURITY;

-- OPTION B: Define open permissive policies so that even if RLS is enabled/enforced via Supabase UI,
-- the anonymous client key (anon role) still has full CRUD permissions to manage products, settings, and inquiries.

-- 1. Products Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read products" ON products;
DROP POLICY IF EXISTS "Allow anonymous insert products" ON products;
DROP POLICY IF EXISTS "Allow anonymous update products" ON products;
DROP POLICY IF EXISTS "Allow anonymous delete products" ON products;

CREATE POLICY "Allow anonymous read products" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anonymous insert products" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anonymous update products" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous delete products" ON products FOR DELETE TO anon, authenticated USING (true);

-- 2. Inquiries Policies
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow anonymous insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow anonymous delete inquiries" ON inquiries;

CREATE POLICY "Allow anonymous read inquiries" ON inquiries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anonymous insert inquiries" ON inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anonymous delete inquiries" ON inquiries FOR DELETE TO anon, authenticated USING (true);

-- 3. Site Settings Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read settings" ON site_settings;
DROP POLICY IF EXISTS "Allow anonymous write settings" ON site_settings;

CREATE POLICY "Allow anonymous read settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anonymous write settings" ON site_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Brand Stories Policies
ALTER TABLE brand_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read stories" ON brand_stories;
DROP POLICY IF EXISTS "Allow anonymous write stories" ON brand_stories;

CREATE POLICY "Allow anonymous read stories" ON brand_stories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anonymous write stories" ON brand_stories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Finally, let's keep it disabled by default so simple mode works, but policies exist if enabled!
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE brand_stories DISABLE ROW LEVEL SECURITY;
