-- Email Triggers for AFGHANIUM Donation App
-- These triggers automatically send emails when certain events occur

-- Trigger for donation confirmation email
CREATE OR REPLACE FUNCTION send_donation_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send donation confirmation email
  PERFORM
    net.http_post(
      url := (SELECT value FROM site_content WHERE key = 'supabase_url') || '/functions/v1/send-donation-confirmation',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT value FROM site_content WHERE key = 'supabase_service_key')
      ),
      body := jsonb_build_object(
        'donation_id', NEW.donation_id,
        'full_name', NEW.full_name,
        'email', NEW.email,
        'amount', NEW.amount,
        'department', NEW.department,
        'payment_method', NEW.payment_method,
        'message', NEW.message
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on donations table
DROP TRIGGER IF EXISTS trigger_send_donation_confirmation ON donations;
CREATE TRIGGER trigger_send_donation_confirmation
  AFTER INSERT ON donations
  FOR EACH ROW
  EXECUTE FUNCTION send_donation_confirmation();

-- Trigger for message notification email
CREATE OR REPLACE FUNCTION send_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send message notification email
  PERFORM
    net.http_post(
      url := (SELECT value FROM site_content WHERE key = 'supabase_url') || '/functions/v1/send-message-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT value FROM site_content WHERE key = 'supabase_service_key')
      ),
      body := jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'subject', NEW.subject,
        'message', NEW.message
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on messages table
DROP TRIGGER IF EXISTS trigger_send_message_notification ON messages;
CREATE TRIGGER trigger_send_message_notification
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION send_message_notification();

-- Trigger for impact notification email
CREATE OR REPLACE FUNCTION send_impact_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send if donation_id is provided
  IF NEW.donation_id IS NOT NULL THEN
    -- Call the Edge Function to send impact notification email
    PERFORM
      net.http_post(
        url := (SELECT value FROM site_content WHERE key = 'supabase_url') || '/functions/v1/send-impact-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT value FROM site_content WHERE key = 'supabase_service_key')
        ),
        body := jsonb_build_object(
          'title', NEW.title,
          'description', NEW.description,
          'cost', NEW.cost,
          'department', NEW.department,
          'donation_id', NEW.donation_id,
          'image_url', NEW.image_url
        )
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on impacts table
DROP TRIGGER IF EXISTS trigger_send_impact_notification ON impacts;
CREATE TRIGGER trigger_send_impact_notification
  AFTER INSERT ON impacts
  FOR EACH ROW
  EXECUTE FUNCTION send_impact_notification();

-- Trigger for emergency campaign notification
CREATE OR REPLACE FUNCTION send_emergency_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send when campaign becomes active
  IF NEW.is_active = true AND (OLD.is_active = false OR OLD IS NULL) THEN
    -- Call the Edge Function to send emergency notification email
    PERFORM
      net.http_post(
        url := (SELECT value FROM site_content WHERE key = 'supabase_url') || '/functions/v1/send-emergency-notification',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (SELECT value FROM site_content WHERE key = 'supabase_service_key')
        ),
        body := jsonb_build_object(
          'name_en', NEW.name_en,
          'description_en', NEW.description_en,
          'goal_amount', NEW.goal_amount,
          'urgent_until', NEW.urgent_until
        )
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on emergency_campaigns table
DROP TRIGGER IF EXISTS trigger_send_emergency_notification ON emergency_campaigns;
CREATE TRIGGER trigger_send_emergency_notification
  AFTER INSERT OR UPDATE ON emergency_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION send_emergency_notification();

