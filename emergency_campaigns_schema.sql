-- Emergency Campaigns Table
-- Allows admins to create and manage emergency relief campaigns

CREATE TABLE IF NOT EXISTS emergency_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Campaign Names (Multi-language)
    name_en TEXT NOT NULL,
    name_dari TEXT,
    name_pashto TEXT,
    
    -- Campaign Descriptions (Multi-language)
    description_en TEXT NOT NULL,
    description_dari TEXT,
    description_pashto TEXT,
    
    -- Impact Messages (Multi-language)
    impact_message_en TEXT,
    impact_message_dari TEXT,
    impact_message_pashto TEXT,
    
    -- Campaign Settings
    icon TEXT DEFAULT '🚨',
    goal_amount DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT false, -- Toggle to show/hide on homepage
    urgent_until TIMESTAMP, -- Auto-hide after this date
    priority INTEGER DEFAULT 1, -- Display order (lower = higher priority)
    
    -- Quick Donate Amounts (JSON array)
    quick_amounts JSONB DEFAULT '[25, 50, 100, 250]'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE emergency_campaigns ENABLE ROW LEVEL SECURITY;

-- Public can view active campaigns
CREATE POLICY "Anyone can view active emergency campaigns"
    ON emergency_campaigns
    FOR SELECT
    USING (is_active = true);

-- Only authenticated users (admins) can manage campaigns
CREATE POLICY "Admins can manage emergency campaigns"
    ON emergency_campaigns
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create index for performance
CREATE INDEX idx_emergency_campaigns_active ON emergency_campaigns(is_active, priority);
CREATE INDEX idx_emergency_campaigns_urgent_until ON emergency_campaigns(urgent_until);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_emergency_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamp
CREATE TRIGGER emergency_campaigns_updated_at
    BEFORE UPDATE ON emergency_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_emergency_campaigns_updated_at();

-- View to get emergency campaigns with donation stats
CREATE OR REPLACE VIEW emergency_campaigns_with_stats AS
SELECT 
    ec.*,
    COALESCE(SUM(d.amount), 0) as current_amount,
    COUNT(d.id) as donation_count,
    CASE 
        WHEN ec.goal_amount > 0 THEN 
            ROUND((COALESCE(SUM(d.amount), 0) / ec.goal_amount) * 100, 2)
        ELSE 0 
    END as progress_percentage
FROM emergency_campaigns ec
LEFT JOIN donations d ON d.department = ec.id::text AND d.status = 'completed'
GROUP BY ec.id;

-- Grant permissions
GRANT SELECT ON emergency_campaigns_with_stats TO anon, authenticated;

-- Sample data (optional - you can add via admin panel instead)
INSERT INTO emergency_campaigns (
    name_en, name_dari, name_pashto,
    description_en, description_dari, description_pashto,
    impact_message_en, impact_message_dari, impact_message_pashto,
    icon, goal_amount, is_active, urgent_until, priority
) VALUES (
    'Herat Earthquake Relief 2024',
    'کمک به زلزله‌زدگان هرات ۲۰۲۴',
    'د ۲۰۲۴ کال د هرات د زلزلې مرسته',
    'Emergency aid for families affected by the devastating October 2024 earthquakes in Herat province',
    'کمک‌های اضطراری برای خانواده‌های آسیب‌دیده از زلزله‌های ویرانگر اکتبر ۲۰۲۴ در ولایت هرات',
    'د هرات په ولایت کې د ۲۰۲۴ کال د اکتوبر ویجاړونکو زلزلو څخه زیانمن شویو کورنیو لپاره بیړنۍ مرستې',
    'Your $50 provides emergency shelter for one family for one month',
    '۵۰ دلار شما سرپناه اضطراری برای یک خانواده برای یک ماه فراهم می‌کند',
    'ستاسو ۵۰ ډالر د یوې کورنۍ لپاره د یوې میاشتې لپاره بیړني سرپناه چمتو کوي',
    '🏚️',
    150000,
    false, -- Set to true via admin panel to show
    '2025-06-30',
    1
) ON CONFLICT DO NOTHING;
