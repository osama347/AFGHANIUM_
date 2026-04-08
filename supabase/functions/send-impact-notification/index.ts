import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import nodemailer from 'npm:nodemailer@6.10.0';
import { corsHeaders } from '../_shared/cors.ts';

type ImpactPayload = {
  donation_id?: string;
  donor_name?: string;
  donor_email?: string;
  title?: string;
  description?: string;
  cost?: number;
  department?: string;
  image_url?: string;
  media?: string[];
};

const requiredEnv = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'EMAIL_FROM',
];

const getMissingEnv = () => requiredEnv.filter((key) => !Deno.env.get(key));

const formatCurrency = (amount: number | undefined) => {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const htmlBody = (payload: ImpactPayload) => {
  const mediaList = Array.isArray(payload.media)
    ? payload.media.filter(Boolean).map((url) => `<li><a href="${url}">${url}</a></li>`).join('')
    : '';

  return `
    <h2>Your donation has created impact</h2>
    <p>Dear ${payload.donor_name || 'Donor'},</p>
    <p>We are grateful for your support. Here is an impact update linked to your donation.</p>
    <ul>
      <li><strong>Donation ID:</strong> ${payload.donation_id || 'N/A'}</li>
      <li><strong>Impact Title:</strong> ${payload.title || 'N/A'}</li>
      <li><strong>Department:</strong> ${payload.department || 'N/A'}</li>
      <li><strong>Cost Used:</strong> ${formatCurrency(payload.cost)}</li>
    </ul>
    <p><strong>Description:</strong><br/>${payload.description || 'N/A'}</p>
    ${payload.image_url ? `<p><strong>Main Image:</strong> <a href="${payload.image_url}">${payload.image_url}</a></p>` : ''}
    ${mediaList ? `<p><strong>Media:</strong></p><ul>${mediaList}</ul>` : ''}
    <p>Thank you for trusting Afghanium.</p>
    <p>Regards,<br/>Afghanium Team</p>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const missingEnv = getMissingEnv();
  if (missingEnv.length > 0) {
    return new Response(
      JSON.stringify({ error: `Missing required env vars: ${missingEnv.join(', ')}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  let payload: ImpactPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!payload?.donor_email) {
    return new Response(JSON.stringify({ error: 'Missing donor_email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: Deno.env.get('SMTP_HOST')!,
      port: Number(Deno.env.get('SMTP_PORT') || '465'),
      secure: Number(Deno.env.get('SMTP_PORT') || '465') === 465,
      auth: {
        user: Deno.env.get('SMTP_USER')!,
        pass: Deno.env.get('SMTP_PASS')!,
      },
    });

    await transporter.sendMail({
      from: Deno.env.get('EMAIL_FROM')!,
      to: payload.donor_email,
      subject: `Impact Update for Donation ${payload.donation_id || ''}`.trim(),
      html: htmlBody(payload),
      text: [
        'Your donation has created impact.',
        `Donation ID: ${payload.donation_id || 'N/A'}`,
        `Impact Title: ${payload.title || 'N/A'}`,
        `Department: ${payload.department || 'N/A'}`,
        `Cost Used: ${formatCurrency(payload.cost)}`,
        `Description: ${payload.description || 'N/A'}`,
        payload.image_url ? `Main Image: ${payload.image_url}` : '',
      ].filter(Boolean).join('\n'),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
