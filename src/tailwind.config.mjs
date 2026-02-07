/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.03em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.04em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.35', letterSpacing: '0.05em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '0.06em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.07em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '0.08em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '0.09em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '0.1em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1.0', letterSpacing: '0.12em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1.0', letterSpacing: '0.15em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "syne",
                paragraph: "space grotesk"
            },
            colors: {
                'accent-electric-blue': '#00FFFF',
                'accent-cyan': '#00BCD4',
                'accent-neon-purple': '#BF00FF',
                'low-risk-green': '#39FF14',
                'low-risk-green-foreground': '#05070D',
                'medium-risk-amber': '#FFBF00',
                'medium-risk-amber-foreground': '#05070D',
                'high-risk-red': '#FF0000',
                'high-risk-red-foreground': '#FFFFFF',
                background: '#05070D',
                secondary: '#1A202C',
                foreground: '#E2E8F0',
                'secondary-foreground': '#E2E8F0',
                'primary-foreground': '#FFFFFF',
                primary: '#05070D'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
