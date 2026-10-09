import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL, CONTACT_EMAIL, SECTION_NAMES, PLACEHOLDER_IDS } from '../lib/seo';

export const GET: APIRoute = async () => {
	const docs = (await getCollection('docs')).filter((d) => !PLACEHOLDER_IDS.has(d.id) && d.id !== 'index');
	const groups = new Map<string, typeof docs>();
	for (const d of docs) {
		const key = d.id.split('/')[0];
		groups.set(key, [...(groups.get(key) ?? []), d]);
	}
	const sections = [...groups.entries()]
		.map(([key, items]) => {
			const heading = SECTION_NAMES[key] ?? key;
			const lines = items
				.sort((a, b) => a.id.localeCompare(b.id))
				.map((d) => `- [${d.data.title}](${SITE_URL}/${d.id.replace(/\/index$/, '')}/)${d.data.description ? `: ${d.data.description}` : ''}`);
			return `## ${heading}\n${lines.join('\n')}`;
		})
		.join('\n\n');

	const body = `# Haveaspot Support

> Help centre for Haveaspot, a UK online booking platform for community venues (village halls, schools, sports and arts spaces). Guides for venues ("Spots") on listing, payments, cancellations and managing bookings, and for bookers on booking, fees, cancellations and disputes. Venues list free with no commission; bookers pay a small booking fee; payments run through Stripe.

Contact: ${CONTACT_EMAIL}. Main platform: https://haveaspot.com. About the company: https://about.haveaspot.com.

${sections}

## Optional
- [Full guide text for LLMs](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap-index.xml)
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
