// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://support.haveaspot.com',
    integrations: [
        starlight({
            title: 'Haveaspot',
            favicon: '/favicon.svg',
            logo: {
                src: './src/assets/logo.webp',
                replacesTitle: true,
            },
            head: [
                {
                    tag: 'link',
                    attrs: {
                        rel: 'preconnect',
                        href: 'https://fonts.googleapis.com',
                    },
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'preconnect',
                        href: 'https://fonts.gstatic.com',
                        crossorigin: true,
                    },
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'stylesheet',
                        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:image',
                        content: 'https://support.haveaspot.com/default-social-preview.png',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        name: 'twitter:card',
                        content: 'summary_large_image',
                    },
                },
            ],
            customCss: ['./src/styles/custom.css'],
            components: {
                SocialIcons: './src/components/HeaderButton.astro',
                Footer: './src/components/Footer.astro',
            },
            social: [
                {
                    label: 'Contact',
                    icon: 'email',
                    href: 'https://haveaspot.com/contact/'
                }
            ],
            sidebar: [
                { label: 'For Spots', autogenerate: { directory: 'spots' } },
                { label: 'For Bookers', autogenerate: { directory: 'bookers' } },
            ],
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});