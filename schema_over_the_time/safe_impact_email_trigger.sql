-- Safe impact notification trigger
-- This version will NEVER block impact inserts if email delivery fails
-- IMPORTANT: Use this only when VITE_IMPACT_EMAIL_MODE=trigger.
-- If VITE_IMPACT_EMAIL_MODE=client, do not create this trigger to avoid duplicate emails.

-- Enable pg_net extension (creates the net schema)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Recreate function with exception handling
CREATE OR REPLACE FUNCTION send_impact_notification()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text;
  service_key text;
BEGIN
  -- Only send when donation_id is present
  IF NEW.donation_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT value INTO supabase_url FROM site_content WHERE key = 'supabase_url';
  SELECT value INTO service_key FROM site_content WHERE key = 'supabase_service_key';

  -- If config is incomplete, skip safely
  IF supabase_url IS NULL OR service_key IS NULL THEN
    RAISE WARNING 'Impact notification skipped: missing supabase_url or supabase_service_key';
    RETURN NEW;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := supabase_url || '/functions/v1/send-impact-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object(
        'title', NEW.title,
        'description', NEW.description,
        'cost', NEW.cost,
        'donation_id', NEW.donation_id,
        'image_url', NEW.image_url,
        'media', COALESCE(NEW.media, '[]'::jsonb)
      )
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Impact notification failed for donation_id %: %', NEW.donation_id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_send_impact_notification ON impacts;
CREATE TRIGGER trigger_send_impact_notification
  AFTER INSERT ON impacts
  FOR EACH ROW
  EXECUTE FUNCTION send_impact_notification();

-- Check extension and trigger
SELECT extname FROM pg_extension WHERE extname = 'pg_net';
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'impacts'
ORDER BY trigger_name;
