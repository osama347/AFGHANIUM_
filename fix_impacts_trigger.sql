-- Fix for Impact Trigger Issue
-- The send_impact_notification trigger requires 'net' schema which may not be enabled
-- This drops the problematic trigger to allow impacts to be created

-- 1. Drop the problematic trigger on impacts
DROP TRIGGER IF EXISTS trigger_send_impact_notification ON impacts;

-- 2. Verify the trigger is removed
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'impacts'
ORDER BY trigger_name;
