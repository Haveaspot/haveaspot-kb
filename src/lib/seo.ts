export const SITE_URL = 'https://support.haveaspot.com';
export const PLATFORM_URL = 'https://haveaspot.com';
export const SITE_NAME = 'Haveaspot';
export const CONTACT_EMAIL = 'hello@haveaspot.com';
export const SOCIAL_LINKS = [
	'https://www.facebook.com/haveaspot',
	'https://www.instagram.com/haveaspot',
	'https://www.linkedin.com/company/haveaspot',
];

/** Starlight template placeholders that should not be indexed or listed. */
export const PLACEHOLDER_IDS = new Set(['guides/example', 'reference/example']);

const ORG_ID = `${PLATFORM_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE_NAME,
	url: PLATFORM_URL,
	logo: `${SITE_URL}/logo.png`,
	description:
		'Haveaspot is an online booking platform for community venues such as village halls, schools, sports clubs and arts spaces in the UK. Venues list for free and take no commission; bookers pay a small booking fee.',
	email: CONTACT_EMAIL,
	areaServed: { '@type': 'Country', name: 'United Kingdom' },
	sameAs: SOCIAL_LINKS,
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'customer support',
		email: CONTACT_EMAIL,
		availableLanguage: 'English',
	},
};

export const websiteSchema = {
	'@type': 'WebSite',
	'@id': SITE_ID,
	url: SITE_URL,
	name: `${SITE_NAME} Support`,
	publisher: { '@id': ORG_ID },
	inLanguage: 'en-GB',
};

export const SECTION_NAMES: Record<string, string> = {
	spots: 'For Spots',
	bookers: 'For Bookers',
};

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: [{ name: 'Support', path: '/' }, ...crumbs].map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: `${SITE_URL}${c.path}`,
		})),
	};
}
