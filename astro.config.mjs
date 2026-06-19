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
                    tag: 'meta',
                    attrs: {
                        name: 'format-detection',
                        content: 'telephone=no',
                    },
                },
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
                        href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
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
                Header: './src/components/Header.astro',
                SocialIcons: './src/components/HeaderButton.astro',
                Footer: './src/components/Footer.astro',
                PageFrame: './src/components/PageFrame.astro',
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
                {
                    label: 'For Bookers',
                    items: [
                        { label: 'Guides for Bookers', link: '/bookers/' },
                        { label: 'Account', autogenerate: { directory: 'bookers/account' } },
                        { label: 'Booking', autogenerate: { directory: 'bookers/booking' } },
                        { label: 'Fees and Payments', autogenerate: { directory: 'bookers/fees-and-payments' } },
                        { label: 'Cancellations', autogenerate: { directory: 'bookers/cancellations' } },
                        { label: 'Your Responsibilities', autogenerate: { directory: 'bookers/your-responsibilities' } },
                        { label: 'Disputes', autogenerate: { directory: 'bookers/disputes' } },
                        { label: 'Account Closure', autogenerate: { directory: 'bookers/account-closure' } },
                        { label: 'Legal and Policy', autogenerate: { directory: 'bookers/legal-and-policy' } },
                    ],
                },
            ],
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});