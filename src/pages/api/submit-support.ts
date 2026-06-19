export const prerender = false;

import type { APIRoute } from 'astro';

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

	const apiKey = import.meta.env.BREVO_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ ok: false, error: 'Configuration error.' }), { status: 500 });
	}

	const userTypeLabel = userType === 'venue' ? 'Venue Manager' : 'Booker';

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
