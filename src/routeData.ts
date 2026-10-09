import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import {
	SITE_URL, SITE_NAME, SECTION_NAMES, PLACEHOLDER_IDS,
	organizationSchema, websiteSchema, breadcrumbSchema,
} from './lib/seo';

/** Adds SEO and structured data to every Starlight page. */
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
	const { entry, head } = route;
	const path = context.url.pathname;
	const id = entry.id.replace(/\/index$/, '');
	const title = entry.data.title as string;
	const description = (entry.data.description as string | undefined) ?? '';
	const isHome = entry.id === 'index';
	const is404 = entry.id === '404';
	const noindex = is404 || PLACEHOLDER_IDS.has(id);

	const meta = (attrs: Record<string, string>) => head.push({ tag: 'meta', attrs });
	meta({ property: 'og:site_name', content: SITE_NAME });
	meta({ property: 'og:locale', content: 'en_GB' });
	meta({ property: 'og:image:alt', content: 'Haveaspot support: guides for venues and bookers' });
	meta({ name: 'twitter:image', content: `${SITE_URL}/default-social-preview.png` });
	meta({ name: 'theme-color', content: '#021300' });
	meta({
		name: 'robots',
		content: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
	});

	const segments = path.split('/').filter(Boolean);
	const crumbs: { name: string; path: string }[] = [];
	if (!isHome && !is404 && segments.length) {
		const section = SECTION_NAMES[segments[0]];
		if (section) crumbs.push({ name: section, path: `/${segments[0]}/` });
		if (segments.length > 1 || !section) crumbs.push({ name: title, path });
	}

	const graph: Record<string, unknown>[] = [organizationSchema, websiteSchema];
	if (!is404) {
		graph.push({
			'@type': isHome ? 'WebPage' : 'TechArticle',
			'@id': `${SITE_URL}${path}#webpage`,
			url: `${SITE_URL}${path}`,
			...(isHome ? { name: title } : { headline: title }),
			description,
			isPartOf: { '@id': `${SITE_URL}/#website` },
			author: { '@id': organizationSchema['@id'] },
			publisher: { '@id': organizationSchema['@id'] },
			inLanguage: 'en-GB',
		});
		if (crumbs.length) graph.push(breadcrumbSchema(crumbs));
	}
	head.push({
		tag: 'script',
		attrs: { type: 'application/ld+json' },
		content: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
	});
	head.push({
		tag: 'link',
		attrs: { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM-readable site summary' },
	});
});
