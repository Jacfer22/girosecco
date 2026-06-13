import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        asfalto: '#15181A',
        cemento: '#F0F1F2',
        segnale: '#F2B705',
        cartello: '#8A5A2B',
        bosco: '#3E5C45',
        guardrail: '#C6CACD',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        hand: ['var(--font-hand)'],
      },
    },
  },
  plugins: [],
};
export default config;
