export const prerender = false;

import type { APIRoute } from 'astro';

/**
 * Logs the enquiry into the CRM's support tickets, in addition to the email
 * sent below — not instead of it. See src/pages/api/support/tickets.ts in
 * HAS-CRM for what receives this.
 *
 * CRM_SUPPORT_API_URL / CRM_SUPPORT_API_SECRET are both optional on purpose:
 * unset means "the CRM isn't wired up yet," which must be a silent no-op
 * rather than a broken support form. Any failure here — unreachable CRM,
 * wrong secret, a 500 on their end — is logged and swallowed, never thrown,
 * for the same reason.
 */
async function logToCrm(input: { name: string; email: string; userTypeLabel: string; message: string }): Promise<void> {
	const url = import.meta.env.CRM_SUPPORT_API_URL;
	const secret = import.meta.env.CRM_SUPPORT_API_SECRET;
	if (!url || !secret) return;

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				authorization: `Bearer ${secret}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				name: input.name,
				email: input.email,
				subject: `Support enquiry (${input.userTypeLabel})`,
				message: input.message,
				source: 'web_form',
			}),
		});
		if (!res.ok) {
			console.error('[support] CRM logging failed', res.status, await res.text().catch(() => ''));
		}
	} catch (err) {
		console.error('[support] CRM logging failed', err);
	}
}

export const POST: APIRoute = async ({ request }) => {
	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid request.' }), { status: 400 });
	}

	const { name, email, userType, message, honeypot, elapsed } = body as Record<string, string>;

	// Bot protection
	if (honeypot) return new Response(JSON.stringify({ ok: true }), { status: 200 });
	if (!elapsed || Number(elapsed) < 3000) return new Response(JSON.stringify({ ok: true }), { status: 200 });

	// Validation
	if (!name?.trim() || !email?.trim() || !userType || !message?.trim()) {
		return new Response(JSON.stringify({ ok: false, error: 'All fields are required.' }), { status: 400 });
	}

	const userTypeLabel = userType === 'venue' ? 'Venue Manager' : 'Booker';

	// Logged into the CRM before the Brevo email below, and not gated on
	// Brevo being configured — if BREVO_API_KEY is ever missing or wrong,
	// this is what stops that also costing the CRM copy. Awaited (not
	// fire-and-forget) because a serverless function can be frozen the
	// moment it returns a response, which would silently kill an un-awaited
	// request before it left the machine — but its own error handling means
	// nothing it does can affect what the visitor sees below.
	await logToCrm({ name: name.trim(), email: email.trim(), userTypeLabel, message: message.trim() });

	const apiKey = import.meta.env.BREVO_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ ok: false, error: 'Configuration error.' }), { status: 500 });
	}

	try {
		const res = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'api-key': apiKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sender: { name: 'Haveaspot Support', email: 'hello@haveaspot.com' },
				to: [{ email: 'support@haveaspot.com', name: 'Haveaspot Support' }],
				replyTo: { email: email.trim(), name: name.trim() },
				subject: `Support: ${name.trim()} (${userTypeLabel})`,
				htmlContent: `
					<h2>New Support Enquiry</h2>
					<p><strong>Name:</strong> ${name.trim()}</p>
					<p><strong>Email:</strong> ${email.trim()}</p>
					<p><strong>User Type:</strong> ${userTypeLabel}</p>
					<p><strong>Message:</strong></p>
					<p>${message.trim().replace(/\n/g, '<br>')}</p>
				`,
			}),
		});

		if (!res.ok) {
			const errText = await res.text();
			console.error('Brevo error:', errText);
			return new Response(JSON.stringify({ ok: false, error: 'Failed to send. Please try again.' }), { status: 500 });
		}

		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (err) {
		console.error('Support submission error:', err);
		return new Response(JSON.stringify({ ok: false, error: 'Network error. Please try again.' }), { status: 500 });
	}
};
