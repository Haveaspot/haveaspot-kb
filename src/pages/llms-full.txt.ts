import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_URL, PLACEHOLDER_IDS } from '../lib/seo';

export const GET: APIRoute = async () => {
	const docs = (await getCollection('docs'))
		.filter((d) => !PLACEHOLDER_IDS.has(d.id) && d.id !== 'index')
		.sort((a, b) => a.id.localeCompare(b.id));
	const parts = docs.map((d) => {
		// Strip MDX imports and JSX components so only readable guide text remains.
		const text = (d.body ?? '')
			.replace(/^import .*$/gm, '')
			.replace(/<[A-Z][^>]*\/>/g, '')
			.replace(/<\/?[A-Z][^>]*>/g, '')
			.replace(/\n{3,}/g, '\n\n')
			.trim();
		return `# ${d.data.title}\nURL: ${SITE_URL}/${d.id.replace(/\/index$/, '')}/\n\n${text}`;
	});
	const body = `# Haveaspot Support: full guide text\n\n${parts.join('\n\n---\n\n')}\n`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
