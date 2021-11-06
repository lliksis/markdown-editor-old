/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    purge: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            backgroundColor: colors.gray[700]
        },
        extend: {}
    },
    variants: {
        extend: {},
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui']
        }
    },
    plugins: []
};
